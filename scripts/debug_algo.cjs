const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
const titles = [];
const regex = /"title": "([^"]+)"/g;
let m;
while ((m = regex.exec(content)) !== null) {
  titles.push(m[1]);
}
console.log('Total problems:', titles.length);
console.log('First 10 problems:', titles.slice(0, 10));
