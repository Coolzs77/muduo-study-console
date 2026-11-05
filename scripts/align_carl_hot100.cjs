const fs = require('fs');
const path = require('path');

const carlHot100Chapters = [
  { chapter: '哈希', nums: [1, 49, 128] },
  { chapter: '双指针', nums: [283, 11, 15, 42] },
  { chapter: '滑动窗口', nums: [3, 438] },
  { chapter: '子串', nums: [560, 239, 76] },
  { chapter: '普通数组', nums: [53, 56, 189, 238, 41] },
  { chapter: '矩阵', nums: [73, 54, 48, 240] },
  { chapter: '链表', nums: [160, 206, 234, 141, 142, 21, 2, 19, 24, 25, 138, 148, 23, 146] },
  { chapter: '二叉树', nums: [94, 104, 226, 101, 543, 102, 108, 98, 230, 199, 114, 105, 437, 236, 124] },
  { chapter: '图论', nums: [200, 994, 207, 208] },
  { chapter: '回溯', nums: [46, 78, 17, 39, 22, 79, 131, 51] },
  { chapter: '二分查找', nums: [35, 74, 34, 33, 153, 4] },
  { chapter: '栈', nums: [20, 155, 394, 739, 84] },
  { chapter: '堆', nums: [215, 347, 295] },
  { chapter: '贪心算法', nums: [121, 55, 45, 763] },
  { chapter: '动态规划', nums: [70, 118, 198, 279, 322, 139, 300, 152, 416, 32] },
  { chapter: '多维动态规划', nums: [62, 64, 5, 1143, 72] },
  { chapter: '技巧', nums: [136, 169, 75, 31, 287] }
];

const hot100Map = new Map();
let orderCounter = 1;
carlHot100Chapters.forEach(({chapter, nums}) => {
  nums.forEach(num => {
    hot100Map.set(num, { chapter, order: orderCounter++ });
  });
});

const content = fs.readFileSync(path.join(__dirname, '../src/data/algoDataset.ts'), 'utf8');
const match = content.match(/export const ALGORITHM_LAB_CATALOG: AlgoProblem\[\] = (\[[\s\S]*?\]);\n/);
const catalog = JSON.parse(match[1]);

// 1. Separate Carl problems (179 items)
const carlProblems = catalog.filter(p => p.isCarl);
if (carlProblems.length !== 179) {
  console.error('Error: carlProblems length is', carlProblems.length, 'expected 179');
  process.exit(1);
}

// Reset Hot 100 flags on all Carl problems first
carlProblems.forEach(p => {
  p.isHot100 = false;
  delete p.hot100Chapter;
  delete p.hot100Order;
});

// For each problem in hot100Map, find matching Carl problems and mark exactly ONE (the best fit)
const assignedHot100NumsInCarl = new Set();
carlHot100Chapters.forEach(({chapter, nums}) => {
  nums.forEach(num => {
    // Find matching items in carlProblems
    const matches = carlProblems.filter(p => Number(p.num) === num);
    if (matches.length > 0) {
      // Find the best match: prefer one whose category/topic resembles the chapter
      let best = matches[0];
      const chapterMatch = matches.find(p => (p.category || '').includes(chapter) || (p.topic || '').includes(chapter));
      if (chapterMatch) best = chapterMatch;

      const info = hot100Map.get(num);
      best.isHot100 = true;
      best.hot100Chapter = info.chapter;
      best.hot100Order = info.order;
      assignedHot100NumsInCarl.add(num);
    }
  });
});

console.log('Assigned Hot 100 in Carl:', assignedHot100NumsInCarl.size);

// 2. Identify Hot 100 problems that are NOT in Carl
const nonCarlHot100Nums = Array.from(hot100Map.keys()).filter(n => !assignedHot100NumsInCarl.has(n));
console.log('Non-Carl Hot 100 problems count:', nonCarlHot100Nums.length);

// Existing non-Carl problems in catalog
const nonCarlExisting = catalog.filter(p => !p.isCarl);
const nonCarlExistingMap = new Map();
nonCarlExisting.forEach(p => {
  if (p.num !== null && p.num !== undefined) nonCarlExistingMap.set(Number(p.num), p);
});

// Definitions for the 3 missing Hot 100 problems
const missingDefinitions = {
  25: {
    id: 'algo_hot_25',
    num: 25,
    title: '25. K 个一组翻转链表',
    difficulty: 'Hard',
    category: '链表',
    topic: '链表',
    leetcodeUrl: 'https://leetcode.cn/problems/reverse-nodes-in-k-group/',
    pattern: '链表遍历 / 局部反转',
    timeComp: 'O(n)',
    spaceComp: 'O(1)',
    mistakes: '注意处理不足 k 个节点的分支，以及翻转后的前驱和后继指针连接。',
    projectLink: '对应高性能网络库中分块报文聚合重排与链表缓冲区反向重构。',
    isCarl: false,
    isHot100: true,
  },
  35: {
    id: 'algo_hot_35',
    num: 35,
    title: '35. 搜索插入位置',
    difficulty: 'Easy',
    category: '数组',
    topic: '二分查找',
    leetcodeUrl: 'https://leetcode.cn/problems/search-insert-position/',
    pattern: '二分查找',
    timeComp: 'O(log n)',
    spaceComp: 'O(1)',
    mistakes: '注意开闭区间的一致性（[left, right] 或 [left, right)）与循环终止时返回值处理。',
    projectLink: '对应高并发连接池与有序事件轮中快速插入定位。',
    isCarl: false,
    isHot100: true,
  },
  118: {
    id: 'algo_hot_118',
    num: 118,
    title: '118. 杨辉三角',
    difficulty: 'Easy',
    category: '动态规划',
    topic: '动态规划',
    leetcodeUrl: 'https://leetcode.cn/problems/pascals-triangle/',
    pattern: '二维递推',
    timeComp: 'O(n^2)',
    spaceComp: 'O(1)',
    mistakes: '注意每行首尾为 1，内部元素由上一行相邻两数相加得出。',
    projectLink: '对应多级队列层级权重分配与状态组合递推。',
    isCarl: false,
    isHot100: true,
  }
};

const newNonCarlProblems = nonCarlHot100Nums.map(num => {
  let prob;
  if (nonCarlExistingMap.has(num)) {
    prob = nonCarlExistingMap.get(num);
  } else if (missingDefinitions[num]) {
    prob = missingDefinitions[num];
  } else {
    throw new Error('Problem definition missing for Hot 100 problem #' + num);
  }
  const info = hot100Map.get(num);
  prob.isCarl = false;
  prob.isHot100 = true;
  prob.hot100Chapter = info.chapter;
  prob.hot100Order = info.order;
  return prob;
});

// Final unified catalog
const finalCatalog = [...carlProblems, ...newNonCarlProblems];

console.log('Total problems in final catalog:', finalCatalog.length);
console.log('Carl problems in final catalog:', finalCatalog.filter(p => p.isCarl).length);
console.log('Hot 100 problems in final catalog:', finalCatalog.filter(p => p.isHot100).length);
console.log('Overlap problems in final catalog:', finalCatalog.filter(p => p.isCarl && p.isHot100).length);

// Verify all 17 chapters are populated
const chapterCounts = {};
carlHot100Chapters.forEach(c => { chapterCounts[c.chapter] = 0; });
finalCatalog.filter(p => p.isHot100).forEach(p => {
  chapterCounts[p.hot100Chapter] = (chapterCounts[p.hot100Chapter] || 0) + 1;
});
console.log('Chapter counts in Hot 100:', chapterCounts);

// Write to src/data/algoDataset.ts
const tsOutput = `import { AlgoProblem } from "../types/index";\n\nexport const ALGORITHM_LAB_CATALOG: AlgoProblem[] = ${JSON.stringify(finalCatalog, null, 2)};\n\nif (typeof window !== 'undefined') {\n  (window as any).ALGORITHM_LAB_CATALOG = ALGORITHM_LAB_CATALOG;\n}\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/algoDataset.ts'), tsOutput, 'utf8');
console.log('✓ Successfully wrote updated src/data/algoDataset.ts');
