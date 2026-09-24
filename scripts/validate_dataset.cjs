const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '../js/dataset-yuque.js'), 'utf-8');
eval(code);

console.log('Total articles in YUQUE_DATASET:', YUQUE_DATASET.length);
const muduo = YUQUE_DATASET.filter(d => d.bookId === 'muduo-core');
console.log('Muduo-core articles count:', muduo.length);

let totalMuduoChars = 0;
let totalMuduoCodeBlocks = 0;
let totalMuduoImages = 0;

muduo.forEach((d, i) => {
  const codeblocks = (d.content.match(/```/g) || []).length / 2;
  const images = (d.content.match(/!\[.*?\]\((.*?)\)/g) || []).length;
  totalMuduoChars += d.content.length;
  totalMuduoCodeBlocks += codeblocks;
  totalMuduoImages += images;
  console.log(`  [${i + 1}] ${d.title}: ${d.content.length} chars, ${d.wordCount} words, ${codeblocks} codeblocks, ${images} images`);
});

console.log(`\nMuduo-core Totals: ${totalMuduoChars} chars, ${totalMuduoCodeBlocks} code blocks, ${totalMuduoImages} images`);

const http = YUQUE_DATASET.filter(d => d.bookId === 'http-server' || d.id.startsWith('yq_0') || d.id.startsWith('yq_1'));
console.log('HTTP framework articles count:', http.length);
