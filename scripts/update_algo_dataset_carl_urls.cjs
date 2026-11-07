const fs = require('fs');
const path = require('path');
const https = require('https');

https.get('https://programmercarl.com/sitemap.xml', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const allUrls = [];
    const re = /<loc>(https:\/\/programmercarl\.com\/[^<]+)<\/loc>/g;
    let m;
    while ((m = re.exec(data)) !== null) allUrls.push(m[1]);
    const algoUrls = allUrls.filter(u => u.includes('/algo/'));
    const hotUrls = allUrls.filter(u => u.includes('/hot100/'));

    const datasetPath = path.join(__dirname, '../src/data/algoDataset.ts');
    const content = fs.readFileSync(datasetPath, 'utf8');
    const match = content.match(/export const ALGORITHM_LAB_CATALOG: AlgoProblem\[\] = (\[[\s\S]*?\]);\n/);
    if (!match) {
      console.error('Failed to match ALGORITHM_LAB_CATALOG in algoDataset.ts');
      process.exit(1);
    }
    const catalog = JSON.parse(match[1]);

    function getCarlUrl(p) {
      const numStr = p.num !== null && p.num !== undefined ? String(p.num).trim() : '';
      const numPadded = /^\d+$/.test(numStr) ? numStr.padStart(4, '0') : '';

      // 1. KamaCoder / Graph problems
      const isKama = p.id.startsWith('algo_kama_') || p.id.startsWith('algo_kc_') || p.id === 'algo_58' || p.id === 'algo_44' || p.id === 'algo_dptr_54';
      if (isKama && numPadded) {
        if (p.id.includes('dfs')) return algoUrls.find(u => u.includes(`kamacoder-${numPadded}`) && u.includes('dfs'));
        if (p.id.includes('bfs')) return algoUrls.find(u => u.includes(`kamacoder-${numPadded}`) && u.includes('bfs'));
        if (p.id.includes('spfa')) return algoUrls.find(u => u.includes(`kamacoder-${numPadded}`) && u.includes('spfa'));
        if (p.id.includes('kruskal')) return algoUrls.find(u => u.includes(`kamacoder-${numPadded}`) && u.includes('kruskal'));
        if (p.id.includes('prim')) return algoUrls.find(u => u.includes(`kamacoder-${numPadded}`) && u.includes('prim'));
        if (p.id.includes('heap')) return algoUrls.find(u => u.includes(`kamacoder-${numPadded}`) && u.includes('heap'));
        if (p.id.includes('naive')) return algoUrls.find(u => u.includes(`kamacoder-${numPadded}`) && u.includes('naive'));
        const found = algoUrls.find(u => u.includes(`kamacoder-${numPadded}`));
        if (found) return found;
      }

      // 2. Specific special titles, variants or unnumbered problems
      if (p.id === 'algo_kama_94') return algoUrls.find(u => u.includes('kamacoder-0094-city-goods-transportation-i.html'));
      if (p.id === 'algo_77_opt') return algoUrls.find(u => u.includes('0077-combinations-optimized.html'));
      if (p.id === 'algo_53') return algoUrls.find(u => u.includes('/greedy/0053-maximum-subarray.html'));
      if (p.id === 'algo_122') return algoUrls.find(u => u.includes('/greedy/0122-best-time-to-buy-and-sell-stock-ii.html'));
      if (p.id === 'algo_70') return algoUrls.find(u => u.includes('/0070-climbing-stairs.html'));
      if (p.id === 'algo_70_knapsack') return algoUrls.find(u => u.includes('0070-climbing-stairs-complete-knapsack.html'));
      if (p.title.includes('区间和')) return algoUrls.find(u => u.includes('kamacoder-0058-range-sum'));
      if (p.title.includes('开发商购买土地')) return algoUrls.find(u => u.includes('kamacoder-0044-land-purchase'));
      if (p.title.includes('链表相交') || numStr === '02.07') return algoUrls.find(u => u.includes('interview-02-07-linked-list-intersection'));
      if (p.title.includes('二叉树的统一迭代法')) return algoUrls.find(u => u.includes('unified-iterative-binary-tree-traversal'));
      if (p.title.includes('回溯算法去重问题的另一种写法')) return algoUrls.find(u => u.includes('alternative-backtracking-deduplication'));
      if (p.title.includes('根据身高重建队列（续集）')) return algoUrls.find(u => u.includes('0406-queue-reconstruction-by-height'));
      if (p.id === 'algo_94' || (numStr === '94' && p.category === '二叉树')) return algoUrls.find(u => u.includes('recursive-binary-tree-traversal'));
      if (p.id === 'algo_105' || (numStr === '105' && p.category === '二叉树')) return algoUrls.find(u => u.includes('0106-construct-binary-tree-from-inorder-and-postorder-traversal'));

      // 3. Regular Carl problems with 4-digit number
      if (numPadded) {
        const found = algoUrls.find(u => u.includes('/' + numPadded + '-') || u.includes('/' + numPadded + '.'));
        if (found) return found;
      }

      // 4. Hot 100 section fallback on programmercarl.com
      if (numPadded) {
        const hotFound = hotUrls.find(u => u.includes('/' + numPadded + '.') || u.includes('/' + numPadded + '-'));
        if (hotFound) return hotFound;
      }

      return undefined;
    }

    let populatedCount = 0;
    let carlCount = 0;
    catalog.forEach(p => {
      const url = getCarlUrl(p);
      if (url) {
        p.carlUrl = url;
        populatedCount++;
        if (p.isCarl) carlCount++;
      } else {
        delete p.carlUrl;
      }
    });

    console.log(`Total problems: ${catalog.length}`);
    console.log(`Carl problems: ${catalog.filter(p => p.isCarl).length}, populated: ${carlCount}`);
    console.log(`Total problems with carlUrl: ${populatedCount}`);

    const tsOutput = `import { AlgoProblem } from "../types/index";\n\nexport const ALGORITHM_LAB_CATALOG: AlgoProblem[] = ${JSON.stringify(catalog, null, 2)};\n\nif (typeof window !== 'undefined') {\n  (window as any).ALGORITHM_LAB_CATALOG = ALGORITHM_LAB_CATALOG;\n}\n`;

    fs.writeFileSync(datasetPath, tsOutput, 'utf8');
    console.log('✓ Successfully wrote updated src/data/algoDataset.ts with exact carlUrl values!');
  });
});
