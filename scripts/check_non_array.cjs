const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
const p = JSON.parse(content.substring(content.indexOf('= [') + 2, content.lastIndexOf('];') + 1));

const nonArrayH3s = ["206. 翻转链表","19. 删除链表的倒数第N个节点","02.07. 链表相交","142. 环形链表II","15. 三数之和","18. 四数之和","344. 反转字符串","54. 替换数字","151. 翻转字符串里的单词","55. 右旋字符串","102. 二叉树的层序遍历","101. 对称二叉树","104. 二叉树的最大深度","110. 平衡二叉树","106. 从中序与后序遍历序列构造二叉树","98. 验证二叉搜索树","108. 将有序数组转换为二叉搜索树","77. 组合","47. 全排列II","53. 最大子序和","122. 买卖股票的最佳时机II","406.根据身高重建队列（续集）","70. 爬楼梯","96. 不同的二叉搜索树","53. 最大子序和","99. 岛屿的数量深搜","53. 寻宝-prim","47. 参会dijkstra朴素","94. 城市间货物运输I"];

nonArrayH3s.forEach(t => {
  const idx = p.findIndex(item => item.title === t);
  const item = p[idx];
  console.log(`[${idx}] ${t} -> cat: "${item.category}", topic: "${item.topic}", pattern: "${item.pattern}"`);
});
