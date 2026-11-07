const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
let totalWhite = 0;
let missingDark = 0;
const fileStats = {};
const diffuseDarkWhite = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const classMatches = content.match(/className\s*=\s*(`[^`]+`|"[^"]+"|\{'[^']+'\}|\{[^}]+\})/g) || [];
  classMatches.forEach(cm => {
    if (cm.includes('shadow-[') && cm.includes('255,255,255')) {
      totalWhite++;
      if (!cm.includes('dark:shadow')) {
        missingDark++;
        fileStats[f] = (fileStats[f] || 0) + 1;
      }
    }
    // Check if dark:shadow has diffuse white blur (>1px or non-0px blur)
    // E.g. dark:shadow-[...inset_4px_4px_8px_rgba(255,255,255,...)] or inset_2px_2px_4px
    if (cm.includes('dark:shadow') && /dark:shadow-\[[^\]]*inset_[0-9]+px_[0-9]+px_[2-9][0-9]*px_rgba\(255,\s*255,\s*255/i.test(cm)) {
      diffuseDarkWhite.push({ file: f, snippet: cm.slice(0, 150) });
    }
  });
});

console.log('Total white shadows found:', totalWhite);
console.log('Missing dark:shadow (uncovered day white shadows):', missingDark);
console.log('Files with missing dark:shadow:');
console.table(Object.entries(fileStats).sort((a, b) => b[1] - a[1]));
console.log('Diffuse white blur (>1px) found in dark:shadow:', diffuseDarkWhite.length);
if (diffuseDarkWhite.length > 0) {
  console.log('Examples of diffuse white blur in dark:shadow:', diffuseDarkWhite.slice(0, 5));
}

