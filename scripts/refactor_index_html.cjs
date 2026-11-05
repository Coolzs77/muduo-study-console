const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Title
html = html.replace(/<title>.*?<\/title>/, '<title>C++ 与算法</title>');

// 2. Header
const headerTargetRegex = /<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">\s*<div>\s*<div class="inline-flex flex-wrap items-center gap-2[\s\S]*?<\/div>\s*<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">[\s\S]*?<\/h1>\s*<p class="text-stone-600[\s\S]*?<\/p>\s*<!-- 工程工作台模式切换条[\s\S]*?<\/div>\s*<\/div>\s*<!-- 右侧快捷指引与架构概览 -->\s*<div class="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2\.5 shrink-0 self-start md:self-auto font-serifMono">[\s\S]*?<\/div>\s*<\/div>/;

const headerReplacement = `<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
            <div>
                <h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">
                    C++ 与算法
                </h1>
            </div>
            <div class="flex flex-wrap items-center gap-2 shrink-0 font-serifMono">
                <button onclick="openEnvGuideModal()" class="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer">
                    <i class="fa-solid fa-server text-sky-700"></i>
                    <span>开发环境</span>
                </button>
                <button onclick="scrollToTopology()" class="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer">
                    <i class="fa-solid fa-network-wired text-amber-700"></i>
                    <span>架构拓扑</span>
                </button>
            </div>
        </div>`;

if (headerTargetRegex.test(html)) {
  html = html.replace(headerTargetRegex, headerReplacement);
  console.log('✓ Header successfully cleaned!');
} else {
  console.warn('⚠️ headerTargetRegex did not match, trying fallback pattern...');
  html = html.replace(/<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">[\s\S]*?<\/h1>/,
    `<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">C++ 与算法</h1>`);
}

// 3. 移除进度条的修饰文案
html = html.replace(/<span class="text-amber-700 font-semibold">28 Days Mastery Pipeline<\/span>/g, '<span class="text-amber-700 font-semibold">进度</span>');
html = html.replace(/<span id="progress-bar-text">准备踏入 muduo 源码大门<\/span>/g, '<span id="progress-bar-text">准备就绪</span>');

// 4. 导航栏标签纯净化
html = html.replace(/(<button onclick="switchView\('dashboard'\)"[^>]*>[\s\S]*?<i[^>]*><\/i>)\s*工作台/g, '$1 控制台');
html = html.replace(/(<button onclick="switchView\('mapping'\)"[^>]*>[\s\S]*?<i[^>]*><\/i>)\s*CppAIService 项目/g, '$1 CppAIService');
html = html.replace(/(<button onclick="switchView\('learning'\)"[^>]*>[\s\S]*?<i[^>]*><\/i>)\s*统一学习系统/g, '$1 算法');
html = html.replace(/(<button onclick="switchView\('daily'\)"[^>]*>[\s\S]*?<i[^>]*><\/i>)\s*muduo 源码路线/g, '$1 Muduo 路线');
html = html.replace(/(<button onclick="switchView\('knowledge'\)"[^>]*>[\s\S]*?<i[^>]*><\/i>)\s*知识库 \(语雀\)/g, '$1 知识库');
html = html.replace(/(<button onclick="switchView\('quiz'\)"[^>]*>[\s\S]*?<i[^>]*><\/i>)\s*面试题库与自测/g, '$1 测验');
html = html.replace(/(<button onclick="switchView\('source'\)"[^>]*>[\s\S]*?<i[^>]*><\/i>)\s*源码速查/g, '$1 源码');
html = html.replace(/(<button onclick="switchView\('pitfalls'\)"[^>]*>[\s\S]*?<i[^>]*><\/i>)\s*踩坑档案/g, '$1 避坑');

// 5. 首页卡片标题与副标题清理
// 移除今日任务的预计耗时徽章
html = html.replace(/<span id="today-tasks-badge"[\s\S]*?<\/span>/g, '');
// 工程记录
html = html.replace(/<h2 class="text-base font-bold text-stone-900 flex items-center gap-2 font-serifHeading">\s*<i class="fa-solid fa-terminal text-emerald-700"><\/i>\s*最近工程记录 \(Recent Logs\)\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-0\.5">.*?<\/p>/s,
  `<h2 class="text-base font-bold text-stone-900 flex items-center gap-2 font-serifHeading">
                                <i class="fa-solid fa-terminal text-emerald-700"></i> 工程记录
                            </h2>`);

// 状态卡片标题
html = html.replace(/本周统计 \(核心指标\)/g, '本周统计');
html = html.replace(/muduo 知识库进度/g, 'Muduo 知识库进度');
html = html.replace(/muduo 28天学习日程/g, 'Muduo 28天日程');

// 打卡日历标题与副标题
html = html.replace(/<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serifHeading">\s*<i class="fa-solid fa-calendar-days text-amber-700"><\/i>\s*28 天学习打卡索引日历\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-0\.5">.*?<\/p>/s,
  `<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serifHeading">
                        <i class="fa-solid fa-calendar-days text-amber-700"></i> 打卡日历
                    </h2>`);

// 6. Mapping view (CppAIService)
html = html.replace(/<div class="inline-flex items-center gap-2 px-2\.5 py-0\.5 rounded-full bg-emerald-50[\s\S]*?<\/div>\s*<h2 class="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-serifHeading">\s*<i class="fa-solid fa-diagram-project text-emerald-700"><\/i>\s*CppAIService 核心架构与模块地图\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-1 leading-relaxed">[\s\S]*?<\/p>/s,
  `<h2 class="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-serifHeading">
                        <i class="fa-solid fa-diagram-project text-emerald-700"></i> CppAIService 架构模块
                    </h2>`);

// 架构参考图标题
html = html.replace(/<div class="inline-flex items-center gap-1\.5 px-2\.5 py-0\.5 rounded bg-sky-50[\s\S]*?<\/div>\s*<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif-heading">\s*<i class="fa-solid fa-network-wired text-sky-700"><\/i>\s*muduo 与 CppAIService 架构关系与流程图\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-0\.5">[\s\S]*?<\/p>/s,
  `<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif-heading">
                        <i class="fa-solid fa-network-wired text-sky-700"></i> 架构拓扑
                    </h2>`);

// 7. Learning view (算法)
html = html.replace(/<div class="inline-flex items-center gap-2 px-2\.5 py-0\.5 rounded-full bg-emerald-50[\s\S]*?<\/div>\s*<h2 class="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-serifHeading">\s*<i class="fa-solid fa-graduation-cap text-emerald-700"><\/i>\s*统一学习系统与知识与实践关联中心\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-1 max-w-3xl leading-relaxed">[\s\S]*?<\/p>/s,
  `<h2 class="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-serifHeading">
                        <i class="fa-solid fa-graduation-cap text-emerald-700"></i> 算法
                    </h2>`);

html = html.replace(/1\. C\+\+ 学习路线/g, 'C++ 路线');
html = html.replace(/2\. Linux 私房菜底座/g, 'Linux');
html = html.replace(/3\. 专业书目伴读/g, '专业书目');
html = html.replace(/4\. 算法手撕 Lab/g, '算法题库');
html = html.replace(/5\. 项目代码八股/g, '项目八股');
html = html.replace(/6\. 通识阅读三部曲/g, '通识阅读');

// 8. Knowledge view (语雀)
html = html.replace(/<div class="flex items-center gap-2">\s*<span class="px-2\.5 py-0\.5 rounded-full bg-blue-100[\s\S]*?<\/div>\s*<h2 class="text-lg sm:text-xl font-black text-stone-900 mt-1 font-serifHeading flex items-center gap-2">\s*<i class="fa-solid fa-book-bookmark text-sky-700"><\/i>\s*muduo-core & CppAIService 深度专栏知识库\s*<\/h2>\s*<p class="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">[\s\S]*?<\/p>/s,
  `<h2 class="text-lg sm:text-xl font-black text-stone-900 mt-1 font-serifHeading flex items-center gap-2">
                        <i class="fa-solid fa-book-bookmark text-sky-700"></i> 语雀专栏
                    </h2>`);

// 9. Quiz view (测验)
html = html.replace(/<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif-heading">\s*<i class="fa-solid fa-clipboard-question text-purple-700"><\/i>\s*面试题库与深度自测中心\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-0\.5">.*?<\/p>/s,
  `<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif-heading">
                        <i class="fa-solid fa-clipboard-question text-purple-700"></i> 测验
                    </h2>`);

// 10. Source view (源码速查)
html = html.replace(/<div class="inline-flex items-center gap-1\.5 px-2\.5 py-0\.5 rounded bg-teal-50[\s\S]*?<\/div>\s*<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif-heading">\s*muduo 8 阶核心源码演进路线图\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-0\.5">[\s\S]*?<\/p>/s,
  `<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif-heading">
                        <i class="fa-solid fa-code-branch text-teal-600"></i> 源码速查
                    </h2>`);

// 11. Pitfalls view (避坑指南)
html = html.replace(/<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif-heading">\s*<i class="fa-solid fa-bug text-rose-600"><\/i>\s*C\+\+ 典型问题与避坑档案库\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-0\.5">.*?<\/p>/s,
  `<h2 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2 font-serif-heading">
                        <i class="fa-solid fa-bug text-rose-600"></i> 避坑指南
                    </h2>`);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ Successfully refactored index.html');
