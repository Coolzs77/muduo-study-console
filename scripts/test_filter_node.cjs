const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
const startIdx = content.indexOf('= [') + 2;
const endIdx = content.lastIndexOf('];') + 1;
const problems = JSON.parse(content.substring(startIdx, endIdx));

const selectedCategory = '数组';
const viewTrack = 'all';
const searchQuery = '';

const filtered = problems.filter((p) => {
  if (selectedCategory !== 'all') {
    if (viewTrack === 'hot100') {
      if (p.hot100Chapter !== selectedCategory) return false;
    } else {
      if (p.category !== selectedCategory && p.topic !== selectedCategory) {
        return false;
      }
    }
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    const inTitle = p.title.toLowerCase().includes(q);
    const inNum = p.num !== null && String(p.num).includes(q);
    const inPattern = (p.pattern || '').toLowerCase().includes(q);
    const inChapter = (p.hot100Chapter || '').toLowerCase().includes(q);
    if (!inTitle && !inNum && !inPattern && !inChapter) return false;
  }
  return true;
});

console.log('Filtered length:', filtered.length);
console.log('Filtered titles:', filtered.map(p => p.title));
console.log('Does filtered include 206?', filtered.some(p => p.num === 206));
