const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
const p = JSON.parse(content.substring(content.indexOf('= [') + 2, content.lastIndexOf('];') + 1));

const h3s = ["704. 二分查找","27. 移除元素","977. 有序数组的平方","209. 长度最小的子数组","58. 区间和","44. 开发商购买土地","59. 螺旋矩阵II","206. 翻转链表","19. 删除链表的倒数第N个节点","02.07. 链表相交","142. 环形链表II","15. 三数之和","18. 四数之和","344. 反转字符串","54. 替换数字","151. 翻转字符串里的单词","55. 右旋字符串","102. 二叉树的层序遍历","101. 对称二叉树","104. 二叉树的最大深度","110. 平衡二叉树","106. 从中序与后序遍历序列构造二叉树","98. 验证二叉搜索树","108. 将有序数组转换为二叉搜索树","77. 组合","47. 全排列II","53. 最大子序和","122. 买卖股票的最佳时机II","406.根据身高重建队列（续集）","70. 爬楼梯","96. 不同的二叉搜索树","53. 最大子序和","99. 岛屿的数量深搜","53. 寻宝-prim","47. 参会dijkstra朴素","94. 城市间货物运输I","189. 轮转数组","238. 除自身以外数组的乘积","73. 矩阵置零","48. 旋转图像","240. 搜索二维矩阵 II","35. 搜索插入位置","74. 搜索二维矩阵","34. 在排序数组中查找元素的第一个和最后一个位置","33. 搜索旋转排序数组","153. 寻找旋转排序数组中的最小值","4. 寻找两个正序数组的中位数","31. 下一个排列","287. 寻找重复数"];

console.log('Total h3s:', h3s.length);

const matchedObjs = [];
for (let i = 0; i < h3s.length; i++) {
  const t = h3s[i];
  const obj = p.find(item => item.title === t);
  if (obj) matchedObjs.push(obj);
}
console.log('Matched objects count:', matchedObjs.length);

// What are their categories?
const cats = {};
matchedObjs.forEach(o => {
  cats[o.category] = (cats[o.category] || 0) + 1;
});
console.log('Categories of the 49 objects:', cats);

// Wait! In the compiled bundle, what was the filter condition?
// Let's check `dist/assets/index-IcwMY4T-.js` again!
