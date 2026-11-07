const fs = require('fs');
const urls = JSON.parse(fs.readFileSync('scripts/carl_algo_urls.json', 'utf8'));
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');

const regex = /"id":\s*"([^"]+)",\s*"num":\s*([^,\n]+),\s*"title":\s*"([^"]+)",[\s\S]*?"category":\s*"([^"]+)",[\s\S]*?"isCarl":\s*(true|false)/g;
let match;
const problems = [];
while ((match = regex.exec(content)) !== null) {
  problems.push({
    id: match[1],
    num: match[2].trim(),
    title: match[3],
    category: match[4],
    isCarl: match[5] === 'true'
  });
}

const carlProblems = problems.filter(p => p.isCarl);
console.log('Total Carl problems in dataset:', carlProblems.length);

let matched = 0;
let unmatched = [];

for (const p of carlProblems) {
  const numPadded = String(p.num).padStart(4, '0');
  let found = urls.find(u => u.includes('/' + numPadded + '-') || u.includes('/' + p.num + '-'));
  if (!found) {
    // Try matching kamacoder
    found = urls.find(u => u.includes(`kamacoder-${numPadded}`) || u.includes(`kamacoder-${String(p.num).padStart(4, '0')}`));
  }
  if (!found) {
    // Try matching by title keywords (e.g. 58. 区间和 -> range-sum)
    if (p.title.includes('区间和')) found = urls.find(u => u.includes('0058-range-sum'));
    if (p.title.includes('开发商购买土地')) found = urls.find(u => u.includes('0044-land-purchase'));
    if (p.title.includes('斐波那契')) found = urls.find(u => u.includes('0509-fibonacci-number'));
    if (p.title.includes('爬楼梯')) found = urls.find(u => u.includes('0070-climbing-stairs'));
    if (p.title.includes('最小花费爬楼梯')) found = urls.find(u => u.includes('0746-min-cost-climbing-stairs'));
    if (p.title.includes('不同路径II')) found = urls.find(u => u.includes('0063-unique-paths-ii'));
    else if (p.title.includes('不同路径')) found = urls.find(u => u.includes('0062-unique-paths'));
    if (p.title.includes('整数拆分')) found = urls.find(u => u.includes('0343-integer-break'));
    if (p.title.includes('不同的二叉搜索树')) found = urls.find(u => u.includes('0096-unique-binary-search-trees'));
    if (p.title.includes('01背包')) found = urls.find(u => u.includes('0-1-knapsack') || u.includes('bag'));
    if (p.title.includes('打家劫舍III')) found = urls.find(u => u.includes('0337-house-robber-iii'));
    else if (p.title.includes('打家劫舍II')) found = urls.find(u => u.includes('0213-house-robber-ii'));
    else if (p.title.includes('打家劫舍')) found = urls.find(u => u.includes('0198-house-robber'));
    if (p.title.includes('买卖股票的最佳时机含手续费')) found = urls.find(u => u.includes('0714-best-time-to-buy-and-sell-stock-with-transaction-fee'));
    else if (p.title.includes('最佳冷冻期')) found = urls.find(u => u.includes('0309-best-time-to-buy-and-sell-stock-with-cooldown'));
    else if (p.title.includes('买卖股票的最佳时机IV')) found = urls.find(u => u.includes('0188-best-time-to-buy-and-sell-stock-iv'));
    else if (p.title.includes('买卖股票的最佳时机III')) found = urls.find(u => u.includes('0123-best-time-to-buy-and-sell-stock-iii'));
    else if (p.title.includes('买卖股票的最佳时机II')) found = urls.find(u => u.includes('0122-best-time-to-buy-and-sell-stock-ii'));
    else if (p.title.includes('买卖股票的最佳时机')) found = urls.find(u => u.includes('0121-best-time-to-buy-and-sell-stock'));
  }
  if (found) {
    matched++;
  } else {
    unmatched.push(p);
  }
}

console.log('Matched count:', matched, 'Unmatched count:', unmatched.length);
if (unmatched.length > 0) {
  console.log('Unmatched samples:');
  console.log(unmatched);
}
