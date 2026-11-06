const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
const p = JSON.parse(content.substring(content.indexOf('= [') + 2, content.lastIndexOf('];') + 1));

const h3s = ["704. 二分查找","27. 移除元素","977. 有序数组的平方","209. 长度最小的子数组","58. 区间和","44. 开发商购买土地","59. 螺旋矩阵II","206. 翻转链表","19. 删除链表的倒数第N个节点","02.07. 链表相交","142. 环形链表II","15. 三数之和","18. 四数之和","344. 反转字符串","54. 替换数字","151. 翻转字符串里的单词","55. 右旋字符串","102. 二叉树的层序遍历","101. 对称二叉树","104. 二叉树的最大深度","110. 平衡二叉树","106. 从中序与后序遍历序列构造二叉树","98. 验证二叉搜索树","108. 将有序数组转换为二叉搜索树","77. 组合","47. 全排列II","53. 最大子序和","122. 买卖股票的最佳时机II","406.根据身高重建队列（续集）","70. 爬楼梯","96. 不同的二叉搜索树","53. 最大子序和","99. 岛屿的数量深搜","53. 寻宝-prim","47. 参会dijkstra朴素","94. 城市间货物运输I","189. 轮转数组","238. 除自身以外数组的乘积","73. 矩阵置零","48. 旋转图像","240. 搜索二维矩阵 II","35. 搜索插入位置","74. 搜索二维矩阵","34. 在排序数组中查找元素的第一个和最后一个位置","33. 搜索旋转排序数组","153. 寻找旋转排序数组中的最小值","4. 寻找两个正序数组的中位数","31. 下一个排列","287. 寻找重复数"];

// How many of these 49 are in Carl?
// How many are in Hot100?
// How many are in BOTH?
let bothCount = 0;
let carlCount = 0;
let hotCount = 0;

h3s.forEach(t => {
  const item = p.find(x => x.title === t);
  if (item) {
    if (item.isCarl) carlCount++;
    if (item.isHot100) hotCount++;
    if (item.isCarl && item.isHot100) bothCount++;
  }
});

console.log('carlCount:', carlCount);
console.log('hotCount:', hotCount);
console.log('bothCount:', bothCount);
console.log('Total items in dataset with isCarl && isHot100:', p.filter(x => x.isCarl && x.isHot100).length);
console.log('Total items in dataset with isHot100:', p.filter(x => x.isHot100).length);
console.log('Total items in dataset with isCarl:', p.filter(x => x.isCarl).length);
