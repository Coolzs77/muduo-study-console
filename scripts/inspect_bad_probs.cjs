const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
const p = JSON.parse(content.substring(content.indexOf('= [') + 2, content.lastIndexOf('];') + 1));

const badTitles = [
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

for (const t of badTitles) {
  // Find all occurrences
  const matches = p.filter(item => item.title.includes(t));
  console.log(`=== Matches for ${t} (${matches.length}) ===`);
  matches.forEach(m => {
    console.log({
      id: m.id,
      num: m.num,
      title: m.title,
      category: m.category,
      topic: m.topic,
      isHot100: m.isHot100,
      hot100Chapter: m.hot100Chapter,
      pattern: m.pattern
    });
  });
}
