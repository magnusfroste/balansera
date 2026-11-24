// Kontrollerar att varje reaktion i app.js är massbalanserad: lika många atomer av
// varje grundämne på båda sidor om pilen, och att koefficienterna är heltal >= 1.
//   node verify.mjs
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("./public/app.js", import.meta.url), "utf8");
const start = src.indexOf("var REAKTIONER = [");
const end = src.indexOf("];", start);
if (start < 0 || end < 0) throw new Error("hittar inte REAKTIONER i app.js");
const REAKTIONER = eval(src.slice(start + "var REAKTIONER = ".length, end + 1));

function atomer(f) {
  let i = 0;
  const add = (a, b, n) => { for (const k in b) a[k] = (a[k] || 0) + b[k] * n; };
  function grupp() {
  const res = {};
  const tal = () => { const m = /^[0-9]+/.exec(f.slice(i)); if (m) { i += m[0].length; return Number(m[0]); } return 1; };
  while (i < f.length) {
    const c = f[i];
    if (c === "(") { i++; const inner = grupp(); add(res, inner, tal()); }
    else if (c === ")") { i++; return res; }
    else if (/[A-Z]/.test(c)) {
      let el = c; i++;
      if (f[i] && /[a-z]/.test(f[i])) { el += f[i]; i++; }
      res[el] = (res[el] || 0) + tal();
    } else { i++; }
  }
  return res;
  }
  return grupp();
}
const sida = (amnen, nyckel) => {
  const sum = {};
  amnen.forEach((a) => { const at = atomer(a.f); for (const k in at) sum[k] = (sum[k] || 0) + at[k] * a[nyckel]; });
  return sum;
};

let fel = 0;
for (const r of REAKTIONER) {
  const l = sida(r.l, "c"), rr = sida(r.r, "c");
  const nycklar = [...new Set([...Object.keys(l), ...Object.keys(rr)])].sort();
  const olika = nycklar.filter((k) => (l[k] || 0) !== (rr[k] || 0));
  const nollor = [...r.l, ...r.r].filter((a) => !Number.isInteger(a.c) || a.c < 1);
  const g = [...r.l, ...r.r].map((a) => a.c).reduce((a, b) => (b ? a % b === 0 && false : a), null) === null ? 0 : 0;
  if (olika.length || nollor.length) {
    fel++;
    console.log("FEL", r.svar, "obalanserad på", olika.join(","), "nollor:", nollor.length);
  } else {
    console.log("ok ", r.svar, "→", nycklar.map((k) => `${k}${l[k]}`).join(" "));
  }
}
const fyra = REAKTIONER.filter((r) => r.l.length + r.r.length > 2).length;
console.log(`\n${REAKTIONER.length} reaktioner, ${fel} fel, ${fyra} med fler än två ämnen`);
process.exit(fel ? 1 : 0);
