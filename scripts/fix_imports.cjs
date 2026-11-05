const fs = require('fs');
const path = require('path');

['yuqueDataset.ts', 'algoDataset.ts', 'tasksDataset.ts', 'mappingDataset.ts'].forEach(f => {
  const p = path.join(__dirname, '../src/data', f);
  if (fs.existsSync(p)) {
    let txt = fs.readFileSync(p, 'utf8');
    txt = txt.replace(/from ["']\.\.\/types["']/g, 'from "../types/index"');
    fs.writeFileSync(p, txt, 'utf8');
  }
});
console.log('✓ Successfully updated import paths in src/data/');
