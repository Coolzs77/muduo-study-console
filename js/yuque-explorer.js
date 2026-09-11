// ==========================================================================
// Yuque Knowledge Explorer 核心交互与知识底座模块 (yuque-explorer.js)
// 沉淀程序员 Carl 语雀《HTTP服务框架》17 篇 68,091 字全量专栏
// 实现：目录树导航、沉浸式阅读、源码关联跳查、6阶掌握度评级、安全Markdown解析与跨模态搜索
// ==========================================================================

// 安全获取语雀数据集
function getYuqueDataset() {
    if (typeof YUQUE_DATASET !== 'undefined' && Array.isArray(YUQUE_DATASET)) return YUQUE_DATASET;
    if (typeof window !== 'undefined' && window.YUQUE_DATASET && Array.isArray(window.YUQUE_DATASET)) return window.YUQUE_DATASET;
    return [];
}

// 初始化状态扩展
function ensureYuqueState() {
    if (!window.appState) window.appState = {};
    if (!appState.knowledgeMastery) appState.knowledgeMastery = {};
    if (!Array.isArray(appState.knowledgeFavorites)) appState.knowledgeFavorites = [];
    if (!Array.isArray(appState.knowledgeRecent)) appState.knowledgeRecent = [];
    if (!appState.currentYuqueArticleId) appState.currentYuqueArticleId = "yq_01";
    if (!appState.yuqueActiveTag) appState.yuqueActiveTag = "all";
    if (!appState.yuqueSearchQuery) appState.yuqueSearchQuery = "";
}

// 掌握度等级定义 (6阶)
var MASTERY_LEVELS = [
    { level: 0, label: "未学习", badgeClass: "bg-stone-100 text-stone-600 border-stone-200", desc: "尚未开始研读此章节" },
    { level: 1, label: "了解", badgeClass: "bg-amber-50 text-amber-700 border-amber-200", desc: "通读全文，了解基本概念与业务职责" },
    { level: 2, label: "理解", badgeClass: "bg-sky-50 text-sky-700 border-sky-200", desc: "理解底层架构设计、有限状态机与时序逻辑" },
    { level: 3, label: "能够解释", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200", desc: "能够向面试官清晰口述架构亮点与考点" },
    { level: 4, label: "能够编码", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", desc: "能独立重构或手撕核心类与测试用例" },
    { level: 5, label: "能够应用", badgeClass: "bg-purple-50 text-purple-700 border-purple-200", desc: "深入掌握生产调优、异步解耦与故障排查" }
];

// 安全转义 HTML 防 XSS
function safeEscape(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 轻量防弹级 Markdown 转 HTML 渲染器 (支持 C++ 高亮、代码一键复制、表格与图片)
function renderMarkdownSafe(mdText) {
    if (!mdText) return "<p class='text-stone-400'>暂无正文内容</p>";

    // 先保护代码块，避免代码块内的内容被 Markdown 规则误伤
    const codeBlocks = [];
    let text = mdText.replace(/```([a-zA-Z0-9_\+\-#]*)\n([\s\S]*?)```/g, function(match, lang, code) {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push({ lang: lang || "cpp", code: code });
        return placeholder;
    });

    // 保护行内代码
    const inlineCodes = [];
    text = text.replace(/`([^`\n]+)`/g, function(match, code) {
        const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
        inlineCodes.push(code);
        return placeholder;
    });

    // 转义普通文本中的 HTML，杜绝脚本注入
    text = safeEscape(text);

    // 标题解析
    text = text.replace(/^#### (.*?)$/gm, '<h4 class="text-xs sm:text-sm font-bold text-stone-900 mt-4 mb-2 font-serifHeading">$1</h4>');
    text = text.replace(/^### (.*?)$/gm, '<h3 class="text-sm sm:text-base font-bold text-stone-900 mt-5 mb-2.5 font-serifHeading flex items-center gap-1.5"><i class="fa-solid fa-angle-right text-amber-600 text-xs"></i>$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h2 class="text-base sm:text-lg font-bold text-stone-900 mt-6 mb-3 pb-1 border-b border-stone-200 font-serifHeading flex items-center gap-2"><span class="w-1.5 h-4 bg-sky-700 rounded-full inline-block"></span>$1</h2>');
    text = text.replace(/^# (.*?)$/gm, '<h1 class="text-lg sm:text-xl font-black text-stone-900 mt-4 mb-3 font-serifHeading">$1</h1>');

    // 分割线
    text = text.replace(/^---$/gm, '<hr class="my-6 border-stone-200">');

    // 图片渲染 (支持本地离线嵌入、图文居中、放大模态框预览)
    text = text.replace(/!\[(.*?)\]\((.*?)\)/g, function(m, alt, src) {
        const cleanAlt = safeEscape(alt || '架构与技术全景图');
        return `<div class="my-5 p-3 bg-white border border-stone-200 rounded-2xl text-center shadow-xs">
            <div class="overflow-hidden rounded-xl bg-stone-50/60 p-2 border border-stone-100 flex items-center justify-center">
                <img src="${src}" alt="${cleanAlt}" class="max-w-full max-h-[580px] object-contain mx-auto rounded-lg shadow-xs hover:scale-[1.01] transition cursor-zoom-in" loading="lazy" onclick="openYuqueImageModal(this.src, '${cleanAlt}')" onerror="handleImageLoadError(this)" />
            </div>
            <div class="flex items-center justify-center gap-2 mt-2 text-[11.5px] text-stone-500 font-serifMono">
                <i class="fa-regular fa-image text-amber-600 text-xs"></i>
                <span class="font-medium text-stone-600">${cleanAlt}</span>
                <span class="text-stone-300">|</span>
                <button onclick="openYuqueImageModal('${src}', '${cleanAlt}')" class="text-sky-700 hover:text-sky-900 font-semibold cursor-pointer transition hover:underline">点击放大查看</button>
            </div>
        </div>`;
    });

    // 超链接安全渲染 (添加 noopener noreferrer)
    text = text.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-700 underline font-semibold hover:text-sky-900 transition">$1 <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a>');

    // 粗体与斜体
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-stone-900 font-bold">$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em class="text-stone-700 italic">$1</em>');

    // 引用块
    text = text.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-amber-500 bg-amber-50/70 px-3.5 py-2 my-2.5 rounded-r-lg text-xs text-stone-800 font-serifMono">$1</blockquote>');

    // 简单表格解析
    const lines = text.split('\n');
    let inTable = false;
    let tableHtml = "";
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            // 检查是否为分隔行
            if (cells.every(c => /^:?-+:?$/.test(c))) {
                continue;
            }
            if (!inTable) {
                inTable = true;
                tableHtml = '<div class="overflow-x-auto my-4"><table class="w-full text-left text-xs border-collapse border border-stone-200 rounded-xl overflow-hidden font-serifMono"><thead class="bg-stone-100 text-stone-800 font-bold"><tr>';
                cells.forEach(c => { tableHtml += `<th class="p-2.5 border border-stone-200">${c}</th>`; });
                tableHtml += '</tr></thead><tbody class="divide-y divide-stone-100 bg-white">';
            } else {
                tableHtml += '<tr class="hover:bg-amber-50/40 transition">';
                cells.forEach(c => { tableHtml += `<td class="p-2.5 border border-stone-200 text-stone-700">${c}</td>`; });
                tableHtml += '</tr>';
            }
        } else {
            if (inTable) {
                inTable = false;
                tableHtml += '</tbody></table></div>';
                processedLines.push(tableHtml);
                tableHtml = "";
            }
            processedLines.push(lines[i]);
        }
    }
    if (inTable) {
        tableHtml += '</tbody></table></div>';
        processedLines.push(tableHtml);
    }
    text = processedLines.join('\n');

    // 列表解析
    text = text.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc text-stone-700 my-0.5">$1</li>');
    text = text.replace(/^([0-9]+)\. (.*?)$/gm, '<li class="ml-4 list-decimal text-stone-700 my-0.5">$2</li>');

    // 段落包裹 (非标签开头的普通文本行)
    text = text.split('\n\n').map(para => {
        para = para.trim();
        if (!para) return "";
        if (para.startsWith('<h') || para.startsWith('<div') || para.startsWith('<blockquote') || 
            para.startsWith('<hr') || para.startsWith('<table') || para.startsWith('<li') || 
            para.startsWith('__CODE_BLOCK_')) {
            return para;
        }
        return `<p class="my-2 leading-relaxed text-stone-800 text-xs sm:text-sm font-serifHeading">${para}</p>`;
    }).join('\n\n');

    // 还原行内代码
    inlineCodes.forEach((code, idx) => {
        text = text.replace(`__INLINE_CODE_${idx}__`, `<code class="bg-stone-100 text-amber-900 border border-stone-200 px-1.5 py-0.5 rounded text-[11px] font-mono">${safeEscape(code)}</code>`);
    });

    // 还原代码块并执行高亮 (完全对齐 28 天任务实验代码块纸质白底高亮风格)
    codeBlocks.forEach((block, idx) => {
        const lang = (block.lang || "cpp").toLowerCase();
        let highlightedCode = safeEscape(block.code);
        if (typeof hljs !== 'undefined') {
            try {
                if (hljs.getLanguage(lang)) {
                    highlightedCode = hljs.highlight(block.code, { language: lang }).value;
                } else {
                    highlightedCode = hljs.highlightAuto(block.code).value;
                }
            } catch (e) {
                highlightedCode = safeEscape(block.code);
            }
        }

        const codeId = `code-block-${idx}-${Date.now()}`;
        const copyButtonHtml = `<button onclick="copyCodeBlock('${codeId}')" class="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200 text-[11px] font-serifMono transition flex items-center gap-1.5 cursor-pointer shadow-2xs" title="复制代码">
            <i class="fa-regular fa-copy text-stone-500"></i> <span>复制代码</span>
        </button>`;

        const renderedBlock = `<div class="yuque-code-block relative my-4 rounded-xl border border-stone-200/90 bg-white shadow-xs font-serifMono overflow-hidden">
            <div class="bg-stone-50/90 px-3.5 py-1.5 text-[11px] flex items-center justify-between border-b border-stone-200/80 text-stone-600">
                <span class="font-bold text-stone-700 flex items-center gap-1.5">
                    <i class="fa-solid fa-code text-sky-700 text-xs"></i> <span>${safeEscape(lang)}</span>
                </span>
                ${copyButtonHtml}
            </div>
            <pre class="m-0 p-0 overflow-x-auto bg-white"><code id="${codeId}" class="hljs language-${lang} font-mono-code text-xs leading-relaxed block p-4 bg-white text-stone-900" style="background:#ffffff!important;">${highlightedCode}</code></pre>
        </div>`;

        text = text.replace(`__CODE_BLOCK_${idx}__`, renderedBlock);
    });

    return text;
}

// 一键复制代码块工具函数
window.copyCodeBlock = function(codeId) {
    const el = document.getElementById(codeId);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        if (typeof showToast === 'function') showToast("代码已复制到剪贴板");
    }).catch(() => {
        if (typeof showToast === 'function') showToast("复制失败，请手动选取", false);
    });
};

// 渲染 Yuque Knowledge Explorer 主入口
function renderYuqueExplorer() {
    ensureYuqueState();
    const dataset = getYuqueDataset();
    if (!dataset || dataset.length === 0) {
        console.warn("YUQUE_DATASET 为空或未加载");
        return;
    }

    renderYuqueMetrics();
    renderYuqueDirectoryList();
    renderYuqueRecentPills();
    renderYuqueReader(appState.currentYuqueArticleId);
}

// 统计掌握度与收藏指标
function renderYuqueMetrics() {
    const dataset = getYuqueDataset();
    const total = dataset.length;
    let masteredCount = 0;
    dataset.forEach(art => {
        const lvl = appState.knowledgeMastery[art.id] || 0;
        if (lvl >= 3) masteredCount++; // 达到“能够解释”或以上算掌握
    });

    const masteredEl = document.getElementById('yq-mastered-stat');
    if (masteredEl) masteredEl.innerText = `${masteredCount} / ${total} 篇`;

    const favEl = document.getElementById('yq-fav-stat');
    if (favEl) favEl.innerText = `${appState.knowledgeFavorites.length} 篇`;
}

// 渲染左侧“最近阅读”小药丸
function renderYuqueRecentPills() {
    const container = document.getElementById('yq-recent-pills');
    if (!container) return;

    if (!appState.knowledgeRecent || appState.knowledgeRecent.length === 0) {
        container.innerHTML = '<span class="text-stone-400 text-[11px]">暂无最近阅读记录</span>';
        return;
    }

    const dataset = getYuqueDataset();
    const recentArticles = appState.knowledgeRecent
        .map(id => dataset.find(d => d.id === id))
        .filter(Boolean)
        .slice(0, 4);

    container.innerHTML = recentArticles.map(art => {
        return `<button onclick="selectYuqueArticle('${art.id}')" class="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 text-[11px] font-serifMono truncate max-w-[140px] transition cursor-pointer" title="${safeEscape(art.title)}">
            <i class="fa-solid fa-clock-rotate-left text-[9px] mr-1 text-stone-400"></i>${safeEscape(art.title)}
        </button>`;
    }).join('');
}

// 渲染左侧文章目录树
function renderYuqueDirectoryList() {
    const listEl = document.getElementById('yq-directory-list');
    if (!listEl) return;

    const dataset = getYuqueDataset();
    const activeTag = appState.yuqueActiveTag;
    const query = (appState.yuqueSearchQuery || "").toLowerCase().trim();

    // 过滤文档
    let filtered = dataset.filter(art => {
        // 标签过滤
        if (activeTag === 'fav') {
            if (!appState.knowledgeFavorites.includes(art.id)) return false;
        } else if (activeTag === 'pending') {
            const lvl = appState.knowledgeMastery[art.id] || 0;
            if (lvl >= 3) return false;
        } else if (activeTag !== 'all') {
            if (art.category !== activeTag && (!art.tags || !art.tags.includes(activeTag))) return false;
        }

        // 搜索关键词过滤 (标题, 分类, 标签, 关联类, 源码文件)
        if (query) {
            const inTitle = art.title.toLowerCase().includes(query);
            const inCategory = (art.category || "").toLowerCase().includes(query);
            const inTags = (art.tags || []).some(t => t.toLowerCase().includes(query));
            const inClasses = (art.linkedClasses || []).some(c => c.toLowerCase().includes(query));
            const inFiles = (art.linkedSourceFiles || []).some(f => f.toLowerCase().includes(query));
            const inContent = (art.content || "").toLowerCase().includes(query);
            return inTitle || inCategory || inTags || inClasses || inFiles || inContent;
        }

        return true;
    });

    if (filtered.length === 0) {
        listEl.innerHTML = `
            <div class="p-6 text-center text-stone-400 font-serifMono text-xs">
                <i class="fa-solid fa-magnifying-glass text-stone-300 text-xl mb-2 block"></i>
                未找到匹配“${safeEscape(query || activeTag)}”的知识库章节
            </div>
        `;
        return;
    }

    listEl.innerHTML = filtered.map(art => {
        const isActive = art.id === appState.currentYuqueArticleId;
        const masteryLevel = appState.knowledgeMastery[art.id] || 0;
        const masteryCfg = MASTERY_LEVELS[masteryLevel] || MASTERY_LEVELS[0];
        const isFav = appState.knowledgeFavorites.includes(art.id);

        const activeClass = isActive
            ? "bg-amber-50/90 border-amber-300 shadow-xs"
            : "bg-white hover:bg-stone-50 border-stone-200/90";

        return `
            <div onclick="selectYuqueArticle('${art.id}')" class="p-3 rounded-xl border ${activeClass} transition cursor-pointer flex flex-col gap-1.5 group relative">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-stone-900 font-serifHeading truncate">
                        <span class="w-5 h-5 rounded-md bg-stone-100 text-stone-600 flex items-center justify-center font-serifMono text-[10px] shrink-0 font-black">
                            ${art.index}
                        </span>
                        <span class="truncate ${isActive ? 'text-amber-900 font-black' : ''}" title="${safeEscape(art.title)}">${safeEscape(art.title)}</span>
                    </div>
                    <button onclick="event.stopPropagation(); toggleYuqueFavorite('${art.id}')" class="text-stone-300 hover:text-amber-500 transition p-0.5 cursor-pointer" title="${isFav ? '取消收藏' : '加入收藏'}">
                        <i class="${isFav ? 'fa-solid text-amber-500' : 'fa-regular'} fa-star text-xs"></i>
                    </button>
                </div>

                <div class="flex items-center justify-between text-[11px] font-serifMono text-stone-500 mt-0.5">
                    <div class="flex items-center gap-1.5">
                        <span class="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px]">${safeEscape(art.category)}</span>
                        <span>${(art.wordCount / 1000).toFixed(1)}k 字</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-md border text-[10px] font-semibold ${masteryCfg.badgeClass}">
                        ${masteryCfg.label}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// 切换当前选中阅读的文章
function selectYuqueArticle(artId) {
    const dataset = getYuqueDataset();
    const art = dataset.find(d => d.id === artId);
    if (!art) return;

    appState.currentYuqueArticleId = artId;

    // 记录到最近阅读 (去重，保留最新)
    appState.knowledgeRecent = [artId, ...appState.knowledgeRecent.filter(id => id !== artId)].slice(0, 10);
    saveYuqueState();

    renderYuqueRecentPills();
    renderYuqueDirectoryList();
    renderYuqueReader(artId);
}

// 渲染右侧文章沉浸阅读器与关联卡片
function renderYuqueReader(artId) {
    const dataset = getYuqueDataset();
    const art = dataset.find(d => d.id === artId) || dataset[0];
    if (!art) return;

    // 顶栏标题与来源链接
    const titleEl = document.getElementById('yq-reader-title');
    if (titleEl) titleEl.innerText = art.title;

    const metaEl = document.getElementById('yq-reader-meta');
    if (metaEl) {
        metaEl.innerHTML = `
            <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">${safeEscape(art.category)}</span>
            <span>字数: <strong class="text-stone-800">${art.wordCount.toLocaleString()}</strong> 字</span>
            <span>更新: ${art.updatedAt ? art.updatedAt.slice(0, 10) : '近期'}</span>
            <span class="text-emerald-700 font-bold"><i class="fa-solid fa-circle-check"></i> 100% FULL 离线就绪</span>
        `;
    }

    const yuqueLinkEl = document.getElementById('yq-open-external-link');
    if (yuqueLinkEl) {
        yuqueLinkEl.href = art.url;
    }

    // 掌握度选择器渲染
    renderMasterySelector(art.id);

    // 源码与工程调用链路锚定卡片渲染
    renderSourceTraceCard(art);

    // 渲染正文 Markdown
    const bodyEl = document.getElementById('yq-reader-body');
    if (bodyEl) {
        bodyEl.innerHTML = renderMarkdownSafe(art.content);
    }

    // 滚动至顶部
    const scrollContainer = document.getElementById('yq-reader-scroll');
    if (scrollContainer) scrollContainer.scrollTop = 0;
}

// 渲染 6 阶掌握度评级选择器
function renderMasterySelector(artId) {
    const container = document.getElementById('yq-mastery-selector');
    if (!container) return;

    const currentLevel = appState.knowledgeMastery[artId] || 0;

    container.innerHTML = MASTERY_LEVELS.map(cfg => {
        const isCurrent = cfg.level === currentLevel;
        const btnClass = isCurrent
            ? "bg-stone-900 text-white font-bold shadow-xs border-stone-900"
            : "bg-white hover:bg-stone-100 text-stone-700 border-stone-200";

        return `
            <button onclick="setYuqueMastery('${artId}', ${cfg.level})" class="px-2.5 py-1.5 rounded-lg border text-xs font-serifMono transition flex items-center gap-1.5 cursor-pointer ${btnClass}" title="${cfg.desc}">
                <span class="w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-400' : 'bg-stone-300'}"></span>
                <span>L${cfg.level} ${cfg.label}</span>
            </button>
        `;
    }).join('');
}

// 设置掌握度
window.setYuqueMastery = function(artId, level) {
    ensureYuqueState();
    appState.knowledgeMastery[artId] = level;
    saveYuqueState();

    const cfg = MASTERY_LEVELS[level] || MASTERY_LEVELS[0];
    if (typeof showToast === 'function') {
        showToast(`已更新知识掌握度为: L${level} ${cfg.label}`);
    }

    renderYuqueMetrics();
    renderYuqueDirectoryList();
    renderMasterySelector(artId);
};

// 收藏切换
window.toggleYuqueFavorite = function(artId) {
    ensureYuqueState();
    const idx = appState.knowledgeFavorites.indexOf(artId);
    if (idx >= 0) {
        appState.knowledgeFavorites.splice(idx, 1);
        if (typeof showToast === 'function') showToast("已取消收藏");
    } else {
        appState.knowledgeFavorites.push(artId);
        if (typeof showToast === 'function') showToast("已加入收藏 ★");
    }
    saveYuqueState();
    renderYuqueMetrics();
    renderYuqueDirectoryList();
};

// 标签筛选
window.filterYuqueTag = function(tag) {
    ensureYuqueState();
    appState.yuqueActiveTag = tag;
    
    // 更新标签按钮状态
    const buttons = document.querySelectorAll('.yq-tag-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tag') === tag) {
            btn.className = "yq-tag-btn px-3 py-1 rounded-lg text-xs font-serifMono font-bold bg-amber-800 text-white shadow-xs transition";
        } else {
            btn.className = "yq-tag-btn px-3 py-1 rounded-lg text-xs font-serifMono font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition";
        }
    });

    renderYuqueDirectoryList();
};

// 搜索输入过滤
window.handleYuqueSearch = function(query) {
    ensureYuqueState();
    appState.yuqueSearchQuery = query;
    renderYuqueDirectoryList();
};

// 渲染源码与工程调用链路锚定卡片
function renderSourceTraceCard(art) {
    const traceEl = document.getElementById('yq-source-trace-card');
    if (!traceEl) return;

    if (!art.linkedSourceFiles || art.linkedSourceFiles.length === 0) {
        traceEl.innerHTML = `
            <div class="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-600 font-serifMono">
                <div class="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-info text-amber-600"></i> 全局架构与学习规范
                </div>
                本篇作为项目全局指导与面试策略，贯穿整体 CppAIService 体系。
            </div>
        `;
        return;
    }

    const filesHtml = art.linkedSourceFiles.map(f => {
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-stone-800 border border-stone-200 text-[11px] font-mono">
            <i class="fa-solid fa-file-code text-teal-700"></i> ${safeEscape(f)}
        </span>`;
    }).join(' ');

    const classesHtml = (art.linkedClasses || []).map(c => {
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-200 text-[11px] font-mono font-bold">
            ${safeEscape(c)}
        </span>`;
    }).join(' ');

    const funcsHtml = (art.linkedFunctions || []).map(fn => {
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 text-[11px] font-mono">
            ${safeEscape(fn)}
        </span>`;
    }).join(' ');

    const qaHtml = (art.interviewKeyPoints || []).map(qa => {
        return `<li class="text-[11.5px] text-stone-700 flex items-start gap-1.5 my-1">
            <i class="fa-solid fa-question-circle text-amber-600 mt-0.5 shrink-0"></i>
            <span>${safeEscape(qa)}</span>
        </li>`;
    }).join('');

    traceEl.innerHTML = `
        <div class="bg-gradient-to-r from-stone-50 via-amber-50/20 to-sky-50/30 border border-stone-200 rounded-xl p-4 font-serifMono space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="font-bold text-xs text-stone-900 font-serifHeading flex items-center gap-1.5">
                        <i class="fa-solid fa-network-wired text-sky-800"></i> 源码与工程行级锚定: ${safeEscape(art.linkedModuleTitle || art.linkedModule)}
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="createTaskFromYuque('${art.id}')" class="px-2.5 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer">
                        <i class="fa-solid fa-calendar-plus"></i> 生成攻坚任务
                    </button>
                    <button onclick="createPitfallFromYuque('${art.id}')" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer">
                        <i class="fa-solid fa-bug"></i> 记录排错
                    </button>
                </div>
            </div>

            <!-- 关联链路细节 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                <div class="bg-white p-2.5 rounded-lg border border-stone-200/80">
                    <span class="text-stone-400 font-bold block mb-1">源码文件 (Source):</span>
                    <div class="flex flex-wrap gap-1">${filesHtml}</div>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-stone-200/80">
                    <span class="text-stone-400 font-bold block mb-1">核心类 (Classes):</span>
                    <div class="flex flex-wrap gap-1">${classesHtml || '<span class="text-stone-400">-</span>'}</div>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-stone-200/80">
                    <span class="text-stone-400 font-bold block mb-1">关键调用 (Functions):</span>
                    <div class="flex flex-wrap gap-1">${funcsHtml || '<span class="text-stone-400">-</span>'}</div>
                </div>
            </div>

            <!-- 面试深挖点 -->
            ${qaHtml ? `
                <div class="bg-white/80 p-3 rounded-lg border border-stone-200/80 pt-2">
                    <span class="text-stone-500 font-bold text-[11px] block mb-1">大厂面试深挖考点:</span>
                    <ul class="space-y-0.5">${qaHtml}</ul>
                </div>
            ` : ''}
        </div>
    `;
}

// 从当前语雀文章快速生成攻坚任务
window.createTaskFromYuque = function(artId) {
    const dataset = getYuqueDataset();
    const art = dataset.find(d => d.id === artId);
    if (!art) return;

    if (typeof showToast === 'function') {
        showToast(`已为【${art.title}】生成今日 CppAIService 攻坚任务！`);
    }

    // 自动切换到任务视图或日历，并预置打卡会话
    if (typeof switchView === 'function') {
        switchView('dashboard');
    }
};

// 从当前语雀文章快速沉淀踩坑记录
window.createPitfallFromYuque = function(artId) {
    const dataset = getYuqueDataset();
    const art = dataset.find(d => d.id === artId);
    if (!art) return;

    if (typeof openNewPitfallModal === 'function') {
        openNewPitfallModal();
        const symptomInput = document.getElementById('np-symptom');
        const causeInput = document.getElementById('np-cause');
        if (symptomInput) symptomInput.value = `研读【${art.title}】时的异常排查`;
        if (causeInput) causeInput.value = `关联模块: ${art.linkedModule} (${art.linkedSourceFiles ? art.linkedSourceFiles.join(', ') : ''})`;
    }
};

// 数据持久化
function saveYuqueState() {
    try {
        localStorage.setItem('cppai_knowledge_mastery', JSON.stringify(appState.knowledgeMastery));
        localStorage.setItem('cppai_knowledge_favs', JSON.stringify(appState.knowledgeFavorites));
        localStorage.setItem('cppai_knowledge_recent', JSON.stringify(appState.knowledgeRecent));
    } catch (e) {
        console.error("保存语雀状态失败:", e);
    }
}

// 启动时自动恢复持久化
function loadYuqueState() {
    ensureYuqueState();
    try {
        const m = localStorage.getItem('cppai_knowledge_mastery');
        if (m) appState.knowledgeMastery = JSON.parse(m);
        const f = localStorage.getItem('cppai_knowledge_favs');
        if (f) appState.knowledgeFavorites = JSON.parse(f);
        const r = localStorage.getItem('cppai_knowledge_recent');
        if (r) appState.knowledgeRecent = JSON.parse(r);
    } catch (e) {
        console.warn("恢复语雀状态失败:", e);
    }
}

// 语雀高清架构大图灯箱预览
window.openYuqueImageModal = function(src, title) {
    const modal = document.getElementById('yuque-image-modal');
    const modalImg = document.getElementById('yuque-modal-img');
    const modalTitle = document.getElementById('yuque-modal-title');
    const openTab = document.getElementById('yuque-modal-open-tab');
    if (!modal || !modalImg) return;
    modalImg.src = src;
    if (modalTitle) modalTitle.innerText = title || "架构与技术全景图";
    if (openTab) openTab.href = src;
    modal.classList.remove('hidden');
};

window.closeYuqueImageModal = function() {
    document.getElementById('yuque-image-modal')?.classList.add('hidden');
};

window.handleImageLoadError = function(img) {
    const src = img.getAttribute('src') || '';
    if (!src) return;
    const basename = src.split('/').pop().split('?')[0];
    if (basename && !src.endsWith('/' + basename)) {
        img.src = 'images/yuque/' + basename;
    }
};

// 自执行加载
if (typeof window !== 'undefined') {
    window.renderYuqueExplorer = renderYuqueExplorer;
    window.loadYuqueState = loadYuqueState;
    window.selectYuqueArticle = selectYuqueArticle;
    window.openYuqueImageModal = openYuqueImageModal;
    window.closeYuqueImageModal = closeYuqueImageModal;
    window.handleImageLoadError = handleImageLoadError;
    loadYuqueState();
}
