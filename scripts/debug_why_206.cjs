const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
const startIdx = content.indexOf('= [') + 2;
const endIdx = content.lastIndexOf('];') + 1;
const problems = JSON.parse(content.substring(startIdx, endIdx));

const problemTitles = [
  "206. 翻转链表",
  "19. 删除链表的倒数第N个节点",
  "02.07. 链表相交",
  "142. 环形链表II",
  "15. 三数之和",
  "18. 四数之和",
  "344. 反转字符串",
  "54. 替换数字",
  "151. 翻转字符串里的单词",
  "55. 右旋字符串",
  "102. 二叉树的层序遍历"
];

for (const t of problemTitles) {
  const found = problems.find(p => p.title.includes(t));
  if (found) {
    console.log(t, '-> category:', found.category, 'topic:', found.topic, 'isHot100:', found.isHot100, 'hot100Chapter:', found.hot100Chapter);
  }
}
