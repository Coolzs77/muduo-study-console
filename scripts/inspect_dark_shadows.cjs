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
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));
let totalWhite = 0;
let missingDark = 0;
const fileStats = {};
const diffuseDarkWhite = [];
const missingHoverDark = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // 1. Day white shadow coverage check
    if (line.includes('shadow-[') && (line.includes('255,255,255') || line.includes('255, 255, 255'))) {
      totalWhite++;
      // Check local line and immediate context for dark:shadow
      const start = Math.max(0, idx - 4);
      const end = Math.min(lines.length - 1, idx + 4);
      const context = lines.slice(start, end + 1).join('\n');
      if (!context.includes('dark:shadow')) {
        missingDark++;
        const rel = path.relative(path.join(__dirname, '..'), f);
        fileStats[rel] = (fileStats[rel] || 0) + 1;
      }
    }

    // 2. Strict diffuse white blur check in dark mode shadows
    const darkShadowMatches = line.match(/dark:(?:[a-z-]+:)?shadow-\[[^\]]+\]/g) || [];
    darkShadowMatches.forEach(ds => {
      const insets = ds.split(/inset_/).slice(1);
      insets.forEach(ins => {
        if (ins.includes('255,') || ins.includes('255 ,')) {
          const parts = ins.split('_rgba')[0].split('_');
          let blur = null;
          if (parts.length === 3) {
            blur = parts[2];
          } else if (parts.length >= 4) {
            blur = parts[2];
          }
          if (blur && blur !== '0' && blur !== '0px') {
            diffuseDarkWhite.push({
              file: path.relative(path.join(__dirname, '..'), f),
              line: lineNum,
              blur,
              snippet: ds
            });
          }
        }
      });
    });

    // 3. Hover state shadow check
    if (line.includes('hover:shadow-[') && (line.includes('rgba(255,255,255') || line.includes('rgba(255, 255, 255'))) {
      if (!line.includes('dark:hover:shadow')) {
        missingHoverDark.push({
          file: path.relative(path.join(__dirname, '..'), f),
          line: lineNum,
          snippet: line.trim().slice(0, 100)
        });
      }
    }
  });
});

console.log('================================================================');
console.log('🔍 Scheme A Dark Mode High-Precision Shadow Inspection Engine');
console.log('================================================================');
console.log('Total white shadows found in day mode:', totalWhite);
console.log('Missing dark:shadow (uncovered day white shadows):', missingDark);
if (missingDark > 0) {
  console.log('Files with missing dark:shadow:');
  console.table(Object.entries(fileStats).sort((a, b) => b[1] - a[1]));
}
console.log('Diffuse white blur (>0px) found in dark:shadow:', diffuseDarkWhite.length);
if (diffuseDarkWhite.length > 0) {
  console.error('❌ Diffuse white blur defects detected in dark mode:');
  diffuseDarkWhite.forEach(d => console.error(`  - ${d.file}:${d.line} (blur=${d.blur}): ${d.snippet}`));
}
if (missingHoverDark.length > 0) {
  console.error('❌ Missing dark:hover:shadow on day hover white shadows:');
  missingHoverDark.forEach(d => console.error(`  - ${d.file}:${d.line}: ${d.snippet}`));
}

if (missingDark > 0 || diffuseDarkWhite.length > 0 || missingHoverDark.length > 0) {
  console.error('\n❌ Scheme A inspection FAILED! Defects must be eliminated.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL SCHEME A SHADOW SPEC CHECKS PASSED (0 missing, 0 diffuse blurs)!');
  process.exit(0);
}
