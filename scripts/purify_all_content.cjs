const fs = require('fs');
const path = require('path');

console.log('--- Starting comprehensive purification of index.html, classic.html, and js/app.js ---');

// 1. Refactor index.html
const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Title
indexHtml = indexHtml.replace(/<title>.*?<\/title>/, '<title>Muduo & CppAIService</title>');
// H1
indexHtml = indexHtml.replace(/<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">\s*C\+\+ 与算法\s*<\/h1>/,
  '<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">Muduo & CppAIService</h1>');

// Fix timer comment typo
indexHtml = indexHtml.replace(/<!-- 第三行：专注学习计时<!-- 第三行：专注学习计时与快捷记时栏 -->/g, '<!-- 专注计时 -->');

// Replace hype words in options
indexHtml = indexHtml.replace(/<option value="algorithm">手撕算法<\/option>/g, '<option value="algorithm">算法</option>');
indexHtml = indexHtml.replace(/<option value="S">S 级 · 核心攻坚<\/option>/g, '<option value="S">S 级</option>');
indexHtml = indexHtml.replace(/<option value="A" selected>A 级 · 主干底座<\/option>/g, '<option value="A" selected>A 级</option>');
indexHtml = indexHtml.replace(/<option value="B">B 级 · 知识巩固<\/option>/g, '<option value="B">B 级</option>');

// Clean subtitles and banners in index.html
// 工程记录 subtitle
indexHtml = indexHtml.replace(/<p class="text-xs text-stone-500 mt-0\.5">代码修改、Bug 排查、Demo 实验与技术复盘日志<\/p>\s*/g, '');

// Quick banner in view-dashboard
indexHtml = indexHtml.replace(/<div class="inline-flex items-center gap-1\.5 px-2\.5 py-0\.5 rounded-full bg-emerald-100 text-emerald-900 text-\[11px\] font-serifMono font-bold mb-1">\s*<i class="fa-solid fa-link text-emerald-700"><\/i>\s*六维联动 ➔ 底层体系\s*<\/div>\s*<h3 class="text-sm font-bold text-stone-900 font-serifHeading">探索 C\+\+ 8维核心语法、Linux 9维底座与代码随想录算法手撕？<\/h3>\s*<p class="text-xs text-stone-600 mt-0\.5">进入统一学习系统，查看 C\+\+ 15项映射、陈硕书目伴读、179 道手撕算法 Lab 与项目真实八股。<\/p>/g,
  '<h3 class="text-sm font-bold text-stone-900 font-serifHeading">C++ 语法、Linux 系统与算法题库</h3>');

// view-learning header
indexHtml = indexHtml.replace(/<h2 class="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-serifHeading">\s*<i class="fa-solid fa-graduation-cap text-emerald-700"><\/i>\s*算法与知识与实践关联中心\s*<\/h2>\s*<p class="text-xs text-stone-500 mt-1 max-w-3xl leading-relaxed">[\s\S]*?<\/p>/g,
  '<h2 class="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-serifHeading">\n                        <i class="fa-solid fa-graduation-cap text-emerald-700"></i> 算法与知识体系\n                    </h2>');

// view-learning button
indexHtml = indexHtml.replace(/查看知识与工程全景关联/g, '知识与工程关联');

// view-learning C++ mapping card
indexHtml = indexHtml.replace(/<h3 class="font-bold text-stone-900 text-base flex items-center gap-2 font-serifHeading">\s*<i class="fa-solid fa-table-list text-sky-800"><\/i>\s*C\+\+ 核心机制 ➔ muduo 源码设计映射全景图\s*<\/h3>\s*<p class="text-xs text-stone-500 mt-1">[\s\S]*?<\/p>/g,
  '<h3 class="font-bold text-stone-900 text-base flex items-center gap-2 font-serifHeading">\n                                    <i class="fa-solid fa-table-list text-sky-800"></i> C++ 核心机制 ➔ muduo 源码映射\n                                </h3>');

// view-knowledge header
indexHtml = indexHtml.replace(/<h2 class="text-lg sm:text-xl font-black text-stone-900 mt-1 font-serifHeading flex items-center gap-2">\s*<i class="fa-solid fa-book-bookmark text-sky-700"><\/i>\s*muduo-core & CppAIService 语雀原版专栏知识库\s*<\/h2>\s*<p class="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">[\s\S]*?<\/p>/g,
  '<h2 class="text-lg sm:text-xl font-black text-stone-900 mt-1 font-serifHeading flex items-center gap-2">\n                        <i class="fa-solid fa-book-bookmark text-sky-700"></i> Muduo & CppAIService 语雀专栏\n                    </h2>');

// Modal headers & subtitles
indexHtml = indexHtml.replace(/<h4 class="font-bold text-stone-900 text-base font-serifHeading" id="crosslink-modal-title">六维技术关联透视<\/h4>\s*<p class="text-xs text-stone-500 font-serifMono" id="crosslink-modal-subtitle">.*?<\/p>/g,
  '<h4 class="font-bold text-stone-900 text-base font-serifHeading" id="crosslink-modal-title">技术关联</h4>');

indexHtml = indexHtml.replace(/<h4 class="font-bold text-stone-900 text-base font-serifHeading">录入真实工程凭证<\/h4>\s*<p class="text-xs text-stone-500 font-serifMono">严禁虚构 · 凭证驱动 · 支撑能力晋级<\/p>/g,
  '<h4 class="font-bold text-stone-900 text-base font-serifHeading">录入工程凭据</h4>');

indexHtml = indexHtml.replace(/<h4 class="font-bold text-stone-900 text-base font-serifHeading">记录工程工作日志<\/h4>\s*<p class="text-xs text-stone-500 font-serifMono">记录真实过程 · 沉淀排错经验 · 积累求职凭据<\/p>/g,
  '<h4 class="font-bold text-stone-900 text-base font-serifHeading">记录工程日志</h4>');

indexHtml = indexHtml.replace(/<span id="yuque-modal-title">架构与技术全景图<\/span>/g, '<span id="yuque-modal-title">架构与技术图</span>');
indexHtml = indexHtml.replace(/<span>记录手撕算法题<\/span>/g, '<span>记录算法题</span>');
indexHtml = indexHtml.replace(/关闭透视/g, '关闭');
indexHtml = indexHtml.replace(/aria-label="六维技术穿透透视"/g, 'aria-label="技术关联"');
indexHtml = indexHtml.replace(/aria-label="算法手撕记录"/g, 'aria-label="算法记录"');
indexHtml = indexHtml.replace(/<!-- ==================== 六维整体流程穿透透视 Modal ==================== -->/g, '<!-- 技术关联 Modal -->');

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ index.html successfully purified');

// 2. Refactor classic.html
const classicHtmlPath = path.join(__dirname, '../classic.html');
let classicHtml = fs.readFileSync(classicHtmlPath, 'utf8');

classicHtml = classicHtml.replace(/<title>.*?<\/title>/, '<title>Muduo & CppAIService</title>');
classicHtml = classicHtml.replace(/<div class="inline-flex flex-wrap items-center gap-2[\s\S]*?面向 muduo 源码学习 • V5\.0 学习控制台\s*<\/div>\s*<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">\s*C\+\+ 与算法\s*<\/h1>\s*<p class="text-stone-600 text-xs sm:text-sm mt-1\.5 max-w-3xl leading-relaxed">[\s\S]*?<\/p>/g,
  '<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">Muduo & CppAIService</h1>');

classicHtml = classicHtml.replace(/手撕算法/g, '算法');
classicHtml = classicHtml.replace(/全景图/g, '架构图');
classicHtml = classicHtml.replace(/全景矩阵/g, '掌握度矩阵');

fs.writeFileSync(classicHtmlPath, classicHtml, 'utf8');
console.log('✓ classic.html successfully purified');

// 3. Refactor js/app.js
const appJsPath = path.join(__dirname, '../js/app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Title / header references if any
appJs = appJs.replace(/C\+\+ 与算法/g, 'Muduo & CppAIService');

// Hype words in app.js
appJs = appJs.replace(/手撕算法/g, '算法');
appJs = appJs.replace(/直达手撕 Lab/g, '算法题库');
appJs = appJs.replace(/直达手撕算法 Lab/g, '算法题库');
appJs = appJs.replace(/记录手撕题/g, '记录算法题');
appJs = appJs.replace(/记录手撕算法题/g, '记录算法题');
appJs = appJs.replace(/算法手撕 Lab/g, '算法题库');
appJs = appJs.replace(/算法手撕完成/g, '算法完成');
appJs = appJs.replace(/直达书目伴读/g, '查看书目');
appJs = appJs.replace(/六维关联追踪/g, '技术关联');
appJs = appJs.replace(/六维技术关联透视/g, '技术关联');
appJs = appJs.replace(/六维整体流程穿透透视器/g, '技术关联透视器');
appJs = appJs.replace(/14 维后端核心能力矩阵评估态势/g, '后端核心能力评估');
appJs = appJs.replace(/S 级·核心攻坚/g, 'S 级');
appJs = appJs.replace(/A 级·主干底座/g, 'A 级');
appJs = appJs.replace(/B 级·知识巩固/g, 'B 级');
appJs = appJs.replace(/A 级 · 主干算法与底座/g, 'A 级 · 算法与系统');
appJs = appJs.replace(/全景路线已学/g, '路线已学');
appJs = appJs.replace(/私房菜掌握度/g, 'Linux 掌握度');
appJs = appJs.replace(/架构全景视图/g, '架构视图');
appJs = appJs.replace(/项目架构全景剖析/g, '项目架构剖析');
appJs = appJs.replace(/muduo 底层网络库 28 天掌握度全景矩阵/g, 'muduo 28 天掌握度矩阵');
appJs = appJs.replace(/28 天掌握度全景矩阵/g, '28 天掌握度矩阵');
appJs = appJs.replace(/网络服务底座与 AI 编排系统/g, '网络服务与 AI 编排系统');

// Ensure isAlgoItemDone handles both number and string types cleanly
appJs = appJs.replace(/const isAlgoItemDone = \(p\) => \{[\s\S]*?\};/,
`const isAlgoItemDone = (p) => {
        if (!completedMap) return false;
        if (p.num !== null && p.num !== undefined) {
            return !!completedMap[p.num] || !!completedMap[String(p.num)];
        }
        return p.id ? !!completedMap[p.id] : false;
    };`);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ js/app.js successfully purified');

console.log('--- Purification complete! ---');
