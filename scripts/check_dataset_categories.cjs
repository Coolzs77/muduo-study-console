const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');

const startIdx = content.indexOf('= [') + 2;
const endIdx = content.lastIndexOf('];') + 1;
const jsonText = content.substring(startIdx, endIdx);
const problems = JSON.parse(jsonText);

console.log('Total problems in dataset:', problems.length);

const cats = {};
problems.forEach(p => {
  cats[p.category] = (cats[p.category] || 0) + 1;
});
console.log('Categories counts:', cats);

const arrayProbs = problems.filter(p => p.category === '数组' || p.topic === '数组');
console.log('Problems with category/topic === 数组:', arrayProbs.length);
console.log('First 5 数组 problems:', arrayProbs.slice(0, 5).map(p => p.title));
