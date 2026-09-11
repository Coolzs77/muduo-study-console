import React, { useState } from 'react';
import { 
  Star, 
  BookOpen, 
  ExternalLink, 
  ChevronRight, 
  Code2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Compass,
  Copy,
  Sparkles,
  Workflow
} from 'lucide-react';
import { DAYS_DATASET } from '../data/muduo28Days';
import { CHEN_SHUO_BOOK, generatePdfBrowserUrl } from '../data/booksMapping';
import { DayItem, AppState } from '../types';

interface DailyMasteryViewProps {
  mastery: AppState['mastery'];
  onUpdateMastery: (day: number, level: number) => void;
  onShowToast: (msg: string, success?: boolean) => void;
  onSwitchToReadingChapter: (day: number) => void;
}

export const DailyMasteryView: React.FC<DailyMasteryViewProps> = ({
  mastery,
  onUpdateMastery,
  onShowToast,
  onSwitchToReadingChapter,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(0); // 0: All, 1-4
  const [activeModalDay, setActiveModalDay] = useState<DayItem | null>(null);

  const filteredDays = selectedWeek === 0 
    ? DAYS_DATASET 
    : DAYS_DATASET.filter(d => d.week === selectedWeek);

  const handleJumpToPdf = (dayItem: DayItem) => {
    // 默认从陈硕第 8 章或对应章节提取页码
    let pageNum = 255;
    const m = dayItem.bookRange.match(/P\.(\d+)/i);
    if (m) pageNum = parseInt(m[1]);
    
    const jumpUrl = generatePdfBrowserUrl(CHEN_SHUO_BOOK, pageNum);
    window.open(jumpUrl, '_blank');
    onShowToast(`正在浏览器中打开对应章节 PDF (直跳 P.${pageNum})`);
  };

  return (
    <div className="space-y-6">
      {/* 顶部周进度切换条 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 font-serifHeading">周期攻坚轮次:</span>
          <div className="flex items-center gap-1.5 font-serifMono text-xs font-bold">
            <button
              onClick={() => setSelectedWeek(0)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                selectedWeek === 0 ? 'bg-sky-950 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              全部 (28天)
            </button>
            {[1, 2, 3, 4].map(w => (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  selectedWeek === w ? 'bg-sky-950 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                第 {w} 周
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-stone-500 font-serifMono">
          点击书卷页码即可 <span className="font-bold text-emerald-700">直跳对应章节</span> 或进入伴读
        </div>
      </div>

      {/* 28天卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDays.map((item) => {
          const currentLevel = mastery[item.day]?.level || 0;

          return (
            <div
              key={item.day}
              className="bg-white rounded-2xl border border-stone-200/90 p-4.5 shadow-xs hover:shadow-md hover:border-sky-300 transition flex flex-col justify-between space-y-3 academic-card"
            >
              <div>
                {/* 顶栏信息 */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-sky-100 text-sky-900 font-mono">
                      Day {String(item.day).padStart(2, '0')}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      item.tier === 'A' ? 'bg-rose-100 text-rose-800' :
                      item.tier === 'B' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                    }`}>
                      Tier {item.tier}
                    </span>
                  </div>

                  {/* 星级掌握度 */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => onUpdateMastery(item.day, star === currentLevel ? star - 1 : star)}
                        className={`w-3.5 h-3.5 cursor-pointer transition ${
                          star <= currentLevel
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300 hover:text-amber-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 标题 */}
                <h3 
                  onClick={() => setActiveModalDay(item)}
                  className="text-sm font-bold text-stone-900 font-serifHeading hover:text-sky-700 transition cursor-pointer line-clamp-1"
                >
                  {item.title}
                </h3>

                {/* 伴读书目与精准页码直跳 (核心交互) */}
                <div className="mt-2.5 flex items-center justify-between gap-1 p-2 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] font-serifMono">
                  <div className="flex items-center gap-1.5 truncate text-stone-700">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">{item.bookRange}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleJumpToPdf(item)}
                      className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold flex items-center gap-0.5 transition cursor-pointer"
                      title="浏览器直跳 PDF 页码"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>直跳</span>
                    </button>
                    <button
                      onClick={() => onSwitchToReadingChapter(item.day)}
                      className="px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold flex items-center gap-0.5 transition cursor-pointer"
                      title="打开专属伴读面板"
                    >
                      <Compass className="w-3 h-3" />
                      <span>伴读</span>
                    </button>
                  </div>
                </div>

                {/* 标签 */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* 底部展开详情按钮 */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-serifMono text-[11px]">
                  {currentLevel >= 4 ? '✓ 已深度吃透' : '○ 待巩固复习'}
                </span>
                <button
                  onClick={() => setActiveModalDay(item)}
                  className="text-sky-800 hover:text-sky-950 font-bold flex items-center gap-0.5 font-serifHeading cursor-pointer"
                >
                  <span>透视核心要点</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day 详情透视模态框 */}
      {activeModalDay && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-900 text-white font-mono">
                    Day {activeModalDay.day}
                  </span>
                  <span className="text-xs font-bold text-amber-700 font-serifMono">
                    Week {activeModalDay.week} · Tier {activeModalDay.tier}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-serifHeading mt-1">
                  {activeModalDay.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalDay(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 核心必破知识要点 */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase font-serifHeading flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>核心知识切片与思考：</span>
              </h4>
              <ul className="space-y-2 text-xs font-serifHeading text-stone-800">
                {activeModalDay.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/80 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: p }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* muduo 架构映射 */}
            {activeModalDay.muduoMap && (
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs font-serifHeading space-y-1">
                <span className="font-bold text-sky-950 flex items-center gap-1">
                  <Workflow className="w-3.5 h-3.5 text-sky-700" />
                  <span>muduo 架构设计映射：</span>
                </span>
                <p className="text-sky-900 font-serifMono">{activeModalDay.muduoMap}</p>
              </div>
            )}

            {/* 达标自测标准 */}
            {activeModalDay.check && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-serifHeading space-y-1">
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>今日达标检阅准则：</span>
                </span>
                <p className="text-amber-900 font-serifMono">{activeModalDay.check}</p>
              </div>
            )}

            {/* 典型工业代码切片 */}
            {(activeModalDay.code || activeModalDay.codeSnippet) && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-500 uppercase font-serifHeading flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-sky-700" />
                    <span>典型工业级规范代码：</span>
                  </h4>
                  <button
                    onClick={() => {
                      const codeText = activeModalDay.code || activeModalDay.codeSnippet || '';
                      navigator.clipboard.writeText(codeText);
                      onShowToast('工业代码已成功复制到剪贴板！');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>复制代码</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-stone-950 text-sky-100 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800 max-h-72">
                  <code>{activeModalDay.code || activeModalDay.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* 避坑警告 */}
            {activeModalDay.pitfall && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-serifHeading space-y-1">
                <span className="font-bold text-rose-900 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>核心陷阱避坑：</span>
                </span>
                <p className="text-rose-800 font-serifMono">{activeModalDay.pitfall}</p>
              </div>
            )}

            {/* 模态框底部直跳操作 */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleJumpToPdf(activeModalDay)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>浏览器直跳对应教材页码</span>
              </button>

              <button
                onClick={() => setActiveModalDay(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
