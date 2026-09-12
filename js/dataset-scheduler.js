// ==========================================================================
// CppAIService & muduo Dual-Core Engineering OS
// Phase 7: 智能任务调度与日历同步引擎 (dataset-scheduler.js)
// 核心哲学：“真实读取外部日历与任务，严禁虚构数据；6级流水线优先，赤字弹性压缩；未完成必须归因诊断，复盘打通能力凭证”
// RFC 5545 iCal/ICS Parser + Google Tasks + Priority Pipeline + Deficit Compressor + Diagnostic Rescheduling
// ==========================================================================

(function(global) {
  'use strict';

  // 1. 任务优先级体系定义 (6 级严格流水线)
  const SCHEDULER_PRIORITY_TIERS = {
    s_core: {
      key: 's_core',
      name: 'S级：项目核心主干',
      tier: 'S',
      standardMinutes: 180, // 3.0h
      minSurvivalMinutes: 90, // 严守最低保底 1.5h
      color: 'amber',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'CppAIService 服务层与 muduo Reactor 核心代码实现与重构（神圣不可侵犯）'
    },
    a_supporting: {
      key: 'a_supporting',
      name: 'A级：支撑技术与系统深挖',
      tier: 'A',
      standardMinutes: 60, // 1.0h
      minSurvivalMinutes: 40,
      color: 'sky',
      badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
      description: 'Linux 系统编程、网络协议栈、鸟哥私房菜 Bash 与底层机理精读'
    },
    a_algorithm: {
      key: 'a_algorithm',
      name: 'A级：算法手撕 Lab',
      tier: 'A',
      standardMinutes: 60, // 1.0h (3道题)
      minSurvivalMinutes: 30, // 最低保底 1-2 题 (30m)
      color: 'indigo',
      badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      description: '高频手撕题手写、复杂度证明与二刷追踪（每日硬指标）'
    },
    b_qa: {
      key: 'b_qa',
      name: 'B级：项目驱动自测与八股',
      tier: 'B',
      standardMinutes: 30, // 0.5h
      minSurvivalMinutes: 15,
      color: 'purple',
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
      description: '项目源码逆向八股自测、防坑指南与闪卡复盘'
    },
    c_reading: {
      key: 'c_reading',
      name: 'C级：通识研读三部曲',
      tier: 'C',
      standardMinutes: 45, // 3x15m = 45m
      minSurvivalMinutes: 0, // 可延后/弹性压缩
      color: 'emerald',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: '非暴力沟通(晨10p)、金融学基石(午10p)、博弈论策略思维(暮10p)'
    },
    c_career: {
      key: 'c_career',
      name: 'C级：求职调研与 STAR 打磨',
      tier: 'C',
      standardMinutes: 30, // 0.5h
      minSurvivalMinutes: 0, // 可延后/弹性压缩
      color: 'stone',
      badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
      description: '牛客求职风向、招聘需求调研与真实项目 STAR 经历复盘'
    }
  };

  // 2. 5 大工程根因归因标准 (Task Incompletion Diagnostic Attributions)
  const DIAGNOSTIC_REASONS = {
    underestimated_time: {
      key: 'underestimated_time',
      name: '工时预估过紧',
      severity: 'medium',
      icon: 'fa-clock',
      description: '模块重构复杂度或 C++ 模板/内存边界细节超出预期。',
      defaultAction: '自适应调高估时乘数至 1.3x~1.5x，拆分为独立原子子任务。'
    },
    high_complexity: {
      key: 'high_complexity',
      name: '深层技术卡点',
      severity: 'high',
      icon: 'fa-triangle-exclamation',
      description: '遭遇复杂竞态死锁、跨线程内存越界或系统调用隐蔽特性。',
      defaultAction: '生成专项排错调试探针任务，隔离复现 Demo，查阅手册与日志。'
    },
    missing_prerequisites: {
      key: 'missing_prerequisites',
      name: '前置知识欠缺',
      severity: 'high',
      icon: 'fa-book-bookmark',
      description: '缺少必要的底层机制支撑（如 epoll 边缘触发原理或原子操作内存序）。',
      defaultAction: '自动将关联底层知识排入前置支撑学习通道，补齐后再战。'
    },
    time_squeezed: {
      key: 'time_squeezed',
      name: '外部事务挤占',
      severity: 'low',
      icon: 'fa-calendar-xmark',
      description: '外部日历突发会议、学业/职场临时紧急事项打断。',
      defaultAction: '顺延至明日首个可用空闲专注块，不扣减能力积分。'
    },
    energy_depletion: {
      key: 'energy_depletion',
      name: '认知负荷与精力透支',
      severity: 'medium',
      icon: 'fa-battery-quarter',
      description: '长时间高强度编码导致大脑疲劳，注意力和逻辑准确度明显下滑。',
      defaultAction: '强制执行 20m 认知放空，优先调换为轻量通识阅读或自测闪卡。'
    }
  };

  // 3. 原生 RFC 5545 iCal/ICS 解析器引擎 (Real Parser Engine)
  class RFC5545Parser {
    /**
     * 将原始 ICS 文本解析为规范事件集合
     * @param {string} icsContent - 原始 iCalendar 字符串 (RFC 5545)
     * @param {string} [targetDateStr] - 目标日期 YYYY-MM-DD，默认今天
     * @returns {Array<Object>} 结构化事件列表
     */
    static parse(icsContent, targetDateStr) {
      if (!icsContent || typeof icsContent !== 'string') return [];
      
      const targetDate = targetDateStr || RFC5545Parser.getTodayDateStr();

      // 1. 展开多行 (Unfold lines: RFC 5545 第 3.1 节，换行后跟随空格或制表符表示续行)
      const unfolded = icsContent.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
      const lines = unfolded.split(/\r\n|\n|\r/);

      const events = [];
      let inEvent = false;
      let currentEvent = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line === 'BEGIN:VEVENT') {
          inEvent = true;
          currentEvent = {
            id: 'evt_' + Math.random().toString(36).slice(2, 9),
            summary: '未命名日程',
            description: '',
            location: '',
            startRaw: '',
            endRaw: '',
            startDate: null,
            endDate: null,
            isAllDay: false,
            busy: true, // 默认标记占用
            rrule: ''
          };
          continue;
        }

        if (line === 'END:VEVENT') {
          if (currentEvent && currentEvent.startRaw) {
            // 解析开始与结束时间
            RFC5545Parser._normalizeEventTimes(currentEvent);
            // 过滤或匹配目标日期
            if (RFC5545Parser._isEventOnDate(currentEvent, targetDate)) {
              events.push(currentEvent);
            }
          }
          inEvent = false;
          currentEvent = null;
          continue;
        }

        if (!inEvent || !currentEvent) continue;

        // 解析键值对 (支持带有参数的属性，如 DTSTART;TZID=Asia/Shanghai:20260912T090000)
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;

        const propFull = line.slice(0, colonIdx);
        const val = line.slice(colonIdx + 1).replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, '\n');
        const propName = propFull.split(';')[0].toUpperCase();

        switch (propName) {
          case 'SUMMARY':
            currentEvent.summary = val;
            break;
          case 'DESCRIPTION':
            currentEvent.description = val;
            break;
          case 'LOCATION':
            currentEvent.location = val;
            break;
          case 'UID':
            currentEvent.id = val;
            break;
          case 'DTSTART':
            currentEvent.startRaw = val;
            if (propFull.includes('VALUE=DATE') || val.length === 8) {
              currentEvent.isAllDay = true;
            }
            break;
          case 'DTEND':
            currentEvent.endRaw = val;
            break;
          case 'RRULE':
            currentEvent.rrule = val;
            break;
          case 'TRANSP':
            // TRANSP:TRANSPARENT 表示该事件不占用空闲时间 (free)
            if (val.toUpperCase() === 'TRANSPARENT') {
              currentEvent.busy = false;
            }
            break;
          case 'STATUS':
            if (val.toUpperCase() === 'CANCELLED') {
              currentEvent.busy = false;
            }
            break;
        }
      }

      // 排序事件：全天在前，之后按起始时间升序
      events.sort((a, b) => {
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        if (!a.startDate || !b.startDate) return 0;
        return a.startDate.getTime() - b.startDate.getTime();
      });

      return events;
    }

    /**
     * 将 RFC 5545 格式时间转换为 JS Date
     */
    static _parseIcsDate(dateStr) {
      if (!dateStr) return null;
      // 格式1: YYYYMMDD (全天事件，如 20260912)
      if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
        const y = parseInt(dateStr.slice(0, 4), 10);
        const m = parseInt(dateStr.slice(4, 6), 10) - 1;
        const d = parseInt(dateStr.slice(6, 8), 10);
        return new Date(y, m, d, 0, 0, 0);
      }
      // 格式2: YYYYMMDDTHHmmssZ (UTC 时间)
      if (dateStr.endsWith('Z')) {
        const clean = dateStr.replace(/[^0-9]/g, '');
        if (clean.length >= 14) {
          const y = parseInt(clean.slice(0, 4), 10);
          const m = parseInt(clean.slice(4, 6), 10) - 1;
          const d = parseInt(clean.slice(6, 8), 10);
          const hh = parseInt(clean.slice(8, 10), 10);
          const mm = parseInt(clean.slice(10, 12), 10);
          const ss = parseInt(clean.slice(12, 14), 10);
          return new Date(Date.UTC(y, m, d, hh, mm, ss));
        }
      }
      // 格式3: YYYYMMDDTHHmmss (本地时区)
      const clean = dateStr.replace(/[^0-9]/g, '');
      if (clean.length >= 14) {
        const y = parseInt(clean.slice(0, 4), 10);
        const m = parseInt(clean.slice(4, 6), 10) - 1;
        const d = parseInt(clean.slice(6, 8), 10);
        const hh = parseInt(clean.slice(8, 10), 10);
        const mm = parseInt(clean.slice(10, 12), 10);
        const ss = parseInt(clean.slice(12, 14), 10);
        return new Date(y, m, d, hh, mm, ss);
      }
      return null;
    }

    static _normalizeEventTimes(evt) {
      evt.startDate = RFC5545Parser._parseIcsDate(evt.startRaw);
      if (evt.endRaw) {
        evt.endDate = RFC5545Parser._parseIcsDate(evt.endRaw);
      } else if (evt.startDate) {
        // 如果没有 endRaw，默认 1 小时或全天
        evt.endDate = new Date(evt.startDate.getTime() + (evt.isAllDay ? 86400000 : 3600000));
      }

      if (evt.startDate) {
        const sh = String(evt.startDate.getHours()).padStart(2, '0');
        const sm = String(evt.startDate.getMinutes()).padStart(2, '0');
        evt.startTimeStr = `${sh}:${sm}`;
      } else {
        evt.startTimeStr = '00:00';
      }

      if (evt.endDate) {
        const eh = String(evt.endDate.getHours()).padStart(2, '0');
        const em = String(evt.endDate.getMinutes()).padStart(2, '0');
        evt.endTimeStr = `${eh}:${em}`;
      } else {
        evt.endTimeStr = '23:59';
      }

      if (evt.startDate && evt.endDate) {
        const diffMs = evt.endDate.getTime() - evt.startDate.getTime();
        evt.durationMinutes = Math.max(0, Math.round(diffMs / 60000));
      } else {
        evt.durationMinutes = evt.isAllDay ? 1440 : 60;
      }
    }

    static _isEventOnDate(evt, targetDateStr) {
      if (!evt.startDate) return false;
      const target = targetDateStr || RFC5545Parser.getTodayDateStr();
      const sy = evt.startDate.getFullYear();
      const sm = String(evt.startDate.getMonth() + 1).padStart(2, '0');
      const sd = String(evt.startDate.getDate()).padStart(2, '0');
      const evtStartDay = `${sy}-${sm}-${sd}`;

      // 如果是同一天
      if (evtStartDay === target) return true;

      // 如果跨天事件 (结束时间晚于目标日期起点，且开始时间早于目标日期终点)
      if (evt.endDate) {
        const ey = evt.endDate.getFullYear();
        const em = String(evt.endDate.getMonth() + 1).padStart(2, '0');
        const ed = String(evt.endDate.getDate()).padStart(2, '0');
        const evtEndDay = `${ey}-${em}-${ed}`;
        if (evtStartDay <= target && evtEndDay >= target) return true;
      }

      // 如果有循环规则 RRULE: FREQ=DAILY 或 FREQ=WEEKLY
      if (evt.rrule) {
        if (evt.rrule.includes('FREQ=DAILY')) {
          if (evtStartDay <= target) return true;
        }
        if (evt.rrule.includes('FREQ=WEEKLY')) {
          const targetDayOfWeek = new Date(target + 'T00:00:00').getDay();
          const evtDayOfWeek = evt.startDate.getDay();
          if (evtStartDay <= target && targetDayOfWeek === evtDayOfWeek) return true;
        }
      }

      return false;
    }

    static getTodayDateStr() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  }

  // 4. Google Tasks 适配器 (Google Tasks Importer & Formatter)
  class GoogleTasksAdapter {
    /**
     * 解析 Google Tasks 导出的 JSON 或 Markdown 列表
     * @param {string|Object} rawInput
     * @returns {Array<Object>} 任务列表
     */
    static parse(rawInput) {
      if (!rawInput) return [];
      
      // 1. 如果是 JSON 格式 (Google Tasks API 或 Google Takeout 导出)
      if (typeof rawInput === 'object') {
        return GoogleTasksAdapter._fromJsonObject(rawInput);
      }
      
      if (typeof rawInput === 'string') {
        const trimmed = rawInput.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try {
            const parsed = JSON.parse(trimmed);
            return GoogleTasksAdapter._fromJsonObject(parsed);
          } catch(e) {}
        }

        // 2. 文本 / Markdown 格式解析 (- [ ] 任务标题 @due(2026-09-12 14:00))
        return GoogleTasksAdapter._fromMarkdownText(trimmed);
      }

      return [];
    }

    static _fromJsonObject(obj) {
      const items = Array.isArray(obj) ? obj : (obj.items || obj.tasks || []);
      return items.map((item, idx) => ({
        id: item.id || `gtask_${Date.now()}_${idx}`,
        title: item.title || item.summary || '未命名待办',
        notes: item.notes || item.description || '',
        status: (item.status === 'completed' || item.completed) ? 'completed' : 'needsAction',
        due: item.due || item.dueDate || null,
        updated: item.updated || new Date().toISOString(),
        source: 'google_tasks'
      }));
    }

    static _fromMarkdownText(text) {
      const lines = text.split('\n');
      const tasks = [];
      lines.forEach((line, idx) => {
        const l = line.trim();
        if (!l) return;
        const match = l.match(/^[-*]\s*(\[[ xX]\])?\s*(.+)$/);
        if (match) {
          const completed = match[1] && (match[1].includes('x') || match[1].includes('X'));
          let title = match[2];
          let due = null;
          const dueMatch = title.match(/@due\(([^)]+)\)/);
          if (dueMatch) {
            due = dueMatch[1];
            title = title.replace(dueMatch[0], '').trim();
          }
          tasks.push({
            id: `gtask_md_${Date.now()}_${idx}`,
            title: title,
            notes: '',
            status: completed ? 'completed' : 'needsAction',
            due: due,
            source: 'markdown_tasks'
          });
        }
      });
      return tasks;
    }
  }

  // 5. 日历时间冲突与空闲专注时隙矩阵 (Time Conflict & Availability Matrix)
  class TimeConflictMatrix {
    /**
     * 根据外部事件与每日可用起止边界，计算空闲连续专注块
     * @param {Array<Object>} calendarEvents - 外部解析出来的日程事件
     * @param {Object} [config] - 起止时间配置，默认 08:30 ~ 22:30 (840 分钟总跨度)
     * @returns {Object} { freeSlots, busyIntervals, totalFreeMinutes, totalBusyMinutes }
     */
    static calculateAvailability(calendarEvents, config) {
      const cfg = Object.assign({
        dayStartHour: 8,
        dayStartMinute: 30, // 08:30
        dayEndHour: 22,
        dayEndMinute: 30,   // 22:30
        bufferMinutes: 10   // 会议后自动插入 10 分钟认知缓冲
      }, config || {});

      const dayStartMin = cfg.dayStartHour * 60 + cfg.dayStartMinute; // 510
      const dayEndMin = cfg.dayEndHour * 60 + cfg.dayEndMinute;       // 1350
      const totalDayMinutes = Math.max(0, dayEndMin - dayStartMin);   // 840 分钟 (14.0h)

      // 提取所有 busy 区间
      const rawIntervals = [];

      (calendarEvents || []).forEach(evt => {
        if (!evt.busy) return;
        if (evt.isAllDay) {
          // 全天事件直接占用全部工作时间
          rawIntervals.push({ start: dayStartMin, end: dayEndMin, title: evt.summary });
          return;
        }
        if (!evt.startDate || !evt.endDate) return;

        let startMin = evt.startDate.getHours() * 60 + evt.startDate.getMinutes();
        let endMin = evt.endDate.getHours() * 60 + evt.endDate.getMinutes();

        // 截断至今日边界
        startMin = Math.max(dayStartMin, Math.min(dayEndMin, startMin));
        endMin = Math.max(dayStartMin, Math.min(dayEndMin, endMin + cfg.bufferMinutes));

        if (endMin > startMin) {
          rawIntervals.push({ start: startMin, end: endMin, title: evt.summary });
        }
      });

      // 合并重叠与相邻的繁忙区间
      rawIntervals.sort((a, b) => a.start - b.start);
      const mergedBusy = [];
      rawIntervals.forEach(curr => {
        if (mergedBusy.length === 0) {
          mergedBusy.push({ start: curr.start, end: curr.end, titles: [curr.title] });
        } else {
          const last = mergedBusy[mergedBusy.length - 1];
          if (curr.start <= last.end) {
            last.end = Math.max(last.end, curr.end);
            if (!last.titles.includes(curr.title)) last.titles.push(curr.title);
          } else {
            mergedBusy.push({ start: curr.start, end: curr.end, titles: [curr.title] });
          }
        }
      });

      // 计算空闲槽 (Free Focus Slots)
      const freeSlots = [];
      let cursor = dayStartMin;

      mergedBusy.forEach(busy => {
        if (busy.start > cursor) {
          const dur = busy.start - cursor;
          if (dur >= 15) { // 至少 15 分钟才构成有效槽位
            freeSlots.push({
              startMinutes: cursor,
              endMinutes: busy.start,
              startTimeStr: TimeConflictMatrix._minToTimeStr(cursor),
              endTimeStr: TimeConflictMatrix._minToTimeStr(busy.start),
              durationMinutes: dur
            });
          }
        }
        cursor = Math.max(cursor, busy.end);
      });

      if (cursor < dayEndMin) {
        const dur = dayEndMin - cursor;
        if (dur >= 15) {
          freeSlots.push({
            startMinutes: cursor,
            endMinutes: dayEndMin,
            startTimeStr: TimeConflictMatrix._minToTimeStr(cursor),
            endTimeStr: TimeConflictMatrix._minToTimeStr(dayEndMin),
            durationMinutes: dur
          });
        }
      }

      const totalFreeMinutes = freeSlots.reduce((acc, s) => acc + s.durationMinutes, 0);
      const totalBusyMinutes = totalDayMinutes - totalFreeMinutes;

      return {
        dayStartMin,
        dayEndMin,
        totalDayMinutes,
        mergedBusy,
        freeSlots,
        totalFreeMinutes,
        totalBusyMinutes
      };
    }

    static _minToTimeStr(totalMin) {
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
  }

  // 6. 时间赤字压缩引擎 (Time Deficit Compression Algorithm)
  class TimeDeficitCompressor {
    /**
     * 当可用时间小于需求时间时，执行严格逐级保底压缩
     * @param {number} availableMinutes - 今日真实空闲分钟数
     * @param {Object} [taskDemands] - 自定义任务需求分钟数
     * @returns {Object} 压缩分配明细与提示
     */
    static compress(availableMinutes, taskDemands) {
      const demands = Object.assign({
        s_core: SCHEDULER_PRIORITY_TIERS.s_core.standardMinutes,       // 180m (3.0h)
        a_supporting: SCHEDULER_PRIORITY_TIERS.a_supporting.standardMinutes, // 60m (1.0h)
        a_algorithm: SCHEDULER_PRIORITY_TIERS.a_algorithm.standardMinutes,   // 60m (1.0h)
        b_qa: SCHEDULER_PRIORITY_TIERS.b_qa.standardMinutes,               // 30m (0.5h)
        c_reading: SCHEDULER_PRIORITY_TIERS.c_reading.standardMinutes,     // 45m
        c_career: SCHEDULER_PRIORITY_TIERS.c_career.standardMinutes        // 30m
      }, taskDemands || {});

      const totalDemanded = Object.values(demands).reduce((a, b) => a + b, 0); // 405 min (~6.75h)
      const deficit = Math.max(0, totalDemanded - availableMinutes);

      const allocated = { ...demands };
      const compressionLogs = [];
      let remainingDeficit = deficit;

      if (deficit <= 0) {
        return {
          deficitMinutes: 0,
          compressionApplied: false,
          totalDemanded,
          totalAllocated: totalDemanded,
          allocated,
          compressionLogs: ['可用时间充裕，全量标准时长执行。']
        };
      }

      // 第 1 级压缩：缩减 C 级任务（通识阅读与求职调研）
      // 1.1 通识阅读从 45m 压缩至 20m (削减 25m)
      if (remainingDeficit > 0 && allocated.c_reading > 20) {
        const cut = Math.min(remainingDeficit, allocated.c_reading - 20);
        allocated.c_reading -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[L1压缩] 通识研读轻量化：缩减 ${cut}m（保留核心晨读，午晚读顺延）`);
      }
      // 1.2 求职调研从 30m 压缩至 15m (削减 15m)
      if (remainingDeficit > 0 && allocated.c_career > 15) {
        const cut = Math.min(remainingDeficit, allocated.c_career - 15);
        allocated.c_career -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[L1压缩] 求职调研精简化：缩减 ${cut}m（聚焦关键动态浏览）`);
      }
      // 1.3 如果仍有赤字，全额免除 C 级通识与求职
      if (remainingDeficit > 0 && allocated.c_reading > 0) {
        const cut = Math.min(remainingDeficit, allocated.c_reading);
        allocated.c_reading -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[L1深入] 通识阅读今日暂停：省出 ${cut}m 优先支援专业工程`);
      }
      if (remainingDeficit > 0 && allocated.c_career > 0) {
        const cut = Math.min(remainingDeficit, allocated.c_career);
        allocated.c_career -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[L1深入] 求职调研今日暂停：省出 ${cut}m 优先支援专业工程`);
      }

      // 第 2 级压缩：缩减 B 级任务（八股自测从 30m 压至 15m 保底闪卡）
      if (remainingDeficit > 0 && allocated.b_qa > 15) {
        const cut = Math.min(remainingDeficit, allocated.b_qa - 15);
        allocated.b_qa -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[L2压缩] 八股自测速记化：缩减 ${cut}m（聚焦今日易错题，快速过卡）`);
      }

      // 第 3 级压缩：缩减 A 级支撑知识（从 60m 压至 40m）
      if (remainingDeficit > 0 && allocated.a_supporting > 40) {
        const cut = Math.min(remainingDeficit, allocated.a_supporting - 40);
        allocated.a_supporting -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[L3压缩] 支撑知识紧凑化：缩减 ${cut}m（只精读今日关键代码段）`);
      }

      // 铁律底线保卫：S 级项目核心与 A 级算法严禁无底线扣减！
      // 若赤字仍未填平，则进入极端保底模式：
      if (remainingDeficit > 0 && allocated.b_qa > 0) {
        const cut = Math.min(remainingDeficit, allocated.b_qa);
        allocated.b_qa -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[极端保底] 八股自测今日免除：省出 ${cut}m`);
      }
      if (remainingDeficit > 0 && allocated.a_supporting > SCHEDULER_PRIORITY_TIERS.a_supporting.minSurvivalMinutes) {
        const cut = Math.min(remainingDeficit, allocated.a_supporting - SCHEDULER_PRIORITY_TIERS.a_supporting.minSurvivalMinutes);
        allocated.a_supporting -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[极端保底] 支撑知识触碰底线：省出 ${cut}m（剩余 ${allocated.a_supporting}m）`);
      }
      if (remainingDeficit > 0 && allocated.a_algorithm > SCHEDULER_PRIORITY_TIERS.a_algorithm.minSurvivalMinutes) {
        const cut = Math.min(remainingDeficit, allocated.a_algorithm - SCHEDULER_PRIORITY_TIERS.a_algorithm.minSurvivalMinutes);
        allocated.a_algorithm -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[底线守卫] 算法手撕降为保底 1 题：缩减 ${cut}m（剩余 30m）`);
      }
      if (remainingDeficit > 0 && allocated.s_core > SCHEDULER_PRIORITY_TIERS.s_core.minSurvivalMinutes) {
        const cut = Math.min(remainingDeficit, allocated.s_core - SCHEDULER_PRIORITY_TIERS.s_core.minSurvivalMinutes);
        allocated.s_core -= cut;
        remainingDeficit -= cut;
        compressionLogs.push(`[绝对红线] 项目核心主干缩至最低保底：缩减 ${cut}m（坚守 90m 不可退让）`);
      }

      const totalAllocated = Object.values(allocated).reduce((a, b) => a + b, 0);

      return {
        deficitMinutes: deficit,
        compressionApplied: true,
        totalDemanded,
        totalAllocated,
        allocated,
        remainingDeficit,
        compressionLogs
      };
    }
  }

  // 7. 心流块编排与上下文切换最小化引擎 (Flow Block Sequencer)
  class FlowBlockSequencer {
    /**
     * 将压缩后的任务按认知心流最佳次序编排进空闲时隙
     * 顺序：深层项目核心(S) ➔ 支撑知识(A) ➔ 手撕算法(A) ➔ 逆向自测(B) ➔ 通识阅读/求职(C)
     * @param {Object} allocationResult - 压缩分配结果
     * @param {Array<Object>} freeSlots - 计算得出的连续空闲时隙
     * @returns {Array<Object>} 带有精确时间的日程卡片清单
     */
    static sequence(allocationResult, freeSlots) {
      const allocated = allocationResult.allocated;
      const scheduledBlocks = [];

      // 准备任务队列 (按严格优先级流水线)
      const taskQueue = [
        {
          key: 's_core',
          title: 'CppAIService / muduo 项目核心主干代码攻坚',
          tier: 'S',
          tierKey: 's_core',
          duration: allocated.s_core,
          color: 'amber',
          icon: 'fa-cubes-stacked'
        },
        {
          key: 'a_supporting',
          title: 'Linux 系统编程与底层机理支撑精读',
          tier: 'A',
          tierKey: 'a_supporting',
          duration: allocated.a_supporting,
          color: 'sky',
          icon: 'fa-terminal'
        },
        {
          key: 'a_algorithm',
          title: '算法手撕 Lab (每日精选与复杂度推导)',
          tier: 'A',
          tierKey: 'a_algorithm',
          duration: allocated.a_algorithm,
          color: 'indigo',
          icon: 'fa-laptop-code'
        },
        {
          key: 'b_qa',
          title: '项目驱动八股自测与避坑复盘',
          tier: 'B',
          tierKey: 'b_qa',
          duration: allocated.b_qa,
          color: 'purple',
          icon: 'fa-clipboard-question'
        },
        {
          key: 'c_reading',
          title: '通识研读三部曲 (非暴力沟通/金融学/博弈论)',
          tier: 'C',
          tierKey: 'c_reading',
          duration: allocated.c_reading,
          color: 'emerald',
          icon: 'fa-book-open'
        },
        {
          key: 'c_career',
          title: '求职动态调研与 STAR 面试履历打磨',
          tier: 'C',
          tierKey: 'c_career',
          duration: allocated.c_career,
          color: 'stone',
          icon: 'fa-user-tie'
        }
      ].filter(t => t.duration > 0);

      // 如果没有外部日历空闲时隙，则使用默认的基准日程表
      if (!freeSlots || freeSlots.length === 0) {
        let curMin = 9 * 60; // 09:00 开始
        taskQueue.forEach(task => {
          const startMin = curMin;
          const endMin = curMin + task.duration;
          scheduledBlocks.push({
            id: 'block_' + task.key,
            taskKey: task.key,
            title: task.title,
            tier: task.tier,
            tierKey: task.tierKey,
            startMinutes: startMin,
            endMinutes: endMin,
            startTimeStr: TimeConflictMatrix._minToTimeStr(startMin),
            endTimeStr: TimeConflictMatrix._minToTimeStr(endMin),
            durationMinutes: task.duration,
            color: task.color,
            icon: task.icon,
            status: 'scheduled'
          });
          curMin = endMin + 10; // 插入 10 分钟认知缓冲
        });
        return scheduledBlocks;
      }

      // 将任务队列填充至空闲槽
      let slotIdx = 0;
      let currentSlotMin = freeSlots[0].startMinutes;

      for (let i = 0; i < taskQueue.length; i++) {
        const task = taskQueue[i];
        let taskRemMin = task.duration;

        while (taskRemMin > 0 && slotIdx < freeSlots.length) {
          const slot = freeSlots[slotIdx];
          const slotAvail = slot.endMinutes - currentSlotMin;

          if (slotAvail <= 0) {
            slotIdx++;
            if (slotIdx < freeSlots.length) {
              currentSlotMin = freeSlots[slotIdx].startMinutes;
            }
            continue;
          }

          const allocMin = Math.min(taskRemMin, slotAvail);
          const startMin = currentSlotMin;
          const endMin = startMin + allocMin;

          scheduledBlocks.push({
            id: 'block_' + task.key + (taskRemMin < task.duration ? '_part2' : ''),
            taskKey: task.key,
            title: task.title,
            tier: task.tier,
            tierKey: task.tierKey,
            startMinutes: startMin,
            endMinutes: endMin,
            startTimeStr: TimeConflictMatrix._minToTimeStr(startMin),
            endTimeStr: TimeConflictMatrix._minToTimeStr(endMin),
            durationMinutes: allocMin,
            color: task.color,
            icon: task.icon,
            status: 'scheduled'
          });

          taskRemMin -= allocMin;
          currentSlotMin = endMin;

          // 若当前槽恰好用完，跳往下一槽
          if (currentSlotMin >= slot.endMinutes) {
            slotIdx++;
            if (slotIdx < freeSlots.length) {
              currentSlotMin = freeSlots[slotIdx].startMinutes;
            }
          }
        }
      }

      return scheduledBlocks;
    }
  }

  // 8. 诊断式动态排程与原因归因引擎 (Diagnostic Engine)
  class DiagnosticEngine {
    /**
     * 评估任务未完成并生成工程根因诊断建议
     * @param {string} reasonKey - 5 大归因原因之一
     * @param {string} customNote - 用户填写的技术细节
     * @param {Object} taskObj - 对应任务对象
     * @returns {Object} 诊断记录与调整建议
     */
    static diagnose(reasonKey, customNote, taskObj) {
      const reasonDef = DIAGNOSTIC_REASONS[reasonKey] || DIAGNOSTIC_REASONS.underestimated_time;
      
      let suggestedAction = reasonDef.defaultAction;
      let nextActionType = 'reschedule_tomorrow';

      if (reasonKey === 'missing_prerequisites') {
        nextActionType = 'insert_prerequisite_learning';
        suggestedAction = `先暂停手写，自动在支撑通道加入对应系统机理分析，研读 30m 之后再推进。`;
      } else if (reasonKey === 'high_complexity') {
        nextActionType = 'spawn_debug_sandbox';
        suggestedAction = `拆分出专属调试排错探针任务，编译开启 AddressSanitizer，打印关键上下文日志。`;
      } else if (reasonKey === 'underestimated_time') {
        nextActionType = 'split_task_and_multiply';
        suggestedAction = `任务粒度偏大，自动切分为两段（Part 1 接口定义与骨架，Part 2 状态机实现）。`;
      }

      return {
        timestamp: new Date().toISOString(),
        taskId: taskObj ? taskObj.id : 'unknown',
        taskTitle: taskObj ? taskObj.title : '未指定任务',
        reasonKey: reasonKey,
        reasonName: reasonDef.name,
        severity: reasonDef.severity,
        note: customNote || '未填写补充手记',
        nextActionType: nextActionType,
        suggestedAction: suggestedAction
      };
    }
  }

  // 9. 每日复盘成长报表生成器 (Daily Review Generator - 打通 Phase 6)
  class DailyReviewGenerator {
    /**
     * 聚合全天执行、时间分配、未完成归因与 Phase 6 产出的工程凭据
     * @param {Object} params - { date, routineTasks, scheduledBlocks, diagnostics, careerEvidences, capabilities }
     * @returns {Object} { reviewData, markdownReport }
     */
    static generate(params) {
      const dateStr = params.date || RFC5545Parser.getTodayDateStr();
      const routineTasks = params.routineTasks || [];
      const scheduledBlocks = params.scheduledBlocks || [];
      const diagnostics = params.diagnostics || {};
      const careerEvidences = params.careerEvidences || [];
      const capabilities = params.capabilities || [];

      // 1. 统计完成任务与工时
      const completedTasks = routineTasks.filter(t => t.completed);
      const incompleteTasks = routineTasks.filter(t => !t.completed);
      const totalFocusedMinutes = scheduledBlocks.reduce((sum, b) => sum + (b.durationMinutes || 0), 0);

      // 2. 联动 Phase 6: 检索今日产生的真实工程凭据
      const todayEvidences = (careerEvidences || []).filter(ev => {
        if (!ev.createdAt) return false;
        return ev.createdAt.startsWith(dateStr);
      });

      // 3. 构建结构化 Markdown 报表
      const mdLines = [];
      mdLines.push(`# 每日工程复盘与成长报表 (${dateStr})`);
      mdLines.push(`> 专注工时：**${(totalFocusedMinutes / 60).toFixed(1)} 小时** (${totalFocusedMinutes} 分钟) | 任务完成率：**${routineTasks.length > 0 ? Math.round((completedTasks.length / routineTasks.length) * 100) : 0}%**\n`);

      mdLines.push(`## 一、今日已攻坚核心任务 (${completedTasks.length}/${routineTasks.length})`);
      if (completedTasks.length > 0) {
        completedTasks.forEach(t => {
          mdLines.push(`- [x] **[${t.tier || 'A'}] ${t.title}** (${t.timeEstimate || t.durationMinutes || 30}m)`);
        });
      } else {
        mdLines.push(`*今日暂未打卡完成任务。*`);
      }
      mdLines.push('');

      // 未完成与根因归因
      if (incompleteTasks.length > 0) {
        mdLines.push(`## 二、未完成任务与工程根因归因 (${incompleteTasks.length} 项)`);
        incompleteTasks.forEach(t => {
          const diag = diagnostics[t.id];
          if (diag) {
            mdLines.push(`- [ ] **${t.title}** ➔ **归因：${diag.reasonName}**`);
            mdLines.push(`  - 现场分析：${diag.note}`);
            mdLines.push(`  - 调优对策：${diag.suggestedAction}`);
          } else {
            mdLines.push(`- [ ] **${t.title}** (尚未录入技术归因诊断)`);
          }
        });
        mdLines.push('');
      }

      // Phase 6 真实凭据产出
      mdLines.push(`## 三、今日沉淀真实工程凭据 (Phase 6 联动: ${todayEvidences.length} 项)`);
      if (todayEvidences.length > 0) {
        todayEvidences.forEach(ev => {
          mdLines.push(`- **[${ev.type}] ${ev.title}**`);
          if (ev.sourceLocation) mdLines.push(`  - 源码锚点：\`${ev.sourceLocation}\``);
          if (ev.commitHash) mdLines.push(`  - Git 提交：\`${ev.commitHash}\``);
          if (ev.details) mdLines.push(`  - 验证记录：${ev.details}`);
        });
      } else {
        mdLines.push(`*今日暂未产生显式工程凭证（已完成任务可前往 P6 凭证库录入代码修改或测试断言）。*`);
      }
      mdLines.push('');

      // 明日高优先级排程
      mdLines.push(`## 四、次日高优先级流水线建议`);
      mdLines.push(`1. **[S级] CppAIService / muduo 核心主干**：坚守晨间 3h 连续黄金专注块。`);
      mdLines.push(`2. **[A级] 算法手撕 Lab**：按计划推进 3 道同构高频手撕题并验证。`);
      if (incompleteTasks.length > 0) {
        mdLines.push(`3. **[重排队列] 优先消化今日遗留任务**：根据诊断建议执行拆分与前置补齐。`);
      }
      mdLines.push(`\n---\n*由 CppAIService & muduo Dual-Core Engineering OS Phase 7 智能调度引擎自动生成*`);

      const markdownReport = mdLines.join('\n');

      return {
        date: dateStr,
        totalFocusedMinutes,
        completedCount: completedTasks.length,
        incompleteCount: incompleteTasks.length,
        evidenceCount: todayEvidences.length,
        markdownReport
      };
    }
  }

  // 10. 统一导出命名空间
  const SchedulerDomain = {
    SCHEDULER_PRIORITY_TIERS,
    DIAGNOSTIC_REASONS,
    RFC5545Parser,
    GoogleTasksAdapter,
    TimeConflictMatrix,
    TimeDeficitCompressor,
    FlowBlockSequencer,
    DiagnosticEngine,
    DailyReviewGenerator
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      SchedulerDomain,
      SCHEDULER_PRIORITY_TIERS,
      DIAGNOSTIC_REASONS,
      RFC5545Parser,
      GoogleTasksAdapter,
      TimeConflictMatrix,
      TimeDeficitCompressor,
      FlowBlockSequencer,
      DiagnosticEngine,
      DailyReviewGenerator
    };
  }
  if (typeof global !== 'undefined') {
    global.SchedulerDomain = SchedulerDomain;
    global.SCHEDULER_PRIORITY_TIERS = SCHEDULER_PRIORITY_TIERS;
    global.DIAGNOSTIC_REASONS = DIAGNOSTIC_REASONS;
    global.RFC5545Parser = RFC5545Parser;
    global.GoogleTasksAdapter = GoogleTasksAdapter;
    global.TimeConflictMatrix = TimeConflictMatrix;
    global.TimeDeficitCompressor = TimeDeficitCompressor;
    global.FlowBlockSequencer = FlowBlockSequencer;
    global.DiagnosticEngine = DiagnosticEngine;
    global.DailyReviewGenerator = DailyReviewGenerator;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.SchedulerDomain = SchedulerDomain;
    globalThis.SCHEDULER_PRIORITY_TIERS = SCHEDULER_PRIORITY_TIERS;
    globalThis.DIAGNOSTIC_REASONS = DIAGNOSTIC_REASONS;
    globalThis.RFC5545Parser = RFC5545Parser;
    globalThis.GoogleTasksAdapter = GoogleTasksAdapter;
    globalThis.TimeConflictMatrix = TimeConflictMatrix;
    globalThis.TimeDeficitCompressor = TimeDeficitCompressor;
    globalThis.FlowBlockSequencer = FlowBlockSequencer;
    globalThis.DiagnosticEngine = DiagnosticEngine;
    globalThis.DailyReviewGenerator = DailyReviewGenerator;
  }

})(typeof window !== 'undefined' ? window : globalThis);
