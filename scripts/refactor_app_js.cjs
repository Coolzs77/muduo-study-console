const fs = require('fs');
const path = require('path');

const appPath = path.join('e:/workspace/muduo-study-console/js/app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

// 1. Clean Algorithm Lab Header in app.js
const algoHeaderRegex = /<div>\s*<div class="text-xs font-serifMono font-bold text-indigo-700 uppercase tracking-wider mb-1">\s*LeetCode Hand-Coding Laboratory[\s\S]*?<\/div>\s*<h3 class="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">\s*<i class="fa-solid fa-laptop-code text-indigo-700"><\/i>\s*手撕算法 Lab[\s\S]*?<\/h3>\s*<p class="text-xs text-stone-500 mt-0\.5">[\s\S]*?<\/p>\s*<\/div>/;

if (algoHeaderRegex.test(appJs)) {
  const algoHeaderReplacement = `<div>
                <h3 class="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                    <i class="fa-solid fa-laptop-code text-indigo-700"></i> 算法题库
                </h3>
            </div>`;
  appJs = appJs.replace(algoHeaderRegex, algoHeaderReplacement);
  console.log('Algorithm header in app.js cleaned!');
} else {
  console.warn('algoHeaderRegex did not match!');
}

// 2. Clean category overview bar in app.js
appJs = appJs.replace(/代码随想录 12 大算法体系全览图/g, '算法分类');
appJs = appJs.replace(/<span class="text-\[10px\] text-stone-400 font-normal">（点击分类卡片可下钻筛选，勾选完成题目即时动态更新）<\/span>/g, '');
appJs = appJs.replace(/全部 179 题/g, '全部');

// 3. Clean hype terms in exports and modals
appJs = appJs.replace(/双核多线程 Reactor 架构/g, '多线程 Reactor 架构');
appJs = appJs.replace(/4-HOP REVERSE INTERVIEW CHAIN/g, 'INTERVIEW LINK');
appJs = appJs.replace(/题单 4-Hop 穿透/g, '面试考点关联');
appJs = appJs.replace(/4-Hop 链路:/g, '考点关联:');
appJs = appJs.replace(/双核系统 JSON 导入方式选择/g, 'JSON 导入方式选择');
appJs = appJs.replace(/双核数据合并成功/g, '数据合并成功');
appJs = appJs.replace(/双核数据已覆盖导入/g, '数据已覆盖导入');
appJs = appJs.replace(/一、双核工程综合实战全景/g, '一、工程实战全景');
appJs = appJs.replace(/四、双核工程避坑与踩坑实录/g, '四、工程避坑实录');
appJs = appJs.replace(/我的_双核工程学习档案/g, '我的_工程学习档案');
appJs = appJs.replace(/我的双核工程学习档案/g, '我的工程学习档案');

fs.writeFileSync(appPath, appJs, 'utf8');
console.log('app.js cleanup completed!');
