// Prepares IPA (from CMU dict) and inflected-form → lemma map (wink-lemmatizer) as JSON.
import fs from "node:fs";
import { dictionary as cmu } from "cmu-pronouncing-dictionary";
import lem from "wink-lemmatizer";
const wordList = JSON.parse(fs.readFileSync("node_modules/an-array-of-english-words/index.json","utf8"));

const A = {AA:"ɑː",AE:"æ",AH:"ʌ",AO:"ɔː",AW:"aʊ",AY:"aɪ",EH:"e",ER:"ɜːr",EY:"eɪ",IH:"ɪ",IY:"iː",OW:"oʊ",OY:"ɔɪ",UH:"ʊ",UW:"uː",
  B:"b",CH:"tʃ",D:"d",DH:"ð",F:"f",G:"ɡ",HH:"h",JH:"dʒ",K:"k",L:"l",M:"m",N:"n",NG:"ŋ",P:"p",R:"r",S:"s",SH:"ʃ",T:"t",TH:"θ",V:"v",W:"w",Y:"j",Z:"z",ZH:"ʒ"};
const V = new Set(["AA","AE","AH","AO","AW","AY","EH","ER","EY","IH","IY","OW","OY","UH","UW"]);
function toIpa(arp){
  const ph = arp.trim().split(/\s+/);
  // place primary stress mark before the onset consonant of the stressed syllable (simple heuristic: right before the vowel's preceding consonant)
  const out = [];
  ph.forEach((p, i) => {
    const m = p.match(/^([A-Z]+)(\d)?$/); if (!m) return;
    let [, base, st] = m; let s = A[base] || "";
    if (V.has(base)) {
      if (base === "AH" && st === "0") s = "ə";
      if (base === "ER" && st === "0") s = "ər";
      if (base === "IY" && st === "0" && i === ph.length - 1) s = "i";
      if (st === "1" && ph.filter(x=>/\d/.test(x)).length > 1) {
        // move stress before preceding consonant if any
        // find consonant run before this vowel
        let j = out.length; while (j > 0 && !/[ɑæʌɔaeɜɪiouʊəˈˌ]/.test(out[j-1][0])) j--;
        const run = out.length - j;
        if (j === 0 || run <= 1) out.splice(j, 0, "ˈ");
        else { const two = out[out.length-2] + out[out.length-1];
          const ON = /^(bl|br|kl|kr|pl|pr|tr|dr|fr|fl|ɡr|ɡl|st|sp|sk|θr|ʃr|bj|kj|pj|fj|mj|nj|tw|kw|sw|sl|sm|sn)$/;
          out.splice(ON.test(two) ? out.length-2 : out.length-1, 0, "ˈ"); }
      }
    }
    out.push(s);
  });
  return "/" + out.join("") + "/";
}
const ipa = {};
for (const [w, p] of Object.entries(cmu)) {
  if (!/^[a-z][a-z']*$/.test(w)) continue; // skip alternates like "read(2)"
  ipa[w] = toIpa(p);
}
const forms = {};
const words = wordList.filter(w => /^[a-z]+$/.test(w) && w.length < 20);
for (const w of words) {
  for (const f of [lem.verb, lem.noun, lem.adjective]) {
    const l = f(w);
    if (l && l !== w) { (forms[w] ||= []); if (!forms[w].includes(l)) forms[w].push(l); }
  }
}
fs.writeFileSync("ipa.json", JSON.stringify(ipa));
fs.writeFileSync("forms.json", JSON.stringify(forms));
console.log("ipa", Object.keys(ipa).length, "forms", Object.keys(forms).length, ipa.about, ipa.say, ipa.beautiful, forms.went, forms.children, forms.running);
