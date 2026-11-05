const fs = require('fs');
const path = require('path');

// 1. 定义 LeetCode Hot 100 完整官方 100 题
const HOT_100_PROBLEMS = [
  { num: 1, title: "1. 两数之和", difficulty: "Easy", category: "哈希表", leetcodeUrl: "https://leetcode.cn/problems/two-sum/", pattern: "哈希表查找", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 2, title: "2. 两数相加", difficulty: "Medium", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/add-two-numbers/", pattern: "链表模拟", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 3, title: "3. 无重复字符的最长子串", difficulty: "Medium", category: "双指针法", leetcodeUrl: "https://leetcode.cn/problems/longest-substring-without-repeating-characters/", pattern: "滑动窗口", timeComp: "O(n)", spaceComp: "O(min(m,n))" },
  { num: 4, title: "4. 寻找两个正序数组的中位数", difficulty: "Hard", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/median-of-two-sorted-arrays/", pattern: "二分查找", timeComp: "O(log(min(m,n)))", spaceComp: "O(1)" },
  { num: 5, title: "5. 最长回文子串", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/longest-palindromic-substring/", pattern: "中心扩展/动态规划", timeComp: "O(n^2)", spaceComp: "O(n^2)" },
  { num: 10, title: "10. 正则表达式匹配", difficulty: "Hard", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/regular-expression-matching/", pattern: "动态规划", timeComp: "O(mn)", spaceComp: "O(mn)" },
  { num: 11, title: "11. 盛最多水的容器", difficulty: "Medium", category: "双指针法", leetcodeUrl: "https://leetcode.cn/problems/container-with-most-water/", pattern: "对撞双指针", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 15, title: "15. 三数之和", difficulty: "Medium", category: "双指针法", leetcodeUrl: "https://leetcode.cn/problems/3sum/", pattern: "排序+双指针", timeComp: "O(n^2)", spaceComp: "O(1)" },
  { num: 17, title: "17. 电话号码的字母组合", difficulty: "Medium", category: "回溯算法", leetcodeUrl: "https://leetcode.cn/problems/letter-combinations-of-a-phone-number/", pattern: "回溯搜索", timeComp: "O(3^m * 4^n)", spaceComp: "O(m+n)" },
  { num: 19, title: "19. 删除链表的倒数第 N 个结点", difficulty: "Medium", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/remove-nth-node-from-end-of-list/", pattern: "快慢双指针", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 20, title: "20. 有效的括号", difficulty: "Easy", category: "栈与队列", leetcodeUrl: "https://leetcode.cn/problems/valid-parentheses/", pattern: "栈匹配", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 21, title: "21. 合并两个有序链表", difficulty: "Easy", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/merge-two-sorted-lists/", pattern: "双指针归并", timeComp: "O(n+m)", spaceComp: "O(1)" },
  { num: 22, title: "22. 括号生成", difficulty: "Medium", category: "回溯算法", leetcodeUrl: "https://leetcode.cn/problems/generate-parentheses/", pattern: "剪枝回溯", timeComp: "O(4^n / sqrt(n))", spaceComp: "O(n)" },
  { num: 23, title: "23. 合并 K 个升序链表", difficulty: "Hard", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/merge-k-sorted-lists/", pattern: "优先队列/分治", timeComp: "O(N log k)", spaceComp: "O(k)" },
  { num: 31, title: "31. 下一个排列", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/next-permutation/", pattern: "数组遍历与交换", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 32, title: "32. 最长有效括号", difficulty: "Hard", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/longest-valid-parentheses/", pattern: "动态规划/栈", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 33, title: "33. 搜索旋转排序数组", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/search-in-rotated-sorted-array/", pattern: "分类二分查找", timeComp: "O(log n)", spaceComp: "O(1)" },
  { num: 34, title: "34. 在排序数组中查找元素的第一个和最后一个位置", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/", pattern: "两次二分查找", timeComp: "O(log n)", spaceComp: "O(1)" },
  { num: 39, title: "39. 组合总和", difficulty: "Medium", category: "回溯算法", leetcodeUrl: "https://leetcode.cn/problems/combination-sum/", pattern: "回溯搜索", timeComp: "O(S)", spaceComp: "O(target)" },
  { num: 41, title: "41. 缺失的第一个正数", difficulty: "Hard", category: "哈希表", leetcodeUrl: "https://leetcode.cn/problems/first-missing-positive/", pattern: "原地哈希", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 42, title: "42. 接雨水", difficulty: "Hard", category: "单调栈", leetcodeUrl: "https://leetcode.cn/problems/trapping-rain-water/", pattern: "单调栈/双指针", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 46, title: "46. 全排列", difficulty: "Medium", category: "回溯算法", leetcodeUrl: "https://leetcode.cn/problems/permutations/", pattern: "回溯搜索", timeComp: "O(n! * n)", spaceComp: "O(n)" },
  { num: 48, title: "48. 旋转图像", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/rotate-image/", pattern: "矩阵对称翻转", timeComp: "O(n^2)", spaceComp: "O(1)" },
  { num: 49, title: "49. 字母异位词分组", difficulty: "Medium", category: "哈希表", leetcodeUrl: "https://leetcode.cn/problems/group-anagrams/", pattern: "哈希表计数", timeComp: "O(n * k log k)", spaceComp: "O(nk)" },
  { num: 53, title: "53. 最大子数组和", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/maximum-subarray/", pattern: "动态规划/贪心", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 54, title: "54. 螺旋矩阵", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/spiral-matrix/", pattern: "模拟边界收缩", timeComp: "O(mn)", spaceComp: "O(1)" },
  { num: 55, title: "55. 跳跃游戏", difficulty: "Medium", category: "贪心算法", leetcodeUrl: "https://leetcode.cn/problems/jump-game/", pattern: "贪心覆盖范围", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 56, title: "56. 合并区间", difficulty: "Medium", category: "贪心算法", leetcodeUrl: "https://leetcode.cn/problems/merge-intervals/", pattern: "排序+贪心合并", timeComp: "O(n log n)", spaceComp: "O(n)" },
  { num: 62, title: "62. 不同路径", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/unique-paths/", pattern: "二维网格动态规划", timeComp: "O(mn)", spaceComp: "O(n)" },
  { num: 64, title: "64. 最小路径和", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/minimum-path-sum/", pattern: "网格动态规划", timeComp: "O(mn)", spaceComp: "O(n)" },
  { num: 70, title: "70. 爬楼梯", difficulty: "Easy", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/climbing-stairs/", pattern: "斐波那契状态转移", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 72, title: "72. 编辑距离", difficulty: "Hard", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/edit-distance/", pattern: "双串动态规划", timeComp: "O(mn)", spaceComp: "O(mn)" },
  { num: 73, title: "73. 矩阵置零", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/set-matrix-zeroes/", pattern: "原地标记", timeComp: "O(mn)", spaceComp: "O(1)" },
  { num: 74, title: "74. 搜索二维矩阵", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/search-a-2d-matrix/", pattern: "二维展开二分查找", timeComp: "O(log(mn))", spaceComp: "O(1)" },
  { num: 75, title: "75. 颜色分类", difficulty: "Medium", category: "双指针法", leetcodeUrl: "https://leetcode.cn/problems/sort-colors/", pattern: "三指针荷兰国旗", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 76, title: "76. 最小覆盖子串", difficulty: "Hard", category: "双指针法", leetcodeUrl: "https://leetcode.cn/problems/minimum-window-substring/", pattern: "滑动窗口+哈希计数", timeComp: "O(n)", spaceComp: "O(C)" },
  { num: 78, title: "78. 子集", difficulty: "Medium", category: "回溯算法", leetcodeUrl: "https://leetcode.cn/problems/subsets/", pattern: "回溯枚举子集", timeComp: "O(2^n * n)", spaceComp: "O(n)" },
  { num: 79, title: "79. 单词搜索", difficulty: "Medium", category: "回溯算法", leetcodeUrl: "https://leetcode.cn/problems/word-search/", pattern: "网格深度优先回溯", timeComp: "O(mn * 3^L)", spaceComp: "O(L)" },
  { num: 84, title: "84. 柱状图中最大的矩形", difficulty: "Hard", category: "单调栈", leetcodeUrl: "https://leetcode.cn/problems/largest-rectangle-in-histogram/", pattern: "单调栈", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 94, title: "94. 二叉树的中序遍历", difficulty: "Easy", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/binary-tree-inorder-traversal/", pattern: "递归/迭代中序遍历", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 96, title: "96. 不同的二叉搜索树", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/unique-binary-search-trees/", pattern: "卡特兰数动态规划", timeComp: "O(n^2)", spaceComp: "O(n)" },
  { num: 98, title: "98. 验证二叉搜索树", difficulty: "Medium", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/validate-binary-search-tree/", pattern: "中序遍历递增判定", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 101, title: "101. 对称二叉树", difficulty: "Easy", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/symmetric-tree/", pattern: "双指针递归判定", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 102, title: "102. 二叉树的层序遍历", difficulty: "Medium", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/binary-tree-level-order-traversal/", pattern: "广度优先遍历队列", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 104, title: "104. 二叉树的最大深度", difficulty: "Easy", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/maximum-depth-of-binary-tree/", pattern: "后序递归求高", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 105, title: "105. 从前序与中序遍历序列构造二叉树", difficulty: "Medium", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", pattern: "分治递归构造", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 108, title: "108. 将有序数组转换为二叉搜索树", difficulty: "Easy", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/", pattern: "中序递归建平衡树", timeComp: "O(n)", spaceComp: "O(log n)" },
  { num: 114, title: "114. 二叉树展开为链表", difficulty: "Medium", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/", pattern: "后序递归原地修改", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 121, title: "121. 买卖股票的最佳时机", difficulty: "Easy", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/", pattern: "前缀最小值贪心/DP", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 124, title: "124. 二叉树中的最大路径和", difficulty: "Hard", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/binary-tree-maximum-path-sum/", pattern: "后序遍历贡献计算", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 128, title: "128. 最长连续序列", difficulty: "Medium", category: "哈希表", leetcodeUrl: "https://leetcode.cn/problems/longest-consecutive-sequence/", pattern: "哈希集合边界跳跃", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 131, title: "131. 分割回文串", difficulty: "Medium", category: "回溯算法", leetcodeUrl: "https://leetcode.cn/problems/palindrome-partitioning/", pattern: "回溯搜索+回文判定", timeComp: "O(n * 2^n)", spaceComp: "O(n)" },
  { num: 136, title: "136. 只出现一次的数字", difficulty: "Easy", category: "哈希表", leetcodeUrl: "https://leetcode.cn/problems/single-number/", pattern: "异或运算消除重复", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 138, title: "138. 随机链表的复制", difficulty: "Medium", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/copy-list-with-random-pointer/", pattern: "哈希表或原地拆分复制", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 139, title: "139. 单词拆分", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/word-break/", pattern: "完全背包排列问题", timeComp: "O(n^2)", spaceComp: "O(n)" },
  { num: 141, title: "141. 环形链表", difficulty: "Easy", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/linked-list-cycle/", pattern: "快慢双指针判定", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 142, title: "142. 环形链表 II", difficulty: "Medium", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/linked-list-cycle-ii/", pattern: "快慢指针数学推导", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 146, title: "146. LRU 缓存", difficulty: "Medium", category: "哈希表", leetcodeUrl: "https://leetcode.cn/problems/lru-cache/", pattern: "哈希表+双向链表", timeComp: "O(1)", spaceComp: "O(capacity)" },
  { num: 148, title: "148. 排序链表", difficulty: "Medium", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/sort-list/", pattern: "自顶向下/自底向上归并", timeComp: "O(n log n)", spaceComp: "O(1)" },
  { num: 152, title: "152. 乘积最大子数组", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/maximum-product-subarray/", pattern: "正负极值双状态DP", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 153, title: "153. 寻找旋转排序数组中的最小值", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/", pattern: "二分查找极值点", timeComp: "O(log n)", spaceComp: "O(1)" },
  { num: 155, title: "155. 最小栈", difficulty: "Medium", category: "栈与队列", leetcodeUrl: "https://leetcode.cn/problems/min-stack/", pattern: "辅助双栈同步", timeComp: "O(1)", spaceComp: "O(n)" },
  { num: 160, title: "160. 相交链表", difficulty: "Easy", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/intersection-of-two-linked-lists/", pattern: "双指针走过彼此的路", timeComp: "O(m+n)", spaceComp: "O(1)" },
  { num: 169, title: "169. 多数元素", difficulty: "Easy", category: "哈希表", leetcodeUrl: "https://leetcode.cn/problems/majority-element/", pattern: "摩尔投票计数", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 189, title: "189. 轮转数组", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/rotate-array/", pattern: "三次翻转数组", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 198, title: "198. 打家劫舍", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/house-robber/", pattern: "线性递推动态规划", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 199, title: "199. 二叉树的右视图", difficulty: "Medium", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/binary-tree-right-side-view/", pattern: "广度优先层序遍历", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 200, title: "200. 岛屿数量", difficulty: "Medium", category: "图论", leetcodeUrl: "https://leetcode.cn/problems/number-of-islands/", pattern: "网格深度优先沉没", timeComp: "O(mn)", spaceComp: "O(mn)" },
  { num: 206, title: "206. 反转链表", difficulty: "Easy", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/reverse-linked-list/", pattern: "双指针原地翻转", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 207, title: "207. 课程表", difficulty: "Medium", category: "图论", leetcodeUrl: "https://leetcode.cn/problems/course-schedule/", pattern: "拓扑排序检测有向环", timeComp: "O(V+E)", spaceComp: "O(V+E)" },
  { num: 208, title: "208. 实现 Trie", difficulty: "Medium", category: "字符串", leetcodeUrl: "https://leetcode.cn/problems/implement-trie-prefix-tree/", pattern: "前缀树多叉节点", timeComp: "O(L)", spaceComp: "O(Sigma * L)" },
  { num: 215, title: "215. 数组中的第K个最大元素", difficulty: "Medium", category: "栈与队列", leetcodeUrl: "https://leetcode.cn/problems/kth-largest-element-in-an-array/", pattern: "快速选择/小顶堆", timeComp: "O(n)", spaceComp: "O(log n)" },
  { num: 221, title: "221. 最大正方形", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/maximal-square/", pattern: "二维动态规划", timeComp: "O(mn)", spaceComp: "O(mn)" },
  { num: 226, title: "226. 翻转二叉树", difficulty: "Easy", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/invert-binary-tree/", pattern: "前序/后序递归遍历", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 230, title: "230. 二叉搜索树中第 K 小的元素", difficulty: "Medium", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/kth-smallest-element-in-a-bst/", pattern: "中序遍历提前退出", timeComp: "O(H + k)", spaceComp: "O(H)" },
  { num: 234, title: "234. 回文链表", difficulty: "Easy", category: "链表", leetcodeUrl: "https://leetcode.cn/problems/palindrome-linked-list/", pattern: "快慢指针切半翻转", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 236, title: "236. 二叉树的最近公共祖先", difficulty: "Medium", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/", pattern: "后序递归自底向上回溯", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 238, title: "238. 除自身以外数组的乘积", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/product-of-array-except-self/", pattern: "前缀积乘以后缀积", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 239, title: "239. 滑动窗口最大值", difficulty: "Hard", category: "栈与队列", leetcodeUrl: "https://leetcode.cn/problems/sliding-window-maximum/", pattern: "单调双端队列", timeComp: "O(n)", spaceComp: "O(k)" },
  { num: 240, title: "240. 搜索二维矩阵 II", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/search-a-2d-matrix-ii/", pattern: "右上角对撞二分搜索", timeComp: "O(m+n)", spaceComp: "O(1)" },
  { num: 279, title: "279. 完全平方数", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/perfect-squares/", pattern: "完全背包最少数量", timeComp: "O(n * sqrt(n))", spaceComp: "O(n)" },
  { num: 283, title: "283. 移动零", difficulty: "Easy", category: "双指针法", leetcodeUrl: "https://leetcode.cn/problems/move-zeroes/", pattern: "快慢指针原地覆盖", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 287, title: "287. 寻找重复数", difficulty: "Medium", category: "数组", leetcodeUrl: "https://leetcode.cn/problems/find-the-duplicate-number/", pattern: "数组下标快慢指针找环", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 295, title: "295. 数据流的中位数", difficulty: "Hard", category: "栈与队列", leetcodeUrl: "https://leetcode.cn/problems/find-median-from-data-stream/", pattern: "大顶堆+小顶堆平衡", timeComp: "O(log n)", spaceComp: "O(n)" },
  { num: 300, title: "300. 最长递增子序列", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/longest-increasing-subsequence/", pattern: "动态规划/贪心二分", timeComp: "O(n log n)", spaceComp: "O(n)" },
  { num: 309, title: "309. 买卖股票的最佳时机含冷冻期", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/", pattern: "多状态机动态规划", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 322, title: "322. 零钱兑换", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/coin-change/", pattern: "完全背包最少硬币数", timeComp: "O(amount * n)", spaceComp: "O(amount)" },
  { num: 337, title: "337. 打家劫舍 III", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/house-robber-iii/", pattern: "后序遍历树形动态规划", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 347, title: "347. 前 K 个高频元素", difficulty: "Medium", category: "栈与队列", leetcodeUrl: "https://leetcode.cn/problems/top-k-frequent-elements/", pattern: "哈希表统计+小顶堆", timeComp: "O(n log k)", spaceComp: "O(n)" },
  { num: 394, title: "394. 字符串解码", difficulty: "Medium", category: "栈与队列", leetcodeUrl: "https://leetcode.cn/problems/decode-string/", pattern: "双栈模拟辅助解嵌套", timeComp: "O(S)", spaceComp: "O(S)" },
  { num: 416, title: "416. 分割等和子集", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/partition-equal-subset-sum/", pattern: "0-1 背包求子集和", timeComp: "O(n * target)", spaceComp: "O(target)" },
  { num: 437, title: "437. 路径总和 III", difficulty: "Medium", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/path-sum-iii/", pattern: "二叉树前缀和哈希", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 438, title: "438. 找到字符串中所有字母异位词", difficulty: "Medium", category: "双指针法", leetcodeUrl: "https://leetcode.cn/problems/find-all-anagrams-in-a-string/", pattern: "定长滑动窗口", timeComp: "O(n)", spaceComp: "O(1)" },
  { num: 494, title: "494. 目标和", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/target-sum/", pattern: "0-1 背包组合问题", timeComp: "O(n * bagSize)", spaceComp: "O(bagSize)" },
  { num: 543, title: "543. 二叉树的直径", difficulty: "Easy", category: "二叉树", leetcodeUrl: "https://leetcode.cn/problems/diameter-of-binary-tree/", pattern: "后序遍历求最大路径跨度", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 560, title: "560. 和为 K 的子数组", difficulty: "Medium", category: "哈希表", leetcodeUrl: "https://leetcode.cn/problems/subarray-sum-equals-k/", pattern: "前缀和+哈希表计数", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 647, title: "647. 回文子串", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/palindromic-substrings/", pattern: "双指针中心扩展/DP", timeComp: "O(n^2)", spaceComp: "O(1)" },
  { num: 739, title: "739. 每日温度", difficulty: "Medium", category: "单调栈", leetcodeUrl: "https://leetcode.cn/problems/daily-temperatures/", pattern: "单调递减栈", timeComp: "O(n)", spaceComp: "O(n)" },
  { num: 994, title: "994. 腐烂的橘子", difficulty: "Medium", category: "图论", leetcodeUrl: "https://leetcode.cn/problems/rotting-oranges/", pattern: "多源广度优先搜索", timeComp: "O(mn)", spaceComp: "O(mn)" },
  { num: 1143, title: "1143. 最长公共子序列", difficulty: "Medium", category: "动态规划", leetcodeUrl: "https://leetcode.cn/problems/longest-common-subsequence/", pattern: "二维双序列动态规划", timeComp: "O(mn)", spaceComp: "O(mn)" }
];

// 2. 从原始提交提取原汁原味的 179 道代码随想录题目
const { execSync } = require('child_process');
const filePath = path.join(__dirname, '..', 'js', 'dataset-learning.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

const originalRaw = execSync('git show f9e7fe7ecf35c2b8b10768beae70624ee94abf1c:js/dataset-learning.js', { maxBuffer: 10 * 1024 * 1024 }).toString();
const originalMatch = originalRaw.match(/var ALGORITHM_LAB_CATALOG = (\[[\s\S]*?\]);/);
if (!originalMatch) {
  console.error('Cannot locate original ALGORITHM_LAB_CATALOG in git commit f9e7fe7ecf35c2b8b10768beae70624ee94abf1c');
  process.exit(1);
}

const originalCarl = JSON.parse(originalMatch[1]);
console.log('Original Carl catalog loaded. Total items:', originalCarl.length); // 179

// 构建 Hot 100 查找 Map
const hot100Map = new Map();
HOT_100_PROBLEMS.forEach(h => hot100Map.set(h.num, h));

// 1. 处理所有 179 道代码随想录题目（一道不少，100% 保留）
const markedHotNums = new Set();
const fullCatalog = originalCarl.map(p => {
  let isHot = false;
  if (p.num !== null && p.num !== undefined && hot100Map.has(p.num)) {
    // 若在 Hot 100 中，且尚未为 Hot 100 标记该题，则标记为 true（确保 Hot 100 视图中每道题仅出现 1 次）
    if (!markedHotNums.has(p.num)) {
      isHot = true;
      markedHotNums.add(p.num);
    }
  }
  return {
    ...p,
    isCarl: true,
    isHot100: isHot
  };
});

// 2. 将 Hot 100 中不在代码随想录中的题目（54 道）追加进来
let hot100OnlyCount = 0;
HOT_100_PROBLEMS.forEach(h => {
  if (!markedHotNums.has(h.num)) {
    fullCatalog.push({
      id: `algo_hot_${h.num}`,
      num: h.num,
      title: h.title,
      difficulty: h.difficulty,
      category: h.category,
      topic: h.category,
      leetcodeUrl: h.leetcodeUrl,
      pattern: h.pattern,
      timeComp: h.timeComp,
      spaceComp: h.spaceComp,
      independent: true,
      mistakes: "注意边界条件校验、防空指针或下标越界、特判特殊输入。",
      projectLink: "对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",
      isCarl: false,
      isHot100: true
    });
    markedHotNums.add(h.num);
    hot100OnlyCount++;
  }
});

console.log('Hot 100 only added items:', hot100OnlyCount);
console.log('Total full catalog items:', fullCatalog.length);

const carlCount = fullCatalog.filter(p => p.isCarl).length;
const hot100Count = fullCatalog.filter(p => p.isHot100).length;
const overlapCount = fullCatalog.filter(p => p.isCarl && p.isHot100).length;

console.log(`Verification: Carl=${carlCount} (Expected 179), Hot100=${hot100Count} (Expected 100), Overlap=${overlapCount}`);

if (carlCount !== 179 || hot100Count !== 100 || fullCatalog.length !== 233) {
  console.error('Counts mismatch! Carl:', carlCount, 'Hot100:', hot100Count, 'Total:', fullCatalog.length);
  process.exit(1);
}

// 格式化输出到 dataset-learning.js
const replacement = 'var ALGORITHM_LAB_CATALOG = ' + JSON.stringify(fullCatalog, null, 2) + ';';
const updatedContent = fileContent.replace(/var ALGORITHM_LAB_CATALOG = \[[\s\S]*?\];/, replacement);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('✓ Successfully written 233 items (179 Carl + 54 Hot 100) to dataset-learning.js');
