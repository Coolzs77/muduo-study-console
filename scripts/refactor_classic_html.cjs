const fs = require('fs');
const path = require('path');

const classicPath = path.join('e:/workspace/muduo-study-console/classic.html');
let classic = fs.readFileSync(classicPath, 'utf8');

classic = classic.replace(/<title>.*?<\/title>/, '<title>C++ 与算法</title>');

classic = classic.replace(/<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100[\s\S]*?<\/div>\s*<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">[\s\S]*?<\/h1>\s*<p class="text-stone-600[\s\S]*?<\/p>/,
  `<h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif-heading">
                    C++ 与算法
                </h1>`);

fs.writeFileSync(classicPath, classic, 'utf8');
console.log('classic.html updated successfully!');
