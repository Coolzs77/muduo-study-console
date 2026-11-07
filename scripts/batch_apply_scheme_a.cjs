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

function transformContent(content) {
  let modified = content;

  // 1. Remove diffuse white blur in existing dark:shadow
  modified = modified.replace(
    /dark:shadow-\[8px_8px_18px_rgba\(0,0,0,0\.3\),inset_2px_2px_4px_rgba\(255,255,255,0\.08\),inset_-2px_-2px_4px_rgba\(0,0,0,0\.3\)\]/g,
    'dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  modified = modified.replace(
    /dark:shadow-\[6px_6px_14px_rgba\(0,0,0,0\.3\),inset_2px_2px_4px_rgba\(255,255,255,0\.08\),inset_-2px_-2px_4px_rgba\(0,0,0,0\.3\)\]/g,
    'dark:shadow-[0_4px_16px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  modified = modified.replace(
    /dark:shadow-\[6px_6px_14px_rgba\(0,0,0,0\.3\),inset_2px_2px_4px_rgba\(255,255,255,0\.08\),inset_-1px_-1px_2px_rgba\(0,0,0,0\.3\)\]/g,
    'dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  modified = modified.replace(
    /dark:shadow-\[6px_6px_14px_rgba\(0,0,0,0\.3\),inset_2px_2px_4px_rgba\(255,255,255,0\.08\)\]/g,
    'dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  // Eliminate any remaining diffuse white in dark:shadow
  modified = modified.replace(
    /dark:shadow-\[([^\]]*?)inset_[0-9.]+px_[0-9.]+px_[2-9][0-9]*px_rgba\(255,\s*255,\s*255,\s*0?\.[0-9]+\)([^\]]*?)\]/g,
    (match, p1, p2) => {
      let rest = (p1 + p2).replace(/,,+/g, ',').replace(/^,|,$/g, '').trim();
      if (!rest.includes('inset_0_1px_0_0')) {
        rest = rest ? rest + ',inset_0_1px_0_0_rgba(255,255,255,0.08)' : 'inset_0_1px_0_0_rgba(255,255,255,0.08)';
      }
      return `dark:shadow-[${rest}]`;
    }
  );

  // 2. Modals (12px_12px_32px...)
  modified = modified.replace(
    /(shadow-\[12px_12px_32px_rgba\(0,0,0,0\.2\),inset_2px_2px_4px_rgba\(255,255,255,0\.7\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  // 3. Drawers (-10px_0_35px... / -8px_0_32px...)
  modified = modified.replace(
    /(shadow-\[-[0-9]+px_0_[0-9]+px_rgba\(0,0,0,0\.[0-9]+\),inset_2px_2px_4px_rgba\(255,255,255,0\.7\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[-8px_0_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  // 4. Large cards / containers with 8px_8px_20px or 8px_8px_18px
  modified = modified.replace(
    /(shadow-\[8px_8px_20px_rgba\(0,0,0,0\.06\),inset_2px_2px_4px_rgba\(255,255,255,0\.[78]\)(?:,inset_-2px_-2px_4px_rgba\(0,0,0,0\.04\))?\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  modified = modified.replace(
    /(shadow-\[8px_8px_18px_rgba\(0,0,0,0\.06\),inset_4px_4px_8px_rgba\(255,255,255,0\.7\),inset_-2px_-2px_4px_rgba\(0,0,0,0\.04\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  // 5. Code block / container with 6px_6px_16px
  modified = modified.replace(
    /(shadow-\[6px_6px_16px_rgba\(0,0,0,0\.06\),inset_2px_2px_4px_rgba\(255,255,255,0\.7\),inset_-2px_-2px_4px_rgba\(0,0,0,0\.04\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  // 6. Medium cards with 6px_6px_14px
  modified = modified.replace(
    /(shadow-\[6px_6px_14px_rgba\(0,0,0,0\.05\),inset_3px_3px_6px_rgba\(255,255,255,0\.8[0-5]?\)(?:,inset_-1px_-1px_2px_rgba\(0,0,0,0\.03\))?\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  // 7. Cards with 4px_4px_10px / 4px_4px_12px
  modified = modified.replace(
    /(shadow-\[4px_4px_1[02]px_rgba\(0,0,0,0\.0[5-7]\),inset_2px_2px_4px_rgba\(255,255,255,0\.8[5-9]?\)(?:,inset_-1px_-1px_2px_rgba\(0,0,0,0\.04\))?\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  // 4px_4px_10px with 0.06
  modified = modified.replace(
    /(shadow-\[4px_4px_10px_rgba\(0,0,0,0\.06\),inset_2px_2px_4px_rgba\(255,255,255,0\.9\),inset_-1px_-1px_2px_rgba\(0,0,0,0\.04\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.12)]'
  );

  // 4px_4px_12px with 0.07
  modified = modified.replace(
    /(shadow-\[4px_4px_12px_rgba\(0,0,0,0\.07\),inset_2px_2px_4px_rgba\(255,255,255,0\.9\),inset_-1px_-1px_2px_rgba\(0,0,0,0\.04\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)]'
  );

  // Header icon
  modified = modified.replace(
    /(shadow-\[4px_4px_10px_rgba\(14,165,233,0\.3\),inset_2px_2px_4px_rgba\(255,255,255,0\.7\),inset_-1px_-1px_2px_rgba\(0,0,0,0\.15\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_12px_rgba(14,165,233,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)]'
  );

  // 4px_4px_12px with colored shadow
  modified = modified.replace(
    /(shadow-\[4px_4px_12px_rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,\s*0?\.[0-9]+\),inset_2px_2px_4px_rgba\(255,255,255,0\.6\)(?:,inset_-1px_-1px_2px_rgba\(0,0,0,0\.04\))?\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)]'
  );

  modified = modified.replace(
    /(shadow-\[4px_4px_12px_rgba\(0,0,0,0\.0[5-7]\),inset_1px_1px_2px_rgba\(255,255,255,0\.7\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  // 8. Buttons / items with 3px_3px_8px / 3px_3px_6px
  modified = modified.replace(
    /(shadow-\[3px_3px_[68]px_rgba\(0,0,0,0\.08\),inset_2px_2px_4px_rgba\(255,255,255,0\.9\),inset_-1px_-1px_2px_rgba\(0,0,0,0\.04\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.1)]'
  );

  modified = modified.replace(
    /(shadow-\[3px_3px_[68]px_rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,\s*0?\.[0-9]+\),inset_2px_2px_4px_rgba\(255,255,255,0\.6\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)]'
  );

  modified = modified.replace(
    /(shadow-\[3px_3px_[68]px_rgba\(0,0,0,0\.0[3-7]\),inset_2px_2px_4px_rgba\(255,255,255,0\.8[5-9]?\)(?:,inset_-1px_-1px_2px_rgba\(0,0,0,0\.04\))?\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  // 9. Small chips / buttons
  modified = modified.replace(
    /(shadow-\[2px_2px_[568]px_rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,\s*0?\.[0-9]+\),inset_1(?:\.5)?px_1(?:\.5)?px_[23]px_rgba\(255,255,255,0\.[356]\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)]'
  );

  modified = modified.replace(
    /(shadow-\[2px_2px_6px_rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,\s*0\.15\),inset_1px_1px_2px_rgba\(255,255,255,0\.8\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  modified = modified.replace(
    /(shadow-\[2px_2px_[56]px_rgba\(0,0,0,0\.08\),inset_1\.5px_1\.5px_3px_rgba\(255,255,255,0\.9\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  modified = modified.replace(
    /(shadow-\[2px_2px_5px_rgba\(0,0,0,0\.05\),inset_1\.5px_1\.5px_3px_rgba\(255,255,255,0\.9\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
  );

  modified = modified.replace(
    /(shadow-\[2px_2px_[456]px_rgba\(0,0,0,0\.0[4-8]\),inset_1(?:\.5)?px_1(?:\.5)?px_[23]px_rgba\(255,255,255,0\.8[0-9]?\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  // Tiny circular badge (1px_1px_3px...)
  modified = modified.replace(
    /(shadow-\[1px_1px_3px_rgba\(0,0,0,0\.1\),inset_1px_1px_1px_rgba\(255,255,255,0\.8\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  // 10. Inset recessed elements
  modified = modified.replace(
    /(shadow-\[inset_1px_1px_2px_rgba\(0,0,0,0\.1\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]'
  );

  modified = modified.replace(
    /(shadow-\[inset_2px_2px_4px_rgba\(0,0,0,0\.1\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.4)]'
  );

  modified = modified.replace(
    /(shadow-\[inset_2px_2px_4px_rgba\(0,0,0,0\.06\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
  );

  modified = modified.replace(
    /(shadow-\[inset_2px_2px_5px_rgba\(0,0,0,0\.06\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.35)]'
  );

  modified = modified.replace(
    /(shadow-\[inset_1px_1px_2px_rgba\(255,255,255,0\.8\)(?:,inset_-1px_-1px_2px_rgba\(0,0,0,0\.0[36]\))?\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  modified = modified.replace(
    /(shadow-\[inset_1\.5px_1\.5px_3px_rgba\(0,0,0,0\.0[68]\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  modified = modified.replace(
    /(shadow-\[inset_1px_1px_2px_rgba\(0,0,0,0\.0[568]\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.[78]\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
  );

  modified = modified.replace(
    /(shadow-\[inset_2px_2px_[45]px_rgba\(0,0,0,0\.06\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.7\)\])(?![\s\S]{0,80}dark:shadow)/g,
    '$1 dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.35)]'
  );

  return modified;
}

const allFiles = walk('src');
let changedCount = 0;

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const transformed = transformContent(content);
  if (transformed !== content) {
    fs.writeFileSync(f, transformed, 'utf8');
    changedCount++;
    console.log(`Updated: ${f}`);
  }
});

console.log(`Total files updated: ${changedCount}`);
