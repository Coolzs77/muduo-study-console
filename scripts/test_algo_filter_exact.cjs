const fs = require('fs');
const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
const p = JSON.parse(content.substring(content.indexOf('= [') + 2, content.lastIndexOf('];') + 1));

const trackProblems = p; // viewTrack === 'all'
const selectedCategory = '数组';
const viewTrack = 'all';
const searchQuery = '';

const filtered = trackProblems.filter((problem) => {
  if (selectedCategory !== 'all') {
    if (viewTrack === 'hot100') {
      if (problem.hot100Chapter !== selectedCategory) return false;
    } else {
      if (problem.category !== selectedCategory && problem.topic !== selectedCategory) {
        return false;
      }
    }
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    const inTitle = problem.title.toLowerCase().includes(q);
    const inNum = problem.num !== null && String(problem.num).includes(q);
    const inPattern = (problem.pattern || '').toLowerCase().includes(q);
    const inChapter = (problem.hot100Chapter || '').toLowerCase().includes(q);
    if (!inTitle && !inNum && !inPattern && !inChapter) return false;
  }
  return true;
});

console.log('Filtered length in Node:', filtered.length);
