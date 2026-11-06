const fs = require('fs');
const js = fs.readFileSync('dist/assets/index-IcwMY4T-.js', 'utf8');

const grStart = js.indexOf('gr=[');
const grSub = js.slice(grStart + 3);
let depth = 0;
let endIdx = -1;
for (let i = 0; i < grSub.length; i++) {
  if (grSub[i] === '[') depth++;
  else if (grSub[i] === ']') {
    depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }
}

const grStr = grSub.slice(0, endIdx + 1);
const gr = eval('(' + grStr + ')');
console.log('Total problems in compiled gr:', gr.length);

const o = "all";
const p = "数组";
const i = "";
const S = gr;

const b = S.filter(h => {
  if (p !== "all") {
    if (o === "hot100") {
      if (h.hot100Chapter !== p) return false;
    } else if (h.category !== p && h.topic !== p) return false;
  }
  if (i.trim()) {
    const R = i.toLowerCase(),
      k = h.title.toLowerCase().includes(R),
      I = h.num !== null && String(h.num).includes(R),
      P = (h.pattern || "").toLowerCase().includes(R),
      F = (h.hot100Chapter || "").toLowerCase().includes(R);
    if (!k && !I && !P && !F) return false;
  }
  return true;
});

console.log('Filtered b.length in compiled gr:', b.length);
console.log('Filtered b titles:', b.map(x => x.title));
