const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/data/yuqueDataset.ts'), 'utf8');
const matches = content.match(/!\[.*?\]\((.*?)\)/g);
console.log('Total images found in yuqueDataset:', matches ? matches.length : 0);
if (matches) {
  console.log('Sample images:');
  matches.slice(0, 10).forEach(m => console.log(' ', m));
}
