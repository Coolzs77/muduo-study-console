const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'js', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');

// 1. 替换 currentAlgoCategory 声明，增加 currentAlgoSection
const sectionStateOld = `let currentAlgoCategory = '全部';
let algoSearchKeyword = '';`;

const sectionStateNew = `let currentAlgoSection = 'all'; // 'all' | 'hot100' | 'carl'
let currentAlgoCategory = '全部';
let algoSearchKeyword = '';

function setAlgoSectionFilter(section) {
    currentAlgoSection = section;
    renderLearningAlgoTab();
}
window.setAlgoSectionFilter = setAlgoSectionFilter;`;

content = content.replace(sectionStateOld, sectionStateNew);

// 2. 重构 renderLearningAlgoTab
const oldRenderFnStart = "function renderLearningAlgoTab() {";
const oldRenderFnEnd = "function setAlgoCategoryFilter(cat) {";

const idxStart = content.indexOf(oldRenderFnStart);
const idxEnd = content.indexOf(oldRenderFnEnd);

if (idxStart === -1 || idxEnd === -1) {
    console.error('Cannot locate renderLearningAlgoTab boundaries in app.js');
    process.exit(1);
}

const newRenderFn = `function renderLearningAlgoTab() {
    const container = document.getElementById('algo-lab-container');
    if (!container) return;
    const catalog = (typeof ALGORITHM_LAB_CATALOG !== 'undefined') ? ALGORITHM_LAB_CATALOG : [];

    // 获取已完成题目集合
    let completedMap = {};
    if (typeof stateManager !== 'undefined' && stateManager && stateManager.getState) {
        const st = stateManager.getState();
        completedMap = (st.learningSystem && st.learningSystem.completedAlgos) || {};
    } else if (appState && appState.learningSystem) {
        completedMap = appState.learningSystem.completedAlgos || {};
    }

    const categories = ['全部', '数组', '链表', '哈希表', '字符串', '双指针法', '栈与队列', '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'];

    // 12 大分类元数据
    const algoCategoriesMeta = [
        { name: '数组', icon: 'fa-table-cells', desc: '二分/双指针/滑动窗口' },
        { name: '链表', icon: 'fa-link', desc: '虚拟头/环检测/双指针' },
        { name: '哈希表', icon: 'fa-hashtag', desc: '频次统计/两数之和/去重' },
        { name: '字符串', icon: 'fa-quote-left', desc: '双指针/KMP前缀表' },
        { name: '双指针法', icon: 'fa-arrows-left-right-to-line', desc: '对撞/快慢指针' },
        { name: '栈与队列', icon: 'fa-layer-group', desc: '单调栈/逆波兰/滑动窗口' },
        { name: '二叉树', icon: 'fa-tree', desc: '递归/迭代/层序/BST' },
        { name: '回溯算法', icon: 'fa-route', desc: '组合/分割/排列/棋盘' },
        { name: '贪心算法', icon: 'fa-hand-holding-dollar', desc: '局部最优/区间调度' },
        { name: '动态规划', icon: 'fa-chess-board', desc: '背包/打家劫舍/子序列' },
        { name: '单调栈', icon: 'fa-chart-simple', desc: '下一个更大元素/接雨水' },
        { name: '图论', icon: 'fa-circle-nodes', desc: '深搜/广搜/并查集/最短路' }
    ];

    // 分区与统计
    const totalCount = catalog.length;
    const totalCompleted = catalog.filter(p => !!completedMap[p.num]).length;

    const hot100List = catalog.filter(p => !!p.isHot100);
    const hot100Total = hot100List.length;
    const hot100Completed = hot100List.filter(p => !!completedMap[p.num]).length;

    const carlList = catalog.filter(p => !!p.isCarl);
    const carlTotal = carlList.length;
    const carlCompleted = carlList.filter(p => !!completedMap[p.num]).length;

    // 当前分区数据集
    const activeSectionList = catalog.filter(p => {
        if (currentAlgoSection === 'hot100') return !!p.isHot100;
        if (currentAlgoSection === 'carl') return !!p.isCarl;
        return true;
    });

    // 过滤：结合当前分区、分类与搜索关键词
    const filtered = activeSectionList.filter(p => {
        const matchCat = currentAlgoCategory === '全部' || p.category === currentAlgoCategory;
        const matchKw = !algoSearchKeyword ||
            p.title.toLowerCase().includes(algoSearchKeyword.toLowerCase()) ||
            String(p.num).includes(algoSearchKeyword) ||
            (p.pattern && p.pattern.toLowerCase().includes(algoSearchKeyword.toLowerCase()));
        return matchCat && matchKw;
    });

    // 分类全览卡片 HTML (响应当前分区与完成度)
    const overviewCardsHtml = algoCategoriesMeta.map(c => {
        const catProbs = activeSectionList.filter(p => p.category === c.name);
        const catTotal = catProbs.length;
        const catDone = catProbs.filter(p => !!completedMap[p.num]).length;
        const pct = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
        const isAllDone = (catDone === catTotal && catTotal > 0);
        const isSelected = (currentAlgoCategory === c.name);

        let borderBgClass = 'bg-stone-50/70 border-stone-200 hover:border-stone-400 hover:bg-stone-100/60';
        if (isSelected) {
            borderBgClass = 'ring-2 ring-indigo-600 bg-indigo-50/60 border-indigo-400 shadow-sm';
        } else if (isAllDone) {
            borderBgClass = 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400';
        } else if (catDone > 0) {
            borderBgClass = 'bg-indigo-50/25 border-indigo-200 hover:border-indigo-300';
        }

        let badgeHtml = '';
        if (isAllDone) {
            badgeHtml = '<span class="text-[10px] font-serifMono font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 shrink-0">✓ 通关</span>';
        } else if (catDone > 0) {
            badgeHtml = \`<span class="text-[10px] font-serifMono font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 shrink-0">\${pct}%</span>\`;
        } else {
            badgeHtml = '<span class="text-[10px] font-serifMono font-medium px-1.5 py-0.2 rounded bg-stone-200 text-stone-600 shrink-0">未做</span>';
        }

        const barColor = isAllDone ? 'bg-emerald-500' : (catDone > 0 ? 'bg-indigo-600' : 'bg-transparent');

        return \`
            <div onclick="setAlgoCategoryFilter('\${c.name}')" class="p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none \${borderBgClass}">
                <div>
                    <div class="flex items-center justify-between gap-1 mb-1">
                        <span class="inline-flex items-center gap-1.5 font-bold text-xs font-serifHeading \${isAllDone ? 'text-emerald-900' : (isSelected ? 'text-indigo-900' : 'text-stone-800')}">
                            <i class="fa-solid \${c.icon} \${isAllDone ? 'text-emerald-600' : (isSelected ? 'text-indigo-600' : 'text-stone-500')} text-[11px]"></i>
                            <span>\${c.name}</span>
                        </span>
                        \${badgeHtml}
                    </div>
                    <div class="text-[9px] text-stone-400 truncate mb-2 font-serifMono">\${c.desc}</div>
                </div>
                <div>
                    <div class="flex items-center justify-between text-[10px] font-serifMono text-stone-500 mb-1">
                        <span>进度</span>
                        <span class="font-bold \${isAllDone ? 'text-emerald-700' : (catDone > 0 ? 'text-indigo-700' : 'text-stone-600')}">\${catDone} / \${catTotal}</span>
                    </div>
                    <div class="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300 \${barColor}" style="width: \${pct}%;"></div>
                    </div>
                </div>
            </div>
        \`;
    }).join('');

    // 分类筛选按钮
    const catButtonsHtml = categories.map(cat => {
        const catTotal = cat === '全部' ? activeSectionList.length : activeSectionList.filter(p => p.category === cat).length;
        const catDone = cat === '全部' ? activeSectionList.filter(p => !!completedMap[p.num]).length : activeSectionList.filter(p => p.category === cat && !!completedMap[p.num]).length;
        const isActive = cat === currentAlgoCategory;

        return \`
            <button onclick="setAlgoCategoryFilter('\${cat}')" class="px-3 py-1.5 rounded-xl text-xs font-serifMono font-bold transition whitespace-nowrap cursor-pointer \${isActive ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}">
                \${cat} <span class="text-[10px] opacity-75 font-normal">(\${catDone}/\${catTotal})</span>
            </button>
        \`;
    }).join('');

    // 题目卡片列表
    const cardsHtml = filtered.map(p => {
        const isDone = !!completedMap[p.num];
        const diffColor = p.difficulty === 'Easy'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : (p.difficulty === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200');

        return \`
            <div class="bg-white rounded-2xl p-5 border \${isDone ? 'border-emerald-300 bg-emerald-50/10' : 'border-stone-200'} academic-card flex flex-col justify-between hover:shadow-md transition">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-2 py-0.5 rounded-md bg-stone-900 text-white text-xs font-serifMono font-bold">
                                #\${p.num}
                            </span>
                            <span class="text-xs font-serifMono px-2 py-0.5 rounded border font-bold \${diffColor}">
                                \${escapeHtml(p.difficulty)}
                            </span>
                            <span class="text-xs font-serifMono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                                \${escapeHtml(p.category)}
                            </span>
                            <a href="\${p.leetcodeUrl || p.link || '#'}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded \${p.leetcodeUrl && p.leetcodeUrl.includes('kamacoder') ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'} text-xs font-serifMono font-bold flex items-center gap-1 transition shadow-2xs">
                                <span>\${p.leetcodeUrl && p.leetcodeUrl.includes('kamacoder') ? '卡码 ↗' : '力扣 ↗'}</span>
                            </a>
                        </div>
                        <label class="flex items-center gap-1.5 cursor-pointer font-serifMono text-xs select-none">
                            <input type="checkbox" onchange="toggleAlgoCompletedStatus(\${p.num})" \${isDone ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                            <span class="font-bold \${isDone ? 'text-emerald-700' : 'text-stone-400'}">
                                \${isDone ? '✓ 已完成' : '○ 未完成'}
                            </span>
                        </label>
                    </div>

                    <h4 class="text-sm font-bold text-stone-900 font-serifHeading mb-2">
                        <a href="\${p.leetcodeUrl}" target="_blank" class="hover:text-amber-800 transition">
                            \${escapeHtml(p.title)}
                        </a>
                    </h4>

                    <div class="text-xs text-stone-700 font-serifHeading mb-2.5 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <span class="font-bold text-stone-900 font-serifMono text-[11px] block mb-0.5">
                            <i class="fa-solid fa-lightbulb text-amber-600 mr-1"></i>核心套路：
                        </span>
                        \${escapeHtml(p.pattern || '经典题解模式')}
                    </div>

                    <div class="flex items-center gap-3 text-[11px] font-serifMono text-stone-500 mb-2.5 bg-stone-50/70 p-2 rounded-lg border border-stone-200/60">
                        <span><strong class="text-stone-700">时间:</strong> \${escapeHtml(p.timeComp || 'O(n)')}</span>
                        <span>•</span>
                        <span><strong class="text-stone-700">空间:</strong> \${escapeHtml(p.spaceComp || 'O(1)')}</span>
                        <span>•</span>
                        <span><strong>分类:</strong> \${escapeHtml(p.topic || p.category)}</span>
                    </div>

                    \${p.mistakes ? \`
                        <div class="p-2.5 bg-rose-50/60 rounded-xl border border-rose-200/80 text-xs text-rose-950 font-serifHeading mb-2">
                            <span class="font-bold font-serifMono text-[11px] text-rose-800 block mb-0.5">
                                <i class="fa-solid fa-triangle-exclamation mr-1"></i>易错点：
                            </span>
                            <p class="text-[11px] leading-relaxed text-stone-700">\${escapeHtml(p.mistakes)}</p>
                        </div>
                    \` : ''}

                    \${p.projectLink ? \`
                        <div class="p-2.5 bg-sky-50/60 rounded-xl border border-sky-200/80 text-xs text-sky-950 font-serifHeading">
                            <span class="font-bold font-serifMono text-[11px] text-sky-800 block mb-0.5">
                                <i class="fa-solid fa-code-branch mr-1"></i>项目映射：
                            </span>
                            <p class="text-[11px] leading-relaxed text-stone-700">\${escapeHtml(p.projectLink)}</p>
                        </div>
                    \` : ''}
                </div>
            </div>
        \`;
    }).join('');

    container.innerHTML = \`
        <!-- 顶部题库主卡片与两部分切换 -->
        <div class="bg-white rounded-2xl p-5 border border-stone-200 academic-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h3 class="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                    <i class="fa-solid fa-laptop-code text-indigo-700"></i> 算法题库
                </h3>
            </div>
            <!-- 两部分独立切换：Hot 100 与 代码随想录 -->
            <div class="flex items-center gap-2 font-serifMono text-xs flex-wrap">
                <button onclick="setAlgoSectionFilter('all')" class="px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5 \${currentAlgoSection === 'all' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'}">
                    <span>全部</span>
                    <span class="text-[11px] opacity-80">(\${totalCompleted}/\${totalCount})</span>
                </button>
                <button onclick="setAlgoSectionFilter('hot100')" class="px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5 \${currentAlgoSection === 'hot100' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'}">
                    <span>Hot 100</span>
                    <span class="text-[11px] opacity-80">(\${hot100Completed}/\${hot100Total})</span>
                </button>
                <button onclick="setAlgoSectionFilter('carl')" class="px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5 \${currentAlgoSection === 'carl' ? 'bg-amber-700 text-white shadow-xs' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'}">
                    <span>代码随想录</span>
                    <span class="text-[11px] opacity-80">(\${carlCompleted}/\${carlTotal})</span>
                </button>
            </div>
        </div>

        <!-- 算法分类全览图 -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 academic-card">
            <div class="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100 font-serifMono">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-cubes-stacked text-indigo-700"></i>
                    <span class="font-bold text-stone-900 text-xs sm:text-sm font-serifHeading">算法分类</span>
                </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3" id="algo-category-overview-grid">
                \${overviewCardsHtml}
            </div>
        </div>

        <!-- 分类与搜索过滤条 -->
        <div class="bg-white p-4 rounded-2xl border border-stone-200 academic-card space-y-3">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div class="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
                    \${catButtonsHtml}
                </div>
            </div>
            <div class="relative w-full">
                <input type="text" value="\${escapeHtml(algoSearchKeyword)}" oninput="handleAlgoSearch(this.value)" placeholder="搜索题号、题目名称或核心套路 (如: 146, LRU, 二分, 滑动窗口)..." class="w-full bg-stone-50 border border-stone-200 text-xs sm:text-sm rounded-xl px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-700 font-serifMono transition">
                <span class="absolute left-3 top-2.5 text-stone-400 text-xs"><i class="fa-solid fa-magnifying-glass"></i></span>
            </div>
        </div>

        <!-- 题目列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            \${cardsHtml || '<div class="col-span-2 text-center py-10 text-stone-400 font-serifMono text-xs">未找到符合条件的题目</div>'}
        </div>
    \`;
}

`;

content = content.slice(0, idxStart) + newRenderFn + content.slice(idxEnd);

// 3. 清理 renderLearningQATab 中的修饰
content = content.replace(/<div class="text-xs font-serifMono font-bold text-purple-700 uppercase tracking-wider mb-1">\s*Project-Derived Technical Interview\s*<\/div>\s*<h3 class="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">\s*<i class="fa-solid fa-circle-question text-purple-700"><\/i>\s*项目源码逆向八股自测中心 \(每日 30min\)\s*<\/h3>\s*<p class="text-xs text-stone-500 mt-0\.5">.*?<\/p>/s,
  `<h3 class="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                    <i class="fa-solid fa-circle-question text-purple-700"></i> 项目八股
                </h3>`);

// 4. 清理双核等修饰词
content = content.replace(/双核多线程 Reactor 架构/g, '多线程 Reactor 架构');
content = content.replace(/4-HOP REVERSE INTERVIEW CHAIN/g, 'INTERVIEW LINK');
content = content.replace(/题单 4-Hop 穿透/g, '面试考点关联');
content = content.replace(/4-Hop 链路:/g, '考点关联:');
content = content.replace(/双核系统 JSON 导入方式选择/g, 'JSON 导入方式选择');
content = content.replace(/双核数据合并成功/g, '数据合并成功');
content = content.replace(/双核数据已覆盖导入/g, '数据已覆盖导入');
content = content.replace(/一、双核工程综合实战全景/g, '一、工程实战全景');
content = content.replace(/四、双核工程避坑与踩坑实录/g, '四、工程避坑实录');
content = content.replace(/我的_双核工程学习档案/g, '我的_工程学习档案');
content = content.replace(/我的双核工程学习档案/g, '我的工程学习档案');

fs.writeFileSync(appPath, content, 'utf8');
console.log('✓ Successfully updated js/app.js');
