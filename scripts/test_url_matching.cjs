const fs = require('fs');
const urls = JSON.parse(fs.readFileSync('scripts/carl_algo_urls.json', 'utf8'));

// Fetch hot100 urls from sitemap too
const https = require('https');
https.get('https://programmercarl.com/sitemap.xml', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const allUrls = [];
    const re = /<loc>(https:\/\/programmercarl\.com\/[^<]+)<\/loc>/g;
    let m;
    while ((m = re.exec(data)) !== null) {
      allUrls.push(m[1]);
    }
    
    // Read algoDataset
    const content = fs.readFileSync('src/data/algoDataset.ts', 'utf8');
    const regex = /"id":\s*"([^"]+)",\s*"num":\s*([^,\n]+),\s*"title":\s*"([^"]+)",[\s\S]*?"category":\s*"([^"]+)",[\s\S]*?"isCarl":\s*(true|false),[\s\S]*?"isHot100":\s*(true|false)/g;
    let match;
    const problems = [];
    while ((match = regex.exec(content)) !== null) {
      problems.push({
        id: match[1],
        num: match[2].trim().replace(/"/g, ''),
        title: match[3],
        category: match[4],
        isCarl: match[5] === 'true',
        isHot100: match[6] === 'true'
      });
    }

    console.log('Total problems:', problems.length);
    
    let carlMatched = 0;
    let hot100Matched = 0;

    for (const p of problems) {
      let numPadded = '';
      if (!isNaN(p.num) && p.num !== 'null' && p.num !== '') {
        numPadded = String(p.num).padStart(4, '0');
      }

      // Check algo match
      let url = null;
      if (numPadded) {
        url = allUrls.find(u => u.includes('/algo/') && (u.includes('/' + numPadded + '-') || u.includes('kamacoder-' + numPadded)));
      }
      if (!url && p.title.includes('区间和')) url = allUrls.find(u => u.includes('0058-range-sum'));
      if (!url && p.title.includes('开发商购买土地')) url = allUrls.find(u => u.includes('0044-land-purchase'));
      if (!url && p.title.includes('二叉树的统一迭代法')) url = allUrls.find(u => u.includes('unified-iterative-binary-tree-traversal'));
      if (!url && p.title.includes('回溯算法去重问题的另一种写法')) url = allUrls.find(u => u.includes('alternative-backtracking-deduplication'));
      if (!url && p.title.includes('链表相交')) url = allUrls.find(u => u.includes('interview-02-07-linked-list-intersection'));
      if (!url && p.title.includes('根据身高重建队列（续集）')) url = allUrls.find(u => u.includes('0406-queue-reconstruction-by-height'));

      // If not in /algo/, check if in /hot100/
      if (!url && numPadded) {
        url = allUrls.find(u => u.includes('/hot100/') && u.includes(numPadded));
      }

      if (url) {
        if (p.isCarl) carlMatched++;
        else if (p.isHot100) hot100Matched++;
      }
    }

    console.log(`Carl problems matched: ${carlMatched} / ${problems.filter(p => p.isCarl).length}`);
    console.log(`Hot100 non-Carl matched: ${hot100Matched} / ${problems.filter(p => p.isHot100 && !p.isCarl).length}`);
  });
});
