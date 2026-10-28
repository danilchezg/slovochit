"use strict";
/* Словочит — офлайн-читалка для изучения английского.
   Данные: content.js (книги, уроки), dict/*.json (словарь), localStorage + IndexedDB (прогресс, книги). */

/* ============ helpers ============ */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { toast("Память устройства заполнена") } }
};
const DAY = 864e5;
const dkey = t => { const d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") };
const today = () => dkey(Date.now());
const plural = (n, a, b, c) => { n = Math.abs(n) % 100; const n1 = n % 10; if (n > 10 && n < 20) return c; if (n1 > 1 && n1 < 5) return b; if (n1 == 1) return a; return c };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const IC = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></svg>',
  aa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19l5-14 5 14M4.8 14h6.4M14 19l3.5-9 3.5 9M15.2 16h4.6"/></svg>',
  fire: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5 5 5.5 5 10.5A5 5 0 0 1 12 18a5 5 0 0 1-5-5.5c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5.5 1-9z" opacity=".9"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg>',
  cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="6" width="13" height="15" rx="2.5"/><path d="M8 3h10.5A2.5 2.5 0 0 1 21 5.5V18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>'
};

/* ============ settings & themes ============ */
const SKINS = {
  graphite: { n: "Графит", dark: 1, bg: "#111315", surface: "#191C1F", s2: "#22262A", line: "#2C3135", fg: "#ECEDEE", muted: "#9AA1A6", faint: "#646B71" },
  midnight: { n: "Полночь", dark: 1, bg: "#0C111C", surface: "#141A28", s2: "#1C2436", line: "#283147", fg: "#E7EBF4", muted: "#97A1B7", faint: "#5E6880" },
  moss: { n: "Мох", dark: 1, bg: "#0F1412", surface: "#161D1A", s2: "#1F2824", line: "#2A3530", fg: "#E6EEEA", muted: "#97A8A0", faint: "#5F6F68" },
  oled: { n: "Чёрная", dark: 1, bg: "#000000", surface: "#0F0F10", s2: "#1A1A1C", line: "#262629", fg: "#F2F2F2", muted: "#9A9A9E", faint: "#5E5E62" },
  sepia: { n: "Сепия", dark: 0, bg: "#F3EBDD", surface: "#FBF6EC", s2: "#EBE0CD", line: "#DDCFB8", fg: "#3A2F23", muted: "#7B6A55", faint: "#A8977F" },
  light: { n: "Светлая", dark: 0, bg: "#F4F5F6", surface: "#FFFFFF", s2: "#ECEEF0", line: "#E0E3E6", fg: "#15181B", muted: "#5E656C", faint: "#9AA1A8" }
};
const ACCENTS = {
  mint: { n: "Мята", d: "#3DD6A3", l: "#0C9B70" }, sky: { n: "Небо", d: "#5AB4FF", l: "#2275D8" },
  lilac: { n: "Сирень", d: "#AA9CFF", l: "#6553E6" }, amber: { n: "Янтарь", d: "#FFC24B", l: "#B97900" },
  coral: { n: "Коралл", d: "#FF7A66", l: "#D9472F" }, rose: { n: "Роза", d: "#FF86BC", l: "#CC3D7F" }
};
const RSKINS = {
  app: { n: "Как в приложении" },
  dusk: { n: "Сумерки", bg: "#1D1A15", ink: "#E4DACA", muted: "#9C907D" },
  night: { n: "Ночь", bg: "#09090A", ink: "#BDBDBA", muted: "#77777A" },
  sepia: { n: "Сепия", bg: "#F2E8D5", ink: "#3B2F21", muted: "#8A7860", light: 1 },
  paper: { n: "Бумага", bg: "#FBFAF6", ink: "#1E2023", muted: "#7A7E84", light: 1 }
};
const RFONTS = { literata: ["Literata", '"Literata",Georgia,serif'], lora: ["Lora", '"Lora",Georgia,serif'], pt: ["PT Serif", '"PT Serif",Georgia,serif'], manrope: ["Manrope", '"Manrope",system-ui,sans-serif'], onest: ["Onest", '"Onest",system-ui,sans-serif'] };
const COLS = { s: 520, m: 640, l: 780 };
const DEF = { mt: "auto", autoTr: 1, skin: "graphite", accent: "mint", rskin: "app", rfont: "literata", fs: 20, lh: 1.7, col: "m", align: "left", hl: "bg", stress: 1, ipa: 1, voice: "us", rate: 0.9, autoSay: 0, goal: 30, apiKey: "", model: "claude-haiku-5-5", autoAI: 0, hideBar: 1 };
let SET = Object.assign({}, DEF, LS.get("sc_set", {}));
function saveSet() { LS.set("sc_set", SET); applyTheme() }
function hexA(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})` }
function applyTheme() {
  const s = SKINS[SET.skin] || SKINS.graphite, A = ACCENTS[SET.accent] || ACCENTS.mint, ac = s.dark ? A.d : A.l;
  const r = document.documentElement.style;
  const v = { "--bg": s.bg, "--surface": s.surface, "--surface-2": s.s2, "--line": s.line, "--fg": s.fg, "--muted": s.muted, "--faint": s.faint,
    "--accent": ac, "--accent-ink": s.dark ? "#0A0D0C" : "#FFFFFF", "--accent-soft": hexA(ac, s.dark ? .15 : .12),
    "--hit": hexA(ac, s.dark ? .3 : .22), "--saved": s.dark ? "rgba(255,194,75,.2)" : "rgba(214,150,0,.18)",
    "--gold": s.dark ? "#FFC24B" : "#A86E00", "--gold-soft": s.dark ? "rgba(255,194,75,.14)" : "rgba(214,150,0,.12)",
    "--warn": s.dark ? "#FF7A66" : "#D9472F", "--warn-soft": s.dark ? "rgba(255,122,102,.14)" : "rgba(217,71,47,.1)",
    "--f-read": RFONTS[SET.rfont]?.[1] || RFONTS.literata[1], "--fs": SET.fs + "px", "--lh": SET.lh, "--col": (COLS[SET.col] || 640) + "px", "--align": SET.align === "justify" ? "justify" : "left" };
  const R = RSKINS[SET.rskin];
  if (R && R.bg) { v["--paper"] = R.bg; v["--paper-ink"] = R.ink; v["--paper-muted"] = R.muted; }
  else { v["--paper"] = s.bg; v["--paper-ink"] = s.fg; v["--paper-muted"] = s.muted; }
  for (const k in v) r.setProperty(k, v[k]);
  r.colorScheme = s.dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]').content = s.bg;
  const rd = $("#reader"); if (rd) { rd.style.colorScheme = (R && R.light) ? "light" : (R && R.bg) ? "dark" : ""; }
}
applyTheme();

/* ============ state ============ */
let ST = Object.assign({ xp: 0, days: {}, lessons: {}, pos: {}, mins: {}, lookups: 0, u: 0 }, LS.get("sc_state", {}));
let WORDS = LS.get("sc_words", {});
let MYB = LS.get("sc_books", {});
let tab = "read";
function saveState() { ST.u = Date.now(); LS.set("sc_state", ST) }
let FIDX = null;
function saveWords() { FIDX = null; LS.set("sc_words", WORDS) }
function putWord(w) { w.u = Date.now(); WORDS[w.key] = w; saveWords() }
const liveWords = () => Object.values(WORDS).filter(w => !w.del);
const dueWords = () => { const n = Date.now(); return liveWords().filter(w => (w.due || 0) <= n) };
const INTV = [0, 1, 2, 4, 8, 16, 32, 64];
function streak() { let n = 0, t = Date.now(); if (!(ST.days[dkey(t)] > 0)) t -= DAY; while (ST.days[dkey(t)] > 0) { n++; t -= DAY } return n }
function addXP(n, el) {
  ST.xp += n; const k = today(); ST.days[k] = (ST.days[k] || 0) + n; saveState(); refreshCounters();
  if (el && el.getBoundingClientRect) { const r = el.getBoundingClientRect(); const f = document.createElement("div"); f.className = "xpfly"; f.textContent = "+" + n; f.style.left = (r.left + r.width / 2 - 10) + "px"; f.style.top = (r.top - 6) + "px"; document.body.appendChild(f); setTimeout(() => f.remove(), 900) }
}
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2400) }
try { navigator.storage && navigator.storage.persist && navigator.storage.persist() } catch (e) {}

/* IndexedDB for book texts */
const IDB = {
  db: null,
  open() { return this.db ? Promise.resolve(this.db) : new Promise((res, rej) => { try { const r = indexedDB.open("slovochit", 1); r.onupgradeneeded = () => r.result.createObjectStore("books"); r.onsuccess = () => { this.db = r.result; res(r.result) }; r.onerror = () => rej(r.error) } catch (e) { rej(e) } }) },
  async get(k) { try { const db = await this.open(); return await new Promise(r => { const q = db.transaction("books").objectStore("books").get(k); q.onsuccess = () => r(q.result); q.onerror = () => r(null) }) } catch (e) { return null } },
  async put(k, v) { try { const db = await this.open(); await new Promise((r, j) => { const t = db.transaction("books", "readwrite"); t.objectStore("books").put(v, k); t.oncomplete = r; t.onerror = () => j(t.error) }); return true } catch (e) { return false } },
  async del(k) { try { const db = await this.open(); await new Promise(r => { const t = db.transaction("books", "readwrite"); t.objectStore("books").delete(k); t.oncomplete = r; t.onerror = r }) } catch (e) {} }
};

/* ============ dictionary ============ */
const SHARDS = {};
async function shard(l) {
  if (!/^[a-z]$/.test(l)) return {};
  if (SHARDS[l]) return SHARDS[l];
  SHARDS[l] = fetch("dict/" + l + ".json").then(r => r.ok ? r.json() : {}).catch(() => ({}));
  SHARDS[l] = await SHARDS[l]; return SHARDS[l];
}
async function rawEntry(w) { const s = await shard(w[0]); return s[w] }
// candidate base forms for a token
function cands(raw) {
  let w = raw.toLowerCase().replace(/[’‘]/g, "'"); const out = [w];
  const b = w.replace(/'s$/, "").replace(/s'$/, "s").replace(/'(ll|re|ve|d|m)$/, "").replace(/n't$/, ""); out.push(b);
  const push = x => { if (x && x.length > 1) out.push(x) };
  if (b.endsWith("ies")) push(b.slice(0, -3) + "y");
  if (b.endsWith("ied")) push(b.slice(0, -3) + "y");
  if (b.endsWith("es")) push(b.slice(0, -2));
  if (b.endsWith("s")) push(b.slice(0, -1));
  if (b.endsWith("ed")) { push(b.slice(0, -2)); push(b.slice(0, -1)); if (/(.)\1ed$/.test(b)) push(b.slice(0, -3)) }
  if (b.endsWith("ing")) { const s = b.slice(0, -3); push(s); push(s + "e"); if (/(.)\1$/.test(s)) push(s.slice(0, -1)); if (s.endsWith("y")) push(s.slice(0, -1) + "ie") }
  if (b.endsWith("er")) { push(b.slice(0, -2)); push(b.slice(0, -1)); if (/(.)\1er$/.test(b)) push(b.slice(0, -3)); if (b.endsWith("ier")) push(b.slice(0, -3) + "y") }
  if (b.endsWith("est")) { push(b.slice(0, -3)); push(b.slice(0, -2)); if (/(.)\1est$/.test(b)) push(b.slice(0, -4)); if (b.endsWith("iest")) push(b.slice(0, -4) + "y") }
  if (b.endsWith("ly")) { push(b.slice(0, -2)); if (b.endsWith("ily")) push(b.slice(0, -3) + "y") }
  return [...new Set(out)];
}
const CONTR = { "i'm": "I am — я (есть)", "you're": "you are", "we're": "we are", "they're": "they are", "he's": "he is или he has", "she's": "she is или she has", "it's": "it is или it has", "that's": "that is", "there's": "there is", "what's": "what is", "let's": "let us — давай(те)", "don't": "do not", "doesn't": "does not", "didn't": "did not", "isn't": "is not", "aren't": "are not", "wasn't": "was not", "weren't": "were not", "can't": "cannot — не может", "couldn't": "could not", "won't": "will not — не будет", "wouldn't": "would not", "shouldn't": "should not", "haven't": "have not", "hasn't": "has not", "hadn't": "had not", "i've": "I have", "you've": "you have", "we've": "we have", "they've": "they have", "i'll": "I will", "you'll": "you will", "he'll": "he will", "she'll": "she will", "we'll": "we will", "they'll": "they will", "i'd": "I would или I had", "you'd": "you would или you had", "he'd": "he would или he had", "she'd": "she would или she had", "we'd": "we would или we had", "they'd": "they would или they had", "mustn't": "must not — нельзя" };
const IRRV = "arise arose arisen;awake awoke awoken;be was/were been;bear bore born;beat beat beaten;become became become;begin began begun;bend bent bent;bite bit bitten;bleed bled bled;blow blew blown;break broke broken;bring brought brought;build built built;burn burnt burnt;burst burst burst;buy bought bought;catch caught caught;choose chose chosen;come came come;cost cost cost;creep crept crept;cut cut cut;deal dealt dealt;dig dug dug;do did done;draw drew drawn;dream dreamt dreamt;drink drank drunk;drive drove driven;eat ate eaten;fall fell fallen;feed fed fed;feel felt felt;fight fought fought;find found found;flee fled fled;fly flew flown;forget forgot forgotten;forgive forgave forgiven;freeze froze frozen;get got got;give gave given;go went gone;grow grew grown;hang hung hung;have had had;hear heard heard;hide hid hidden;hit hit hit;hold held held;hurt hurt hurt;keep kept kept;kneel knelt knelt;know knew known;lay laid laid;lead led led;learn learnt learnt;leave left left;lend lent lent;let let let;lie lay lain;light lit lit;lose lost lost;make made made;mean meant meant;meet met met;pay paid paid;put put put;quit quit quit;read read read;ride rode ridden;ring rang rung;rise rose risen;run ran run;say said said;see saw seen;seek sought sought;sell sold sold;send sent sent;set set set;shake shook shaken;shine shone shone;shoot shot shot;show showed shown;shrink shrank shrunk;shut shut shut;sing sang sung;sink sank sunk;sit sat sat;sleep slept slept;slide slid slid;speak spoke spoken;spend spent spent;spin spun spun;spread spread spread;stand stood stood;steal stole stolen;stick stuck stuck;sting stung stung;strike struck struck;swear swore sworn;sweep swept swept;swim swam swum;swing swung swung;take took taken;teach taught taught;tear tore torn;tell told told;think thought thought;throw threw thrown;understand understood understood;wake woke woken;wear wore worn;weep wept wept;win won won;write wrote written";
const IRR = {}; IRRV.split(";").forEach(t => { const [b, p, pp] = t.split(" "); IRR[b] = { p: p.replace("/", " / "), pp }; p.split("/").forEach(x => { IRR[x] = IRR[x] || { base: b, kind: "past" } }); if (pp !== p && !p.split("/").includes(pp)) IRR[pp] = IRR[pp] || { base: b, kind: "pp" } });
const IRRN = { children: "child", men: "man", women: "woman", feet: "foot", teeth: "tooth", mice: "mouse", geese: "goose", people: "person" };
function formNote(raw, lemma) {
  const w = raw.toLowerCase().replace(/[’]/g, "'");
  if (CONTR[w]) return `Сокращение: ${CONTR[w]}.`;
  if (/'s$/.test(w)) return `'s после существительного означает принадлежность: ${esc(raw.replace(/['’]s$/, ""))}'s — чей-то, «${esc(raw.replace(/['’]s$/, ""))}» в родительном падеже. После he, she, it, that 's может значить is или has.`;
  if (!lemma || lemma === w) return "";
  const ir = IRR[w];
  if (ir && ir.base === lemma) { const f = IRR[lemma]; const forms = f ? `${lemma} — ${f.p} — ${f.pp}` : ""; return (ir.kind === "past" ? `Прошедшее время (Past Simple) неправильного глагола <b>${lemma}</b>.` : `Третья форма (причастие) неправильного глагола <b>${lemma}</b>: используется в have ${w}, was ${w} и т. п.`) + (forms ? ` Три формы: ${forms}.` : "") }
  if (IRRN[w]) return `Множественное число от <b>${lemma}</b> (исключение из правил).`;
  if (lemma === "be") return { am: "am — форма глагола to be для I: I am.", is: "is — форма глагола to be для he, she, it: She is.", are: "are — форма глагола to be для you, we, they: They are.", was: "was — прошедшее время to be для I, he, she, it.", were: "were — прошедшее время to be для you, we, they.", been: "been — третья форма глагола to be: have been." }[w] || "";
  if (w === "has") return "has — форма have для he, she, it: She has a cat.";
  if (w === "does") return "does — форма do для he, she, it. В вопросах: Does she know?";
  if (w.endsWith("ing")) return `Форма на -ing от <b>${lemma}</b>: действие в процессе (is ${w} — «сейчас ${lemma}») или как существительное («${w}» — само действие).`;
  if (w.endsWith("ed") || w.endsWith("d") && lemma + "d" === w) return `Прошедшее время или причастие правильного глагола <b>${lemma}</b>: к глаголу добавили -ed.`;
  if (w.endsWith("est")) return `Превосходная степень от <b>${lemma}</b>: самый ${lemma}.`;
  if (w.endsWith("er") && !w.endsWith("eer")) return `Сравнительная степень от <b>${lemma}</b>: более ${lemma} (часто со словом than).`;
  if (w.endsWith("ly")) return `Наречие от <b>${lemma}</b>: отвечает на вопрос «как?».`;
  if (w.endsWith("s")) return `Окончание -s: множественное число существительного (${lemma} → ${w}) или глагол с he/she/it (she ${w}).`;
  return `Форма слова <b>${esc(lemma)}</b>.`;
}
// Resolve a token: returns {head, lemma, e, formOf}
async function lookup(raw) {
  const cs = cands(raw);
  for (const c of cs) {
    let e = await rawEntry(c); if (!e) continue;
    if (typeof e === "string") { const [lm, fi] = e.slice(1).split("|"); const le = await rawEntry(lm); if (le && typeof le !== "string") return { head: c, lemma: lm, e: le, formOf: true, ipa: fi || "" }; continue }
    // a real entry; if it's also a form (e.g. "left" ← leave) remember it
    return { head: c, lemma: c, e, alsoOf: e.l || null, formOf: c !== raw.toLowerCase() && c !== cs[0] };
  }
  for (const c of cs) { const m = await muEntry(c); if (m) return { head: c, lemma: c, e: { i: m[0], z: 30, c: muMain(m[1]), mu: 1 }, formOf: c !== raw.toLowerCase() && c !== cs[0] } }
  return null;
}
const stripStress = s => s.replace(/́/g, "");
const showRu = s => SET.stress ? s : stripStress(s);
function mainTr(e) { if (!e) return ""; if (e.c) return e.c; return e.t && e.t.length ? stripStress(e.t.slice(0, 2).map(x => x[0]).join(", ")) : "" }
function levelOf(z) { return z >= 55 ? "A1" : z >= 48 ? "A2" : z >= 42 ? "B1" : z >= 36 ? "B2" : "C1" }

/* ============ speech ============ */
let VOICES = [];
function loadVoices() { try { VOICES = speechSynthesis.getVoices() } catch (e) {} }
try { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices } catch (e) {}
function pickVoice() {
  const want = SET.voice === "uk" ? /en-GB/i : /en-US/i;
  return VOICES.find(v => want.test(v.lang) && /Samantha|Daniel|Karen|Serena|Arthur|Martha|Ava|Evan|Zoe|Google/i.test(v.name)) || VOICES.find(v => want.test(v.lang)) || VOICES.find(v => /^en/i.test(v.lang)) || null;
}
function say(t) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); const v = pickVoice(); u.lang = v ? v.lang : (SET.voice === "uk" ? "en-GB" : "en-US"); if (v) u.voice = v; u.rate = +SET.rate || .9; speechSynthesis.speak(u) } catch (e) { toast("Озвучка недоступна") } }
document.addEventListener("click", e => { const b = e.target.closest("[data-say]"); if (b) { e.stopPropagation(); e.preventDefault(); say(b.dataset.say); b.animate([{ transform: "scale(.85)" }, { transform: "scale(1)" }], { duration: 280, easing: "ease-out" }) } }, true);

/* ============ AI (optional, user's own API key) ============ */
const AIC = LS.get("sc_ai", {});
function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33 ^ s.charCodeAt(i)) >>> 0; return h.toString(36) }
async function askClaude(prompt, maxTokens) {
  if (!SET.apiKey) throw { code: "nokey" };
  if (!navigator.onLine) throw { code: "offline" };
  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": SET.apiKey.trim(), "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: SET.model || DEF.model, max_tokens: maxTokens || 800, messages: [{ role: "user", content: prompt }] }) });
  } catch (e) { throw { code: "offline" } }
  if (!res.ok) { let m = ""; try { m = (await res.json()).error?.message || "" } catch (e) {} throw { code: res.status === 401 ? "badkey" : res.status === 429 ? "limit" : res.status === 400 && /credit|balance/i.test(m) ? "money" : "api", msg: m } }
  const j = await res.json(); const t = (j.content || []).map(c => c.text || "").join("");
  const a = t.indexOf("{"), b = t.lastIndexOf("}"); if (a < 0 || b < a) throw { code: "api" };
  return JSON.parse(t.slice(a, b + 1));
}
function aiErr(e) {
  return { nokey: "Чтобы получать объяснения, добавьте ключ Claude API в Профиле → Объяснения ИИ.", offline: "Нет интернета. Объяснения работают онлайн, а словарь — всегда.", badkey: "Ключ API не подошёл. Проверьте его в настройках.", limit: "Слишком много запросов. Подождите минуту.", money: "На счёте API закончились средства. Пополните баланс в консоли Anthropic." }[e && e.code] || "Не удалось получить объяснение. Попробуйте ещё раз.";
}
async function explainWord(word, sentence) {
  const ck = word.toLowerCase() + "|" + hash(sentence); if (AIC[ck]) return AIC[ck];
  const r = await askClaude(`Ты — преподаватель английского для русскоговорящего ученика уровня A1–A2. Объясняй просто, по-русски.
Слово: "${word}"
Предложение: "${sentence}"
Ответь только JSON:
{"translation":"перевод именно в этом предложении","context":"1–2 предложения: что слово значит здесь и почему употреблено именно так","form":"если форма особая (время, число, степень, сокращение) — коротко объясни, иначе пустая строка","sentence_ru":"естественный перевод всего предложения","examples":[{"en":"простой пример","ru":"перевод"},{"en":"...","ru":"..."}]}`, 700);
  AIC[ck] = r; const ks = Object.keys(AIC); if (ks.length > 600) delete AIC[ks[0]]; LS.set("sc_ai", AIC); return r;
}

/* ============ sheet ============ */
const sheet = $("#sheet"), scrim = $("#scrim"); let onSheetClose = null;
function openSheet(html, onClose) { $("#sbody").innerHTML = html; $("#sbody").scrollTop = 0; sheet.style.transform = ""; sheet.classList.add("open"); scrim.classList.add("open"); onSheetClose = onClose || null }
function closeSheet() { sheet.classList.remove("open"); scrim.classList.remove("open"); sheet.style.transform = ""; const f = onSheetClose; onSheetClose = null; if (f) f() }
scrim.onclick = closeSheet;
(() => { let y0 = null, dy = 0; const g = $("#grab");
  g.addEventListener("touchstart", e => { y0 = e.touches[0].clientY; dy = 0; sheet.style.transition = "none" }, { passive: true });
  g.addEventListener("touchmove", e => { if (y0 == null) return; dy = Math.max(0, e.touches[0].clientY - y0); sheet.style.transform = `translateY(${dy}px)` }, { passive: true });
  g.addEventListener("touchend", () => { sheet.style.transition = ""; if (dy > 80) closeSheet(); else sheet.style.transform = ""; y0 = null });
  g.onclick = closeSheet; })();

/* ============ word card ============ */
function findSaved(raw) {
  for (const c of cands(raw)) if (WORDS[c] && !WORDS[c].del) return WORDS[c];
  if (!FIDX) { FIDX = {}; liveWords().forEach(w => (w.forms || []).forEach(f => FIDX[f] = w)) }
  return FIDX[raw.toLowerCase()] || null;
}
function markSentence(sent, word) { const i = sent.toLowerCase().indexOf(word.toLowerCase()); if (i < 0) return esc(sent); return esc(sent.slice(0, i)) + "<mark>" + esc(sent.slice(i, i + word.length)) + "</mark>" + esc(sent.slice(i + word.length)) }
function concordance(forms, exclude, curBook) {
  const out = []; const re = new RegExp("\\b(" + forms.map(f => f.replace(/[^a-z']/g, "")).filter(Boolean).join("|") + ")\\b", "i");
  const scan = (b, ps) => { for (const p of ps) { if (out.length >= 3) return; if (!re.test(p)) continue; for (const s of (p.match(/[^.!?]+[.!?]+["”’]?/g) || [p]).map(x => x.trim())) { if (out.length >= 3) return; if (re.test(s) && s !== exclude && s.length < 220 && !out.some(o => o.s === s)) out.push({ s, b: b.title }) } } };
  if (curBook) { for (const ch of curBook.chapters) { scan(curBook, ch.p || splitParas(ch.x || "")); if (out.length >= 3) break } }
  for (const b of BOOKS) { if (out.length >= 3) break; if (b.classic || (curBook && b.id === curBook.id)) continue; for (const ch of b.chapters) { scan(b, splitParas(ch.x || "")); if (out.length >= 3) break } }
  return out;
}
let WC = null; // current word card context
async function openWord(raw, sentence, src, nextWord) {
  ST.lookups = (ST.lookups || 0) + 1;
  WC = { raw, sentence, src, nextWord, more: false, ai: null, aiState: "" };
  openSheet('<div class="skel" style="height:30px;width:40%"></div><div class="skel" style="width:70%"></div>', () => { $$(".w.on").forEach(x => x.classList.remove("on")); WC = null });
  const res = await lookup(raw); if (!WC || WC.raw !== raw) return;
  WC.res = res;
  if (res && nextWord) { const nx = nextWord.toLowerCase().split(" "); const bases = [...new Set([res.lemma, raw.toLowerCase()])];
    for (const n of [nx.slice(0, 2).join(" "), nx[0]]) for (const b0 of bases) { if (WC.phrase || !n) continue; const ph = b0 + " " + n; const pe = await rawEntry(ph); if (pe && typeof pe !== "string") WC.phrase = { head: ph, e: pe } } }
  WC.conc = concordance([raw.toLowerCase(), res ? res.lemma : raw.toLowerCase()], sentence, RD && RD.book);
  const t = today(); ST.seen = ST.seen || {}; if (ST.seen.d !== t) ST.seen = { d: t, n: 0 }; if (ST.seen.n < 20) { ST.seen.n++; addXP(1) }
  renderWord();
  if (SET.autoSay) say(raw);
  if (SET.autoTr && sentence && sentence.split(" ").length > 2) runFreeTr(WC, renderWord);
  if (SET.autoAI && SET.apiKey && navigator.onLine && sentence && sentence.length > raw.length) runAI();
}
function renderWord() {
  if (!WC) return;
  const { raw, sentence, res } = WC; const e = res && res.e; const saved = findSaved(raw);
  const lemma = res ? res.lemma : raw.toLowerCase();
  const ipa = !SET.ipa || !e ? "" : res.formOf ? (res.ipa || (res.head === raw.toLowerCase() ? "" : "")) : (res.head === raw.toLowerCase() || raw.toLowerCase().replace(/[’']s$/, "") === res.head ? e.i || "" : "");
  const note = formNote(raw, lemma);
  let h = `<div class="wh"><div style="flex:1;min-width:0"><div class="word">${esc(raw)}</div><div class="ipa">${esc(ipa)}${lemma !== raw.toLowerCase() ? `${ipa ? " · " : ""}от <b>${esc(lemma)}</b>` : ""}${e ? ` · ${levelOf(e.z || 0)}` : ""}</div></div><button class="say" data-say="${esc(raw)}" aria-label="Произнести">${IC.sound}</button></div>`;
  if (!e) {
    h += `<div class="main-tr" style="color:var(--muted)">Нет в словаре</div><p class="note">Похоже, это имя, название или редкое слово.${SET.apiKey ? " Нажмите «Объяснить» — ИИ разберёт его в контексте." : ""}</p>`;
  } else {
    const main = mainTr(e); h += `<div class="main-tr">${esc(main)}</div>`;
    const trs = (e.t || []); const shown = WC.more ? trs : trs.slice(0, 4);
    if (shown.length) h += `<div class="trs">${shown.map(t => `<div class="tr-row">${esc(showRu(t[0]))}<span>${esc(t[1])}</span></div>`).join("")}</div>${trs.length > 4 && !WC.more ? `<button class="more" id="wMore">Ещё ${trs.length - 4} ${plural(trs.length - 4, "значение", "значения", "значений")}</button>` : ""}`;
  }
  h += `<div id="wMu"></div>`;
  if (res && res.alsoOf) h += `<p class="note">Также это форма глагола <b>${esc(res.alsoOf)}</b>: ${formNote(raw, res.alsoOf)}</p>`;
  if (WC.phrase) h += `<div class="phr"><button id="wPhr">«${esc(WC.phrase.head)}» — ${esc(mainTr(WC.phrase.e))}</button></div>`;
  if (sentence && sentence !== raw) h += `<div class="box"><h4>В этом предложении</h4><div class="sent">${markSentence(sentence, raw)}</div>${trBlock(WC)}${note ? `<p style="margin-top:8px">${note}</p>` : ""}</div>`;
  else if (note) h += `<div class="box"><h4>Форма слова</h4><p>${note}</p></div>`;
  // AI box
  if (WC.aiState === "load") h += `<div class="box ai"><h4>Объяснение</h4><div class="skel" style="width:85%"></div><div class="skel" style="width:65%"></div><div class="skel" style="width:75%"></div></div>`;
  else if (WC.aiState === "err") h += `<div class="box ai"><h4>Объяснение</h4><p>${esc(WC.aiErr)}</p></div>`;
  else if (WC.ai) { const a = WC.ai; h += `<div class="box ai"><h4>Объяснение</h4>${a.translation ? `<p><b>${esc(a.translation)}</b></p>` : ""}${a.context ? `<p style="margin-top:6px">${esc(a.context)}</p>` : ""}${a.form ? `<p style="margin-top:6px">${esc(a.form)}</p>` : ""}${a.sentence_ru ? `<p class="note">Всё предложение: ${esc(a.sentence_ru)}</p>` : ""}${(a.examples || []).length ? `<div style="margin-top:8px">${a.examples.map(x => `<div class="ex"><div><b>${esc(x.en)}</b><span>${esc(x.ru)}</span></div><button class="say sm" data-say="${esc(x.en)}" aria-label="Произнести">${IC.sound}</button></div>`).join("")}</div>` : ""}</div>` }
  if (e && e.n) h += `<div class="box"><h4>Как употребляется</h4><p>${esc(e.n)}</p></div>`;
  if (e && e.e && e.e.length) h += `<div class="box"><h4>Примеры</h4>${e.e.map(x => `<div class="ex"><div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div><button class="say sm" data-say="${esc(x[0])}" aria-label="Произнести">${IC.sound}</button></div>`).join("")}</div>`;
  if (WC.conc && WC.conc.length) h += `<div class="box"><h4>Встречается в книгах</h4>${WC.conc.map(c => `<div class="ex"><div><b>${markSentence(c.s, raw)}</b><span>${esc(c.b)}</span></div></div>`).join("")}</div>`;
  if (e && e.ph) h = h.replace('<div class="main-tr">', '<div class="tags" style="margin-top:12px"><span class="tag">фразовый глагол / выражение</span></div><div class="main-tr">');
  h += `<div class="acts">${saved ? `<button class="btn soft" id="wDel">${IC.check} В словаре</button>` : `<button class="btn primary" id="wSave" ${!e && !WC.ai ? "disabled" : ""}>Добавить в словарь</button>`}${sentence && sentence !== raw && !WC.ai && WC.aiState !== "load" ? `<button class="btn soft" id="wAI">${IC.spark} Объяснить</button>` : ""}${sentence && sentence !== raw && sentence.split(" ").length > 2 ? `<button class="btn soft" id="wSent">Разобрать предложение</button>` : ""}</div>`;
  $("#sbody").innerHTML = h;
  const m = $("#wMore"); if (m) m.onclick = () => { WC.more = true; renderWord() };
  bindTr(WC, renderWord); fillMueller(WC);
  const ph = $("#wPhr"); if (ph) ph.onclick = () => { const p = WC.phrase; WC.res = { head: p.head, lemma: p.head, e: p.e }; WC.raw = p.head; WC.phrase = null; WC.conc = null; renderWord() };
  const sb = $("#wSent"); if (sb) sb.onclick = () => openPhrase(WC.sentence, WC.sentence, WC.src);
  const s = $("#wSave"); if (s) s.onclick = () => saveWordFromCard(s);
  const d = $("#wDel"); if (d) d.onclick = () => { const w = findSaved(WC.raw); if (w) { putWord(Object.assign(w, { del: true })); toast("Убрано из словаря"); markSaved(); renderWord(); refreshCounters() } };
  const a = $("#wAI"); if (a) a.onclick = runAI;
}
async function runAI() {
  if (!WC) return; const ctx = WC;
  if (!SET.apiKey) { ctx.aiState = "err"; ctx.aiErr = aiErr({ code: "nokey" }); renderWord(); return }
  ctx.aiState = "load"; renderWord();
  try { const r = await explainWord(ctx.raw, ctx.sentence); if (WC !== ctx) return; ctx.ai = r; ctx.aiState = "" } catch (e) { if (WC !== ctx) return; ctx.aiState = "err"; ctx.aiErr = aiErr(e) }
  renderWord();
}
function saveWordFromCard(btn) {
  const { raw, sentence, res, ai, src } = WC; const e = res && res.e;
  const lemma = res ? res.lemma : raw.toLowerCase(); const key = lemma.toLowerCase();
  const tr = (e && mainTr(e)) || (ai && ai.translation) || "";
  const w = { key, w: raw, lemma, tr, alts: e && e.t ? e.t.slice(0, 4).map(t => stripStress(t[0])) : [], ipa: e && e.i || "", sent: sentence || "", src: src || "", note: e && e.n || "", ex: (e && e.e ? e.e.slice(0, 2) : []).concat(ai && ai.examples ? ai.examples.slice(0, 2).map(x => [x.en, x.ru]) : []), ctx: ai && ai.context || "", box: 0, due: Date.now(), added: Date.now(), forms: [...new Set([raw.toLowerCase(), key])] };
  putWord(w); addXP(2, btn); markSaved(); renderWord(); refreshCounters();
}

/* ============ covers ============ */
function hueOf(id) { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360; return h }
function coverStyle(b) { const h = b.hue ? b.hue[0] : hueOf(b.id); const dark = (SKINS[SET.skin] || {}).dark; return `--c1:linear-gradient(155deg,hsl(${h} ${dark ? 38 : 45}% ${dark ? 34 : 46}%),hsl(${(b.hue ? b.hue[1] : h + 30)} ${dark ? 42 : 50}% ${dark ? 20 : 32}%))` }
function coverHTML(b, mini) { return mini ? `<div class="cover mini" style="${coverStyle(b)}"></div>` : `<div class="cover" style="${coverStyle(b)}"><span class="lv">${esc(b.level)}</span><span class="ct">${esc(b.title)}</span></div>` }

/* ============ tabs ============ */
function refreshCounters() { const n = dueWords().length; const b = $("#dueBadge"); b.hidden = !n; b.textContent = n > 99 ? "99+" : n; const s = $("#cStreak"), x = $("#cXp"); if (s) s.textContent = streak(); if (x) x.textContent = ST.xp }
function header(title, sub) { return `<div class="top"><div><small>${esc(sub)}</small><h1>${esc(title)}</h1></div><div class="stats-inline"><span style="color:var(--gold)">${IC.fire}<b id="cStreak">${streak()}</b></span><span style="color:var(--accent)">${IC.bolt}<b id="cXp">${ST.xp}</b></span></div></div>` }
function ring(v, max) { const r = 22, c = 2 * Math.PI * r, p = Math.min(1, v / max); return `<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="6"/><circle cx="26" cy="26" r="${r}" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" style="transition:stroke-dashoffset .8s var(--ease)"/></svg>` }
function allBooks() { return [...BOOKS.map(b => Object.assign({ mine: 0 }, b)), ...Object.values(MYB).filter(m => !m.del).sort((a, b) => (b.added || 0) - (a.added || 0)).map(m => Object.assign({ level: "Моя", mine: 1 }, m))] }
function bookProgress(b) { const p = ST.pos[b.id]; if (!p) return 0; const n = (b.chapters || []).length || 1; return Math.min(1, ((p.ch || 0) + (p.f || 0)) / n) }
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;

function renderRead() {
  const t = ST.days[today()] || 0, goal = SET.goal;
  const last = Object.entries(ST.pos).sort((a, b) => (b[1].t || 0) - (a[1].t || 0)).find(([id]) => allBooks().some(b => b.id === id));
  const lb = last && allBooks().find(b => b.id === last[0]);
  const hr = new Date().getHours(); const hi = hr < 6 ? "Доброй ночи" : hr < 12 ? "Доброе утро" : hr < 18 ? "Добрый день" : "Добрый вечер";
  let h = header("Книги", hi);
  if (!isStandalone() && !LS.get("sc_hideInstall", 0) && /iPhone|iPad|Macintosh/.test(navigator.userAgent) && "ontouchend" in document) h += `<div class="panel install"><span class="ic" style="color:var(--accent)">${IC.share}</span><div style="flex:1"><b>Установите на экран «Домой»</b><p>Нажмите «Поделиться» в Safari, затем «На экран Домой». Приложение откроется на весь экран и будет работать без интернета.</p></div><button class="ib" id="hideInst" aria-label="Скрыть">${IC.close}</button></div>`;
  const wk = []; for (let i = 6; i >= 0; i--) { const v = ST.days[dkey(Date.now() - i * DAY)] || 0; wk.push(v >= goal ? '<i class="on"></i>' : v > 0 ? `<i class="part" style="--p:${Math.round(v / goal * 100)}%"></i>` : "<i></i>") }
  h += `<div class="panel today"><div class="ring">${ring(t, goal)}<b>${Math.min(t, goal)}</b></div><div><h3>${t >= goal ? "Цель на сегодня выполнена" : "Сегодня " + t + " из " + goal + " XP"}</h3><p>${t >= goal ? "Серия продолжается" : "Читайте, нажимайте на слова, повторяйте"}</p></div><div class="week" aria-label="Последние 7 дней">${wk.join("")}</div></div>`;
  if (lb) { const pr = bookProgress(lb); h += `<button class="panel cont" data-open="${lb.id}">${coverHTML(lb, 1)}<div class="info"><small>Продолжить</small><h3>${esc(lb.title)}</h3><div class="sub">Глава ${(last[1].ch || 0) + 1} из ${(lb.chapters || []).length}</div><div class="bar"><i style="width:${Math.round(pr * 100)}%"></i></div></div></button>` }
  const mine = allBooks().filter(b => b.mine);
  h += `<div class="sec"><h2>Мои книги</h2><span>${mine.length ? mine.length + " " + plural(mine.length, "книга", "книги", "книг") : ""}</span></div><button class="upload" id="upBtn"><span class="ic">${IC.up}</span><span><h3>Загрузить книгу</h3><p>TXT, EPUB, FB2 или PDF. Книга сохранится на устройстве</p></span></button>`;
  if (mine.length) h += `<div class="shelf" style="margin-top:16px">${mine.map(bookTile).join("")}</div>`;
  const LV = { all: () => true, a: b => /^A/.test(b.level), b1: b => /^B1/.test(b.level), b2: b => /^B2/.test(b.level) };
  h += `<div class="sec"><h2>Библиотека</h2><span>${BOOKS.length} книг</span></div><div class="chips" style="margin-bottom:14px">${[["all", "Все"], ["a", "A1–A2"], ["b1", "B1"], ["b2", "B2+"]].map(([k, n]) => `<button class="chip ${libF === k ? "on" : ""}" data-lib="${k}">${n}</button>`).join("")}</div><div class="shelf">${BOOKS.filter(LV[libF] || LV.all).map(bookTile).join("")}</div>`;
  return h;
}
let libF = "all";
const readTime = b => { const m = Math.round((b.words || 0) / 130); return m < 60 ? m + " мин" : Math.round(m / 60) + " ч" };
function bookTile(b) { const pr = bookProgress(b); return `<button class="book" data-open="${b.id}">${coverHTML(b)}<div><div class="bt">${esc(b.title)}</div><div class="ba">${esc(b.author || "")}</div><div class="ba">${pr > 0 ? `прочитано ${Math.round(pr * 100)}%` : b.words ? `${(b.chapters || []).length} ${plural((b.chapters || []).length, "глава", "главы", "глав")} · ${readTime(b)}` : ""}</div></div></button>` }

let dFilter = "all";
function renderDict() {
  const ws = liveWords(), due = dueWords().length, learned = ws.filter(w => (w.box || 0) >= 4).length;
  let h = header("Словарь", "35 000 слов всегда под рукой");
  h += `<div class="lookup"><label class="search">${IC.search}<input id="lq" type="search" placeholder="Найти английское слово" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></label></div>`;
  if (!ws.length) return h + setsBlock() + `<div class="sec"><h2>Мои слова</h2><span></span></div><div class="panel empty"><div class="big-ic">${IC.cards}</div><h3>Здесь будут ваши слова</h3><p>Откройте книгу, нажмите на незнакомое слово и добавьте его в словарь. Потом повторяйте карточки, и слова запомнятся.</p><button class="btn primary" data-open="anna">Начать с «Anna's New Home»</button></div>`;
  h += `<div class="dstats"><div class="panel dstat"><b>${ws.length}</b><span>${plural(ws.length, "слово", "слова", "слов")}</span></div><div class="panel dstat"><b>${ws.length - learned}</b><span>учу</span></div><div class="panel dstat"><b>${learned}</b><span>выучено</span></div></div>`;
  h += `<div class="modes"><button class="panel mode" id="mCards"><span class="ic" style="background:var(--gold-soft);color:var(--gold)">${IC.cards}</span><span><h3>Карточки</h3><p>${due ? `${due} на повторение` : "Всё повторено"}</p></span></button><button class="panel mode" id="mQuiz"><span class="ic" style="background:var(--accent-soft);color:var(--accent)">${IC.quiz}</span><span><h3>Тест</h3><p>Выбрать перевод</p></span></button></div>`;
  h += setsBlock();
  h += `<div class="sec"><h2>Мои слова</h2><span></span></div><label class="search">${IC.search}<input id="dq" type="search" placeholder="Поиск по моим словам" autocomplete="off" autocapitalize="off"></label><div class="chips" style="margin-bottom:12px"><button class="chip ${dFilter === "all" ? "on" : ""}" data-f="all">Все</button><button class="chip ${dFilter === "learn" ? "on" : ""}" data-f="learn">Учу</button><button class="chip ${dFilter === "done" ? "on" : ""}" data-f="done">Выучено</button><button class="chip ${dFilter === "due" ? "on" : ""}" data-f="due">К повторению</button></div><div class="panel list" id="dlist"></div>`;
  return h;
}
function fillDict() {
  const el = $("#dlist"); if (!el) return; const q = ($("#dq")?.value || "").trim().toLowerCase(); const n = Date.now();
  let ws = liveWords().sort((a, b) => (b.added || 0) - (a.added || 0));
  if (dFilter === "learn") ws = ws.filter(w => (w.box || 0) < 4); if (dFilter === "done") ws = ws.filter(w => (w.box || 0) >= 4); if (dFilter === "due") ws = ws.filter(w => (w.due || 0) <= n);
  if (q) ws = ws.filter(w => (w.key + " " + w.w + " " + w.tr).toLowerCase().includes(q));
  el.innerHTML = ws.length ? ws.slice(0, 400).map(w => `<button class="row" data-word="${esc(w.key)}"><span class="rw"><b>${esc(w.lemma || w.w)}</b><span>${esc(w.tr)}</span></span><span class="dots">${[0, 1, 2, 3].map(i => `<i class="${(w.box || 0) > i ? "f" : ""}"></i>`).join("")}</span></button>`).join("") : `<p style="padding:18px;color:var(--muted)">Ничего не найдено</p>`;
}

function renderLearn() {
  const total = UNITS.reduce((a, u) => a + u.ls.length, 0), done = Object.values(ST.lessons).filter(l => l.done).length;
  let h = header("Уроки", `Пройдено ${done} из ${total}`);
  UNITS.forEach((u, ui) => {
    h += `<div class="unit"><div class="unit-h"><span class="n">0${ui + 1}</span><div><h2>${esc(u.t)}</h2><p>${esc(u.d)}</p></div></div><div class="panel lessons">`;
    u.ls.forEach((l, li) => { const st = ST.lessons[l.id]; h += `<button class="lesson" data-lesson="${l.id}"><span class="st ${st && st.done ? "done" : ""}">${st && st.done ? IC.check : li + 1}</span><span class="lt"><b>${esc(l.t)}</b><span>${esc(l.d)}${st && st.done ? ` · ${st.score}/${l.q.length}` : ""}</span></span><span style="color:var(--faint)">${IC.chev.replace("<svg", '<svg width="18" height="18"')}</span></button>` });
    h += `</div></div>`;
  });
  return h;
}

function renderMe() {
  const ws = liveWords(), learned = ws.filter(w => (w.box || 0) >= 4).length, mins = Object.values(ST.mins || {}).reduce((a, b) => a + b, 0);
  let h = header("Профиль", "Прогресс и настройки");
  h += `<div class="sgrid"><div class="panel sbox"><div class="v">${streak()}</div><div class="k">${plural(streak(), "день", "дня", "дней")} подряд</div></div><div class="panel sbox"><div class="v">${ST.xp}</div><div class="k">опыта</div></div><div class="panel sbox"><div class="v">${ws.length}</div><div class="k">слов в словаре</div></div><div class="panel sbox"><div class="v">${mins}</div><div class="k">минут чтения</div></div></div>`;
  const days = []; for (let i = 6; i >= 0; i--) { const t = Date.now() - i * DAY; days.push({ k: dkey(t), d: new Date(t) }) }
  const vals = days.map(d => ST.days[d.k] || 0), goal = SET.goal, max = Math.max(goal, ...vals) * 1.15, W = 340, H = 140, pb = 22, pt = 14, step = (W - 12) / 7, bw = 26;
  const y = v => H - pb - (v / max) * (H - pb - pt); const wd = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"]; let bars = "";
  days.forEach((d, i) => { const v = vals[i], x = 6 + i * step + (step - bw) / 2, hh = Math.max(3, (H - pb) - y(v)); bars += `<rect x="${x}" y="${(H - pb) - hh}" width="${bw}" height="${hh}" rx="6" fill="${v >= goal ? "var(--accent)" : v > 0 ? "var(--muted)" : "var(--surface-2)"}" opacity="${v >= goal ? 1 : v > 0 ? .55 : 1}"/><text x="${x + bw / 2}" y="${H - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--muted)" font-family="Manrope,sans-serif">${i === 6 ? "сег" : wd[d.d.getDay()]}</text>${v ? `<text x="${x + bw / 2}" y="${(H - pb) - hh - 5}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--fg)" font-family="Manrope,sans-serif">${v}</text>` : ""}` });
  h += `<div class="sec"><h2>Неделя</h2><span>XP по дням · цель ${goal}</span></div><div class="panel chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Опыт за последние 7 дней"><line x1="4" x2="${W - 4}" y1="${y(goal)}" y2="${y(goal)}" stroke="var(--accent)" stroke-dasharray="3 5" stroke-width="1.2" opacity=".6"/>${bars}</svg></div>`;
  const lv = [["A1", 300], ["A2", 800], ["B1", 1600], ["B2", 3000]];
  h += `<div class="sec"><h2>Путь к уровню</h2><span>выученные слова</span></div><div class="panel" style="padding:6px 0">${lv.map(([n, c], i) => { const prev = i ? lv[i - 1][1] : 0, p = Math.max(0, Math.min(1, (learned - prev) / (c - prev))); return `<div class="lvrow"><span class="lb">${n}</span><div class="bar"><i style="width:${p * 100}%"></i></div><small>${Math.min(learned, c)} / ${c}</small></div>` }).join("")}<p class="note" style="padding:0 16px 10px">Слово считается выученным после четырёх удачных повторений.</p></div>`;
  const row = (id, title, sub, val) => `<button class="set" data-page="${id}"><span class="k"><b>${title}</b><small>${sub}</small></span><span class="v">${val || ""}${IC.chev}</span></button>`;
  h += `<div class="sec"><h2>Настройки</h2><span></span></div><div class="panel">${row("look", "Оформление", "Тема, цвет акцента", SKINS[SET.skin].n)}${row("reading", "Чтение", "Шрифт, размер, интервал, ширина", RFONTS[SET.rfont][0])}${row("trans", "Перевод и озвучка", "Голос, ударения, транскрипция", SET.voice === "uk" ? "Британский" : "Американский")}${row("mt", "Перевод предложений", "Бесплатно: онлайн или на устройстве", { auto: "авто", online: "онлайн", device: "на устройстве", off: "выкл." }[SET.mt])}${row("ai", "Объяснения ИИ", "Ключ Claude API для разбора в контексте", SET.apiKey ? "включены" : "выкл.")}${row("goal", "Цель на день", "Сколько опыта набирать", SET.goal + " XP")}</div>`;
  h += `<div class="sec"><h2>Данные</h2><span>iPad ↔ iPhone</span></div><div class="panel">${row("backup", "Копия в iCloud", "Сохранить или загрузить словарь, прогресс и книги", "")}<div class="set"><span class="k"><b>Язык обучения</b><small>Итальянский появится следующим</small></span><span class="v">English</span></div></div>`;
  h += `<div class="panel src" style="margin-top:12px">Словарь собран из открытых данных <a href="https://en.openrussian.org" target="_blank" rel="noopener">OpenRussian</a> (CC BY-SA 4.0), транскрипции — CMU Pronouncing Dictionary. Работает без интернета.</div>`;
  return h;
}

function render() {
  const m = $("#main");
  m.innerHTML = `<div class="view">${tab === "read" ? renderRead() : tab === "dict" ? renderDict() : tab === "learn" ? renderLearn() : renderMe()}</div>`;
  $$(".tab").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  refreshCounters();
  if (tab === "read") { $$("[data-lib]").forEach(c => c.onclick = () => { libF = c.dataset.lib; render() }); $("#upBtn").onclick = () => $("#file").click(); const hi = $("#hideInst"); if (hi) hi.onclick = () => { LS.set("sc_hideInstall", 1); render() } }
  if (tab === "dict") {
    fillDict(); const dq = $("#dq"); if (dq) dq.oninput = fillDict;
    $$("[data-f]").forEach(c => c.onclick = () => { dFilter = c.dataset.f; $$("[data-f]").forEach(x => x.classList.toggle("on", x === c)); fillDict() });
    $$("[data-set]").forEach(b => b.onclick = () => openSet(b.dataset.set));
    const mc = $("#mCards"); if (mc) mc.onclick = () => startReview("cards"); const mq = $("#mQuiz"); if (mq) mq.onclick = () => startReview("quiz");
    const lq = $("#lq"); lq.onkeydown = e => { if (e.key === "Enter") { const v = lq.value.trim(); if (v) { lq.blur(); openWord(v, "", "Поиск") } } };
  }
}
$("#tabs").addEventListener("click", e => { const b = e.target.closest(".tab"); if (!b) return; if (tab === b.dataset.tab) { window.scrollTo({ top: 0, behavior: "smooth" }); return } tab = b.dataset.tab; window.scrollTo(0, 0); render() });
document.addEventListener("click", e => {
  const o = e.target.closest("[data-open]"); if (o) { openBook(o.dataset.open); return }
  const l = e.target.closest("[data-lesson]"); if (l) { openLesson(l.dataset.lesson); return }
  const p = e.target.closest("[data-page]"); if (p) { openSettings(p.dataset.page); return }
  const w = e.target.closest("[data-word]"); if (w) { const x = WORDS[w.dataset.word]; if (x) openWord(x.lemma || x.w, x.sent || "", x.src || "") }
});

/* ============ layers ============ */
function openLayer(id, html) { const L = $(id); L.innerHTML = html; L.scrollTop = 0; requestAnimationFrame(() => L.classList.add("open")); document.body.style.overflow = "hidden"; return L }
function closeLayer(id) { const L = $(id); L.classList.remove("open"); if (!$("#reader").classList.contains("open") && !$("#layer").classList.contains("open")) document.body.style.overflow = ""; setTimeout(() => { if (!L.classList.contains("open")) L.innerHTML = "" }, 420) }

/* ============ reader ============ */
let RD = null;
function splitParas(x) { return x.split(/\n\s*\n/).map(s => s.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean) }
const BCACHE = {};
async function getBook(id) { const b = BOOKS.find(x => x.id === id);
  if (b && b.classic) { if (BCACHE[id]) return BCACHE[id]; try { const r = await fetch("books/" + id + ".json"); if (!r.ok) throw 0; const full = await r.json(); BCACHE[id] = Object.assign({}, b, full); return BCACHE[id] } catch (e) { toast("Не удалось открыть книгу. Подключитесь к интернету один раз, чтобы она сохранилась."); return null } }
  if (b) return b; const full = await IDB.get(id); if (!full) { toast("Книга не найдена на этом устройстве"); return null } return Object.assign({ level: "Моя", mine: 1 }, MYB[id] || {}, full) }
async function openBook(id, ch) {
  const b = await getBook(id); if (!b) return;
  const pos = ST.pos[id] || { ch: 0, p: 0 };
  RD = { book: b, ch: ch != null ? ch : Math.min(pos.ch || 0, b.chapters.length - 1), act: Date.now() };
  const L = openLayer("#reader", `<div class="lbar" id="rbar"><button class="ib" id="rBack" aria-label="Назад">${IC.back}</button><div class="t">${esc(b.title)}</div><button class="ib" id="rFont" aria-label="Вид текста">${IC.aa}</button><button class="ib" id="rToc" aria-label="Оглавление">${IC.list}</button></div><article class="reader hl-${SET.hl}" id="rd"></article><div class="rprog"><i id="rp"></i></div>`);
  applyTheme();
  $("#rBack").onclick = closeReader; $("#rToc").onclick = showToc; $("#rFont").onclick = () => openSettings("reading", true);
  renderChapter(ch != null ? 0 : (pos.p || 0));
  L.onscroll = onReadScroll;
  clearInterval(openBook.t); openBook.t = setInterval(() => { if (RD && document.visibilityState === "visible" && Date.now() - RD.act < 120000) { const k = today(); ST.mins[k] = (ST.mins[k] || 0) + 1; addXP(1) } }, 60000);
}
function closeReader() { clearInterval(openBook.t); if (RD && RD.io) RD.io.disconnect(); RD = null; closeLayer("#reader"); render() }
function renderChapter(startP) {
  const b = RD.book, ch = b.chapters[RD.ch], ps = ch.p || splitParas(ch.x || ""); RD.ps = ps;
  const el = $("#rd"); const first = !Object.keys(ST.pos).length;
  el.innerHTML = `<div class="chn">Глава ${RD.ch + 1} из ${b.chapters.length}</div><h2>${esc(ch.t || "Глава " + (RD.ch + 1))}</h2>${first ? `<div class="hint">${IC.check} Нажмите на любое слово — появится перевод</div>` : ""}<div class="txt" id="txt" lang="en">${ps.map((p, i) => `<p data-i="${i}">${esc(p)}</p>`).join("")}</div><div class="chnav">${RD.ch > 0 ? `<button class="btn soft" id="cPrev">Назад</button>` : ""}${RD.ch < b.chapters.length - 1 ? `<button class="btn primary" id="cNext">Следующая глава</button>` : `<button class="btn primary" id="cEnd">Книга прочитана</button>`}</div>`;
  if (RD.io) RD.io.disconnect();
  RD.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tokenize(e.target) }), { root: $("#reader"), rootMargin: "700px 0px" });
  el.querySelectorAll("#txt p").forEach(p => RD.io.observe(p));
  const cp = $("#cPrev"); if (cp) cp.onclick = () => goCh(RD.ch - 1);
  const cn = $("#cNext"); if (cn) cn.onclick = e => { addXP(5, e.currentTarget); goCh(RD.ch + 1) };
  const ce = $("#cEnd"); if (ce) ce.onclick = e => { addXP(10, e.currentTarget); ST.pos[b.id] = { ch: RD.ch, p: 0, f: 1, t: Date.now() }; saveState(); toast("Поздравляем! Книга прочитана"); setTimeout(closeReader, 600) };
  const L = $("#reader");
  if (startP > 0) { const t = el.querySelector(`p[data-i="${startP}"]`); if (t) { tokenize(t); requestAnimationFrame(() => { L.scrollTop = t.offsetTop - 80 }) } } else L.scrollTop = 0;
  savePos(startP || 0);
}
function goCh(n) { RD.ch = n; renderChapter(0); $("#reader").scrollTo({ top: 0 }) }
function savePos(p) { if (!RD) return; const n = RD.ps.length || 1; ST.pos[RD.book.id] = { ch: RD.ch, p, f: Math.min(.99, p / n), t: Date.now() }; saveState() }
let scT = 0, lastY = 0;
function onReadScroll() {
  if (!RD) return; RD.act = Date.now(); const L = $("#reader"); const max = L.scrollHeight - L.clientHeight; $("#rp").style.width = (max > 0 ? L.scrollTop / max * 100 : 0) + "%";
  if (SET.hideBar) { const y = L.scrollTop; $("#rbar").classList.toggle("hide", y > lastY + 4 && y > 120); if (y < lastY - 4) $("#rbar").classList.remove("hide"); lastY = y }
  clearTimeout(scT); scT = setTimeout(() => { if (!RD) return; let cur = 0; for (const p of $$("#txt p")) { if (p.offsetTop - L.scrollTop > 90) break; cur = +p.dataset.i } savePos(cur) }, 400);
}
const WRE = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-z]+)*/g;
function tokenize(p) {
  if (p.dataset.tk) return; p.dataset.tk = 1; const t = p.textContent; let h = "", last = 0, m; WRE.lastIndex = 0;
  while ((m = WRE.exec(t))) { h += esc(t.slice(last, m.index)) + `<span class="w${findSaved(m[0]) ? " saved" : ""}" data-o="${m.index}">${esc(m[0])}</span>`; last = m.index + m[0].length }
  h += esc(t.slice(last)); p.innerHTML = h;
}
function markSaved() { $$("#txt .w").forEach(s => s.classList.toggle("saved", !!findSaved(s.textContent))) }
function sentenceAt(text, off) { let s = 0; const re = /[.!?…]+["”’)]*\s+/g; let m; while ((m = re.exec(text))) { const end = m.index + m[0].length; if (end <= off) s = end; else break } re.lastIndex = off; const n = re.exec(text); return text.slice(s, n ? n.index + n[0].length : text.length).trim() }
$("#reader").addEventListener("click", e => {
  if (!RD) return; RD.act = Date.now(); if (e.target.closest(".lbar,.chnav,.hint")) return;
  let w = e.target.closest(".w");
  if (!w) { const p = e.target.closest("#txt p"); if (p && !p.dataset.tk) { tokenize(p); const el = document.elementFromPoint(e.clientX, e.clientY); w = el && el.closest(".w") } }
  if (!w) { $("#rbar").classList.toggle("hide"); return }
  $$(".w.on").forEach(x => x.classList.remove("on")); w.classList.add("on");
  const p = w.closest("p"); const sent = sentenceAt(p.textContent, +w.dataset.o);
  const after = p.textContent.slice(+w.dataset.o + w.textContent.length).match(/^\s+([A-Za-z'’]+)(?:\s+([A-Za-z'’]+))?/);
  openWord(w.textContent, sent, RD.book.title, after ? [after[1], after[2]].filter(Boolean).join(" ") : null);
});
function showToc() {
  const b = RD.book;
  openSheet(`<h3 style="font:700 19px var(--f-head);margin:2px 0 10px">Оглавление</h3><div class="list">${b.chapters.map((c, i) => `<button class="row" data-ch="${i}"><span class="rw"><b style="${i === RD.ch ? "color:var(--accent)" : ""}">${i + 1}. ${esc(c.t || "Глава " + (i + 1))}</b></span></button>`).join("")}</div>${b.mine ? `<button class="btn warn block" id="delBook" style="margin-top:16px">${IC.trash} Удалить книгу</button><div id="delC"></div>` : ""}`);
  $$("[data-ch]").forEach(r => r.onclick = () => { closeSheet(); goCh(+r.dataset.ch) });
  const d = $("#delBook"); if (d) d.onclick = () => { $("#delC").innerHTML = `<p class="note" style="margin:12px 0">Удалить «${esc(b.title)}» с этого устройства? Слова в словаре останутся.</p><button class="btn warn block" id="delY">Да, удалить</button>`; $("#delY").onclick = async () => { MYB[b.id] = { id: b.id, del: true, u: Date.now() }; LS.set("sc_books", MYB); await IDB.del(b.id); delete ST.pos[b.id]; saveState(); closeSheet(); closeReader(); toast("Книга удалена") } };
}

/* ============ upload & parse ============ */
function loadScript(src) { return new Promise((res, rej) => { if (document.querySelector(`script[src="${src}"]`)) return res(); const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("load " + src)); document.head.appendChild(s) }) }
function decodeText(buf) { let t = new TextDecoder("utf-8").decode(buf); if ((t.match(/�/g) || []).length > 20) { try { t = new TextDecoder("windows-1251").decode(buf) } catch (e) {} } return t.replace(/^﻿/, "") }
function chunkParas(ps, size) { const out = []; for (let i = 0; i < ps.length; i += size) out.push({ t: "Часть " + (out.length + 1), p: ps.slice(i, i + size) }); return out }
function fromPlain(text) {
  text = text.replace(/\r\n?/g, "\n");
  const st = text.search(/\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG[^\n]*\n/i); if (st >= 0) text = text.slice(text.indexOf("\n", st) + 1);
  const en = text.search(/\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG/i); if (en > 0) text = text.slice(0, en);
  let ps = splitParas(text); if (ps.length < 5) ps = text.split("\n").map(s => s.trim()).filter(Boolean);
  const head = /^(chapter|part|book|глава)\s+([0-9ivxlcdm]+|[a-z]+)\b.{0,60}$/i; const chs = []; let cur = null;
  ps.forEach(p => { if (head.test(p) && p.length < 80) { cur = { t: p, p: [] }; chs.push(cur) } else { if (!cur) { cur = { t: "Начало", p: [] }; chs.push(cur) } cur.p.push(p) } });
  const good = chs.filter(c => c.p.length); if (good.length >= 2 && good.every(c => c.p.length < 400)) return good;
  return chunkParas(ps, 45);
}
function blocksFromDoc(doc) { const out = []; const els = doc.querySelectorAll("p,h1,h2,h3,h4,li,blockquote"); if (els.length) els.forEach(e => { if (e.querySelector("p")) return; const t = e.textContent.replace(/\s+/g, " ").trim(); if (t) out.push(t) }); else splitParas((doc.body || doc.documentElement).textContent).forEach(x => out.push(x)); return out }
async function parseEpub(buf) {
  await loadScript("lib/jszip.min.js"); const zip = await JSZip.loadAsync(buf);
  const cont = await zip.file("META-INF/container.xml").async("string");
  const opfPath = new DOMParser().parseFromString(cont, "application/xml").querySelector("rootfile").getAttribute("full-path");
  const dir = opfPath.includes("/") ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1) : "";
  const opf = new DOMParser().parseFromString(await zip.file(opfPath).async("string"), "application/xml");
  const title = (opf.getElementsByTagName("dc:title")[0] || {}).textContent || "", author = (opf.getElementsByTagName("dc:creator")[0] || {}).textContent || "";
  const man = {}; opf.querySelectorAll("manifest item").forEach(i => man[i.getAttribute("id")] = i.getAttribute("href"));
  const chapters = [];
  for (const ref of opf.querySelectorAll("spine itemref")) {
    const href = man[ref.getAttribute("idref")]; if (!href) continue; const f = zip.file(decodeURIComponent(dir + href)) || zip.file(dir + href); if (!f) continue;
    const html = await f.async("string"); let doc = new DOMParser().parseFromString(html, "application/xhtml+xml"); if (doc.querySelector("parsererror")) doc = new DOMParser().parseFromString(html, "text/html");
    const ps = blocksFromDoc(doc); if (ps.join(" ").length < 120) continue;
    const hd = doc.querySelector("h1,h2,h3"); const t = hd ? hd.textContent.replace(/\s+/g, " ").trim() : ""; if (t && ps[0] === t) ps.shift();
    if (ps.length > 400) chunkParas(ps, 200).forEach((c, i) => chapters.push({ t: (t || "Глава " + (chapters.length + 1)) + (i ? " (" + (i + 1) + ")" : ""), p: c.p })); else chapters.push({ t: t || "Глава " + (chapters.length + 1), p: ps });
  }
  return { title, author, chapters };
}
function parseFb2(buf) {
  const head = new TextDecoder("latin1").decode(buf.slice(0, 200)); const m = head.match(/encoding=["']([\w-]+)["']/i); let txt; try { txt = new TextDecoder(m ? m[1] : "utf-8").decode(buf) } catch (e) { txt = decodeText(buf) }
  const doc = new DOMParser().parseFromString(txt, "application/xml");
  const title = (doc.querySelector("book-title") || {}).textContent || ""; const fa = doc.querySelector("title-info author"); const author = fa ? [fa.querySelector("first-name"), fa.querySelector("last-name")].filter(Boolean).map(e => e.textContent).join(" ") : "";
  const body = doc.querySelector("body"), chapters = [], secs = body ? [...body.children].filter(e => e.tagName === "section") : [];
  const walk = sec => { const sub = [...sec.children].filter(e => e.tagName === "section"); const ps = [...sec.children].filter(e => ["p", "poem", "cite"].includes(e.tagName)).map(e => e.textContent.replace(/\s+/g, " ").trim()).filter(Boolean); const t = (sec.querySelector(":scope > title") || {}).textContent; if (ps.length) chapters.push({ t: (t || "").replace(/\s+/g, " ").trim() || "Глава " + (chapters.length + 1), p: ps }); sub.forEach(walk) };
  if (secs.length) secs.forEach(walk); else if (body) chapters.push(...chunkParas([...body.querySelectorAll("p")].map(p => p.textContent.trim()).filter(Boolean), 45));
  return { title, author, chapters };
}
async function parsePdf(buf) {
  await loadScript("lib/pdf.min.js"); const lib = window.pdfjsLib; lib.GlobalWorkerOptions.workerSrc = "lib/pdf.worker.min.js";
  const pdf = await lib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise; const lines = [];
  for (let i = 1; i <= pdf.numPages; i++) { const pg = await pdf.getPage(i); const tc = await pg.getTextContent(); let line = ""; tc.items.forEach(it => { line += it.str; if (it.hasEOL) { lines.push(line); line = "" } }); if (line) lines.push(line); lines.push(""); if (i % 10 === 0) toast(`Читаю PDF: ${i} из ${pdf.numPages}`) }
  const ps = []; let cur = ""; lines.forEach(l => { const s = l.trim(); if (!s) { if (cur) { ps.push(cur); cur = "" } return } cur = cur ? (cur.endsWith("-") ? cur.slice(0, -1) + s : cur + " " + s) : s; if (/[.!?"”]$/.test(s) && s.length < 55) { ps.push(cur); cur = "" } }); if (cur) ps.push(cur);
  return { title: "", author: "", chapters: fromPlain(ps.join("\n\n")) };
}
async function importBookFile(f) {
  toast("Открываю «" + f.name + "»…");
  try {
    const buf = await f.arrayBuffer(); const ext = (f.name.split(".").pop() || "").toLowerCase(); let r;
    if (ext === "epub") r = await parseEpub(buf); else if (ext === "fb2") r = parseFb2(buf); else if (ext === "pdf") r = await parsePdf(buf);
    else if (ext === "html" || ext === "htm") { const doc = new DOMParser().parseFromString(decodeText(buf), "text/html"); r = { title: doc.title, author: "", chapters: chunkParas(blocksFromDoc(doc), 45) } }
    else r = { title: "", author: "", chapters: fromPlain(decodeText(buf)) };
    r.chapters = (r.chapters || []).filter(c => c.p && c.p.length);
    if (!r.chapters.length) { toast("В файле нет текста. Скан без текстового слоя не подойдёт."); return }
    const id = "u" + Date.now().toString(36); const title = (r.title || f.name.replace(/\.[^.]+$/, "")).trim().slice(0, 120);
    const book = { id, title, author: (r.author || "").trim().slice(0, 80), chapters: r.chapters };
    if (!(await IDB.put(id, book))) { toast("Не хватило места на устройстве"); return }
    MYB[id] = { id, title, author: book.author, chapters: book.chapters.map(c => ({ t: c.t })), added: Date.now(), u: Date.now() }; LS.set("sc_books", MYB);
    toast("Книга добавлена: " + book.chapters.length + " " + plural(book.chapters.length, "глава", "главы", "глав")); tab = "read"; render();
  } catch (err) { console.error(err); toast("Не получилось открыть файл. Попробуйте EPUB или TXT.") }
}
$("#file").onchange = e => { const f = e.target.files[0]; e.target.value = ""; if (f) importBookFile(f) };

/* ============ lessons ============ */
function findLesson(id) { for (const u of UNITS) for (const l of u.ls) if (l.id === id) return l }
function openLesson(id) {
  const l = findLesson(id);
  let h = `<div class="lbar"><button class="ib" id="lBack" aria-label="Закрыть">${IC.close}</button><div class="t">${esc(l.t)}</div><span style="width:42px"></span></div><div class="page" id="lp"><h1>${esc(l.t)}</h1><p class="lead">${esc(l.d)}</p>`;
  l.s.forEach(s => { h += `<div class="ls"><h3>${esc(s.h)}</h3>${s.p ? `<p>${s.p}</p>` : ""}`;
    if (s.tb) h += `<div class="tw"><table><tbody>${s.tb.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    if (s.ex) h += `<div class="exs">${s.ex.map(x => `<div class="ex"><div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div><button class="say sm" data-say="${esc(x[0].replace(/\/.*\//, ""))}" aria-label="Произнести">${IC.sound}</button></div>`).join("")}</div>`;
    h += `</div>` });
  h += `<div class="ls" style="margin-top:32px"><button class="btn primary block" id="lQuiz">Проверить себя · ${l.q.length} ${plural(l.q.length, "вопрос", "вопроса", "вопросов")}</button></div></div>`;
  openLayer("#layer", h); $("#lBack").onclick = () => { closeLayer("#layer"); render() }; $("#lQuiz").onclick = () => runQuiz(l);
}
function doneScreen(box, title, sub, again, done) {
  box.innerHTML = `<div class="done view"><div class="big-ic">${IC.check}</div><h2>${esc(title)}</h2><p>${esc(sub)}</p><div class="acts" style="justify-content:center;max-width:420px;margin:22px auto 0">${again ? `<button class="btn soft" id="dAgain">Ещё раз</button>` : ""}<button class="btn primary" id="dOk">Готово</button></div></div>`;
  if (again) $("#dAgain").onclick = again; $("#dOk").onclick = done; $("#layer").scrollTop = 0;
}
function runQuiz(l) {
  let i = 0, score = 0; const res = []; const box = $("#lp");
  const step = () => {
    if (i >= l.q.length) { const first = !(ST.lessons[l.id] && ST.lessons[l.id].done); const xp = first ? 20 : 5; ST.lessons[l.id] = { done: true, score: Math.max(score, (ST.lessons[l.id] || {}).score || 0) }; addXP(xp);
      return doneScreen(box, score === l.q.length ? "Безупречно" : score >= l.q.length / 2 ? "Хорошо" : "Стоит повторить", `Правильно ${score} из ${l.q.length} · +${xp} XP`, () => runQuiz(l), () => { closeLayer("#layer"); render() }) }
    const q = l.q[i];
    box.innerHTML = `<div class="view"><div class="qprog">${l.q.map((_, k) => `<i class="${k < i ? (res[k] ? "ok" : "bad") : k === i ? "cur" : ""}"></i>`).join("")}</div><p style="color:var(--muted);font-weight:700;font-size:13px;margin-bottom:6px">Вопрос ${i + 1} из ${l.q.length}</p><div class="qq">${esc(q.q)}</div><div class="opts">${q.o.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}</div><div id="qfb"></div></div>`;
    $("#layer").scrollTop = 0;
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      if (box.querySelector(".opt.ok,.opt.bad")) return; const k = +b.dataset.k, ok = k === q.a; res[i] = ok; if (ok) score++;
      b.classList.add(ok ? "ok" : "bad"); if (!ok) box.querySelector(`.opt[data-k="${q.a}"]`).classList.add("ok");
      $("#qfb").innerHTML = `<div class="fb ${ok ? "ok" : "bad"}"><b>${ok ? "Верно" : "Не совсем"}</b>${esc(q.e)}</div><button class="btn primary block" id="qNext" style="margin-top:14px">${i < l.q.length - 1 ? "Дальше" : "Результат"}</button>`;
      $("#qNext").onclick = () => { i++; step() };
    });
  }; step();
}

/* ============ review ============ */
function startReview(mode) {
  let pool = (mode === "cards" ? dueWords() : liveWords()).sort(() => Math.random() - .5).slice(0, mode === "cards" ? 20 : 10);
  openLayer("#layer", `<div class="lbar"><button class="ib" id="rvBack" aria-label="Закрыть">${IC.close}</button><div class="t">${mode === "cards" ? "Карточки" : "Тест"}</div><span style="width:42px"></span></div><div class="page" id="rv" style="max-width:560px"></div>`);
  const close = () => { closeLayer("#layer"); render() }; $("#rvBack").onclick = close;
  const box = $("#rv"); let i = 0, good = 0;
  if (!pool.length) return doneScreen(box, "Всё повторено", mode === "cards" ? "Новые карточки появятся позже. Можно пройти тест или почитать." : "Добавьте слова из книг, чтобы пройти тест.", null, close);
  const grade = (w, ok) => { if (ok) { w.box = Math.min(7, (w.box || 0) + 1); w.due = Date.now() + INTV[w.box] * DAY - 36e5; good++ } else { w.box = Math.max(0, (w.box || 0) - 2); w.due = Date.now() + 6e5 } putWord(w) };
  const finish = () => { const xp = good * 3; if (xp) addXP(xp); doneScreen(box, "Готово", `Вспомнили ${good} из ${pool.length} · +${xp} XP`, null, close) };
  const prog = () => `<div class="qprog">${pool.map((_, k) => `<i class="${k < i ? "ok" : k === i ? "cur" : ""}"></i>`).join("")}</div>`;
  const card = () => { if (i >= pool.length) return finish(); const w = pool[i];
    box.innerHTML = `${prog()}<div class="flip" id="flip"><div class="inner"><div class="face"><div class="big">${esc(w.lemma || w.w)}</div><div style="display:flex;justify-content:center"><button class="say" data-say="${esc(w.lemma || w.w)}" aria-label="Произнести">${IC.sound}</button></div><div class="ctx">${w.sent ? markSentence(w.sent, w.w) : ""}</div><p class="note" style="text-align:center;margin-top:auto">Вспомните перевод и нажмите на карточку</p></div><div class="face back"><div class="big" style="margin-top:6px">${esc(w.tr)}</div>${w.ipa ? `<div class="ctx">${esc(w.ipa)}</div>` : ""}${w.alts && w.alts.length > 1 ? `<p class="note" style="text-align:center">${esc(w.alts.join(", "))}</p>` : ""}${w.ctx ? `<p style="font-size:15px">${esc(w.ctx)}</p>` : ""}${(w.ex || [])[0] ? `<div class="box" style="margin-top:0"><b style="font-family:var(--f-read);font-weight:500">${esc(w.ex[0][0])}</b><p class="note" style="margin-top:2px">${esc(w.ex[0][1])}</p></div>` : ""}</div></div></div><div class="rbtns" id="rb" style="visibility:hidden"><button class="btn warn" id="no">Не помню</button><button class="btn primary" id="yes">Помню</button></div>`;
    const fl = $("#flip"); fl.onclick = e => { if (e.target.closest("[data-say]")) return; fl.classList.toggle("on"); $("#rb").style.visibility = "visible"; if (fl.classList.contains("on") && SET.autoSay) say(w.lemma || w.w) };
    $("#no").onclick = () => { grade(w, false); i++; card() }; $("#yes").onclick = () => { grade(w, true); i++; card() } };
  const quiz = async () => { if (i >= pool.length) return finish(); const w = pool[i];
    let others = [...new Set(liveWords().filter(x => x.key !== w.key).map(x => x.tr))];
    if (others.length < 3) { const s = await shard("abcdefghilmnoprstw"[Math.floor(Math.random() * 18)]); const vals = Object.values(s).filter(e => typeof e !== "string" && (e.z || 0) > 45); for (let k = 0; k < 8 && vals.length; k++) others.push(mainTr(vals[Math.floor(Math.random() * vals.length)])) }
    others = others.filter(t => t && t !== w.tr).sort(() => Math.random() - .5).slice(0, 3);
    const opts = [w.tr, ...others].sort(() => Math.random() - .5);
    box.innerHTML = `${prog()}<div class="view"><div class="qq" style="font:700 32px var(--f-head);text-align:center;margin:20px 0 10px">${esc(w.lemma || w.w)}</div><div style="display:flex;justify-content:center;margin-bottom:22px"><button class="say" data-say="${esc(w.lemma || w.w)}" aria-label="Произнести">${IC.sound}</button></div><div class="opts">${opts.map(o => `<button class="opt">${esc(o)}</button>`).join("")}</div><div id="qfb"></div></div>`;
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => { if (box.querySelector(".opt.ok,.opt.bad")) return; const ok = b.textContent === w.tr; b.classList.add(ok ? "ok" : "bad"); if (!ok) [...box.querySelectorAll(".opt")].find(x => x.textContent === w.tr).classList.add("ok"); grade(w, ok);
      $("#qfb").innerHTML = `${w.sent ? `<div class="box"><div class="sent">${markSentence(w.sent, w.w)}</div></div>` : ""}<button class="btn primary block" id="qNext" style="margin-top:14px">Дальше</button>`; $("#qNext").onclick = () => { i++; quiz() } }) };
  mode === "cards" ? card() : quiz();
}

/* ============ settings ============ */
const seg = (key, opts) => `<div class="seg" data-seg="${key}">${opts.map(([v, n]) => `<button data-v="${v}" class="${String(SET[key]) === String(v) ? "on" : ""}">${n}</button>`).join("")}</div>`;
const sw = (key) => `<button class="switch ${SET[key] ? "on" : ""}" data-sw="${key}" role="switch" aria-checked="${!!SET[key]}"></button>`;
const sample = `<div class="preview" lang="en">Tom liked his quiet life. He had a radio, a cat called Pepper and a lot of books. Once a month, a small boat brought him food and letters.</div>`;
function openSettings(page, fromReader) {
  const titles = { mt: "Перевод предложений", look: "Оформление", reading: "Чтение", trans: "Перевод и озвучка", ai: "Объяснения ИИ", goal: "Цель на день", backup: "Копия в iCloud" };
  let b = "";
  if (page === "look") {
    b += `<div class="sec"><h2>Тема</h2><span></span></div><div class="themes">${Object.entries(SKINS).map(([k, s]) => `<button class="th ${SET.skin === k ? "on" : ""}" data-skin="${k}" style="background:${s.surface};color:${s.fg}"><i style="background:linear-gradient(135deg,${s.bg} 50%,${s.s2} 50%)"></i>${s.n}</button>`).join("")}</div>`;
    b += `<div class="sec"><h2>Акцент</h2><span>${ACCENTS[SET.accent].n}</span></div><div class="panel" style="padding:16px"><div class="swatches">${Object.entries(ACCENTS).map(([k, a]) => `<button class="sw ${SET.accent === k ? "on" : ""}" data-acc="${k}" style="background:${SKINS[SET.skin].dark ? a.d : a.l}" aria-label="${a.n}"></button>`).join("")}</div></div>`;
  }
  if (page === "reading") {
    b += `<div class="sec"><h2>Предпросмотр</h2><span></span></div>${sample}`;
    b += `<div class="sec"><h2>Шрифт</h2><span></span></div><div class="panel"><div class="set col">${seg("rfont", Object.entries(RFONTS).map(([k, f]) => [k, f[0]]))}</div></div>`;
    b += `<div class="sec"><h2>Текст</h2><span></span></div><div class="panel"><div class="set col"><span class="k"><b>Размер</b></span><div class="range"><input type="range" id="fsR" min="15" max="32" step="1" value="${SET.fs}"><output id="fsO">${SET.fs}</output></div></div><div class="set col"><span class="k"><b>Межстрочный интервал</b></span><div class="range"><input type="range" id="lhR" min="1.3" max="2.2" step="0.05" value="${SET.lh}"><output id="lhO">${(+SET.lh).toFixed(2)}</output></div></div><div class="set col"><span class="k"><b>Ширина колонки</b></span>${seg("col", [["s", "Узкая"], ["m", "Средняя"], ["l", "Широкая"]])}</div><div class="set col"><span class="k"><b>Выравнивание</b></span>${seg("align", [["left", "По левому краю"], ["justify", "По ширине"]])}</div></div>`;
    b += `<div class="sec"><h2>Фон страницы</h2><span></span></div><div class="panel"><div class="set col">${seg("rskin", Object.entries(RSKINS).map(([k, r]) => [k, r.n]))}</div></div>`;
    b += `<div class="sec"><h2>Слова из словаря</h2><span></span></div><div class="panel"><div class="set col">${seg("hl", [["bg", "Подсветка"], ["line", "Подчёркивание"], ["none", "Не выделять"]])}</div><div class="set"><span class="k"><b>Прятать панель при чтении</b><small>Панель появится при прокрутке вверх или по нажатию</small></span>${sw("hideBar")}</div></div>`;
  }
  if (page === "trans") {
    b += `<div class="panel" style="margin-top:8px"><div class="set col"><span class="k"><b>Произношение</b></span>${seg("voice", [["us", "Американское"], ["uk", "Британское"]])}</div><div class="set col"><span class="k"><b>Скорость речи</b></span><div class="range"><input type="range" id="rtR" min="0.5" max="1.2" step="0.05" value="${SET.rate}"><output id="rtO">${(+SET.rate).toFixed(2)}</output></div><button class="btn soft sm" data-say="The little mouse runs to the net and starts to bite the ropes." style="align-self:flex-start">${IC.sound} Послушать</button></div><div class="set"><span class="k"><b>Озвучивать слово при нажатии</b></span>${sw("autoSay")}</div><div class="set"><span class="k"><b>Ударения в переводах</b><small>кни́га вместо книга</small></span>${sw("stress")}</div><div class="set"><span class="k"><b>Транскрипция</b><small>/bʊk/ рядом со словом</small></span>${sw("ipa")}</div></div><p class="note" style="padding:0 4px">Голоса берутся из системы. Больше голосов: Настройки iPhone → Универсальный доступ → Устный контент → Голоса → English.</p>`;
  }
  if (page === "ai") {
    b += `<div class="panel" style="padding:16px;margin-top:8px"><p style="font-size:15px">Словарь работает без интернета. Кнопка «Объяснить» дополнительно разбирает слово в конкретном предложении: почему оно так употреблено, какая это форма, и даёт новые примеры.</p><p class="note">Для этого нужен свой ключ Claude API. Его можно получить на console.anthropic.com в разделе API Keys. Оплата там отдельная: один разбор стоит доли цента. Ключ хранится только на этом устройстве.</p></div>
    <div class="panel" style="margin-top:12px"><div class="set col"><span class="k"><b>Ключ API</b></span><input class="field" id="apiK" type="password" placeholder="sk-ant-…" value="${esc(SET.apiKey)}" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="acts" style="margin-top:4px"><button class="btn primary sm" id="apiSave">Сохранить</button><button class="btn soft sm" id="apiTest">Проверить</button>${SET.apiKey ? `<button class="btn warn sm" id="apiDel">Удалить ключ</button>` : ""}</div><p class="note" id="apiMsg"></p></div><div class="set col"><span class="k"><b>Модель</b><small>Быстрая дешевле, умная объясняет подробнее</small></span>${seg("model", [["claude-haiku-5-5", "Быстрая"], ["claude-sonnet-5-5", "Умная"]])}</div><div class="set"><span class="k"><b>Объяснять сразу</b><small>Без нажатия кнопки, если есть интернет</small></span>${sw("autoAI")}</div></div>`;
  }
  if (page === "mt") b += mtSettingsHTML();
  if (page === "goal") {
    b += `<div class="panel" style="margin-top:8px"><div class="set col"><span class="k"><b>Опыт в день</b><small>1 XP — слово или минута чтения, 2 — новое слово в словаре, 3 — удачное повторение, 20 — урок</small></span>${seg("goal", [[15, "15"], [30, "30"], [50, "50"], [80, "80"]])}</div></div>`;
  }
  if (page === "backup") {
    const nb = Object.values(MYB).filter(m => !m.del).length;
    b += `<div class="panel" style="padding:16px;margin-top:8px"><p style="font-size:15px">Так переносятся словарь, прогресс${nb ? " и ваши книги" : ""} между iPad и iPhone.</p><p class="note">1. На первом устройстве нажмите «Сохранить копию» и выберите «Сохранить в Файлы» → iCloud Drive.<br>2. На втором устройстве нажмите «Загрузить копию» и выберите этот файл. Данные объединятся: новые слова добавятся, прогресс обновится.</p></div>
    <div class="panel" style="margin-top:12px"><div class="set"><span class="k"><b>Включить мои книги</b><small>${nb ? nb + " " + plural(nb, "книга", "книги", "книг") + ", файл будет больше" : "Загруженных книг пока нет"}</small></span><button class="switch ${LS.get("sc_bkBooks", 1) ? "on" : ""}" id="bkBooks" role="switch"></button></div><div class="set col"><div class="acts" style="margin:0"><button class="btn primary" id="bkSave">${IC.share} Сохранить копию</button><button class="btn soft" id="bkLoad">${IC.down} Загрузить копию</button></div><p class="note" id="bkMsg">${ST.lastBackup ? "Последняя копия: " + new Date(ST.lastBackup).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "Копий ещё не было"}</p></div></div>`;
  }
  const L = openLayer("#layer", `<div class="lbar"><button class="ib" id="sBack" aria-label="Назад">${IC.back}</button><div class="t">${titles[page]}</div><span style="width:42px"></span></div><div class="page">${b}</div>`);
  if (fromReader) L.style.zIndex = 50;
  $("#sBack").onclick = () => { closeLayer("#layer"); L.style.zIndex = ""; if (!fromReader) render() };
  bindSettings(page);
}
function bindSettings(page) {
  $$("[data-seg]").forEach(s => s.querySelectorAll("button").forEach(b => b.onclick = () => { const k = s.dataset.seg; let v = b.dataset.v; if (typeof DEF[k] === "number") v = +v; SET[k] = v; saveSet(); s.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b)); if (k === "hl" && RD) $("#rd").className = "reader hl-" + v }));
  $$("[data-sw]").forEach(b => b.onclick = () => { const k = b.dataset.sw; SET[k] = SET[k] ? 0 : 1; saveSet(); b.classList.toggle("on", !!SET[k]); b.setAttribute("aria-checked", !!SET[k]) });
  $$("[data-skin]").forEach(b => b.onclick = () => { SET.skin = b.dataset.skin; saveSet(); openSettings("look") });
  $$("[data-acc]").forEach(b => b.onclick = () => { SET.accent = b.dataset.acc; saveSet(); openSettings("look") });
  const rng = (id, out, key, fmt) => { const r = $(id); if (!r) return; r.oninput = () => { SET[key] = +r.value; $(out).textContent = fmt ? (+r.value).toFixed(2) : r.value; saveSet() } };
  rng("#fsR", "#fsO", "fs"); rng("#lhR", "#lhO", "lh", 1); rng("#rtR", "#rtO", "rate", 1);
  if (page === "mt") bindMtSettings();
  if (page === "ai") {
    const msg = t => $("#apiMsg").textContent = t;
    $("#apiSave").onclick = () => { SET.apiKey = $("#apiK").value.trim(); saveSet(); msg(SET.apiKey ? "Ключ сохранён на этом устройстве." : "Ключ удалён."); };
    $("#apiTest").onclick = async () => { SET.apiKey = $("#apiK").value.trim(); saveSet(); msg("Проверяю…"); try { await askClaude('Ответь только JSON: {"ok":true}', 20); msg("Работает! Объяснения включены.") } catch (e) { msg(aiErr(e)) } };
    const d = $("#apiDel"); if (d) d.onclick = () => { SET.apiKey = ""; saveSet(); openSettings("ai") };
  }
  if (page === "backup") {
    const bb = $("#bkBooks"); bb.onclick = () => { const v = LS.get("sc_bkBooks", 1) ? 0 : 1; LS.set("sc_bkBooks", v); bb.classList.toggle("on", !!v) };
    $("#bkSave").onclick = exportBackup; $("#bkLoad").onclick = () => $("#restore").click();
  }
}

/* ============ backup ============ */
async function exportBackup() {
  const books = {}; if (LS.get("sc_bkBooks", 1)) for (const m of Object.values(MYB)) if (!m.del) { const b = await IDB.get(m.id); if (b) books[m.id] = b }
  const s = Object.assign({}, SET); delete s.apiKey;
  const data = { app: "slovochit", v: 1, at: Date.now(), set: s, state: ST, words: WORDS, mybooks: MYB, books };
  const name = "slovochit-" + today() + ".json"; const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const file = new File([blob], name, { type: "application/json" });
  ST.lastBackup = Date.now(); saveState();
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Копия Словочита" }); $("#bkMsg").textContent = "Копия готова. Если выбрали «Сохранить в Файлы», она лежит в iCloud Drive."; return } } catch (e) { if (e && e.name === "AbortError") return }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 2000);
  $("#bkMsg").textContent = "Файл " + name + " сохранён в «Загрузки».";
}
$("#restore").onchange = async e => {
  const f = e.target.files[0]; e.target.value = ""; if (!f) return;
  try {
    const d = JSON.parse(await f.text()); if (d.app !== "slovochit") throw 0;
    let nw = 0; for (const [k, w] of Object.entries(d.words || {})) { const cur = WORDS[k]; if (!cur || (w.u || 0) > (cur.u || 0)) { if (!cur) nw++; WORDS[k] = w } } saveWords();
    const s = d.state || {}; for (const [k, v] of Object.entries(s.days || {})) ST.days[k] = Math.max(ST.days[k] || 0, v); for (const [k, v] of Object.entries(s.mins || {})) ST.mins[k] = Math.max(ST.mins[k] || 0, v);
    ST.xp = Math.max(ST.xp, s.xp || 0); for (const [k, v] of Object.entries(s.lessons || {})) if (!ST.lessons[k] || (v.score || 0) > (ST.lessons[k].score || 0)) ST.lessons[k] = v;
    for (const [k, v] of Object.entries(s.pos || {})) if (!ST.pos[k] || (v.t || 0) > (ST.pos[k].t || 0)) ST.pos[k] = v; saveState();
    let nb = 0; for (const [id, m] of Object.entries(d.mybooks || {})) { if (m.del) { if (MYB[id]) { MYB[id] = m; await IDB.del(id) } continue } if (d.books && d.books[id] && !MYB[id]) { await IDB.put(id, d.books[id]); MYB[id] = m; nb++ } } LS.set("sc_books", MYB);
    if (d.set) { SET = Object.assign({}, SET, d.set, { apiKey: SET.apiKey }); saveSet() }
    toast(`Загружено: ${nw} ${plural(nw, "новое слово", "новых слова", "новых слов")}${nb ? ", " + nb + " " + plural(nb, "книга", "книги", "книг") : ""}`);
    closeLayer("#layer"); render();
  } catch (err) { toast("Это не файл копии Словочита") }
};

/* ============ word sets by level ============ */
let LEVELS = null;
async function levels() { if (LEVELS) return LEVELS; try { LEVELS = await (await fetch("dict/levels.json")).json() } catch (e) { LEVELS = {} } return LEVELS }
const SETINFO = { A1: "Самые частые слова: без них никуда", A2: "Повседневные темы и простые тексты", B1: "Для свободного чтения рассказов", B2: "Для классики и сложных текстов" };
function setsBlock() {
  const L = LEVELS; if (!L) { levels().then(() => { if (tab === "dict") render() }); }
  const saved = new Set(liveWords().map(w => w.key));
  return `<div class="sec"><h2>Наборы слов</h2><span>учить без книги</span></div><div class="panel">${Object.keys(SETINFO).map(lv => { const ws = (L && L[lv]) || []; const n = ws.filter(w => saved.has(w)).length; return `<button class="set" data-set="${lv}"><span class="k"><b>${lv} · ${ws.length || "…"} слов</b><small>${SETINFO[lv]}</small><div class="bar" style="width:140px"><i style="width:${ws.length ? n / ws.length * 100 : 0}%"></i></div></span><span class="v">${n ? n + " в словаре" : ""}${IC.chev}</span></button>` }).join("")}</div>`;
}
async function entryFor(w) { const e = await rawEntry(w); if (!e) return null; if (typeof e === "string") { const [lm] = e.slice(1).split("|"); const le = await rawEntry(lm); return typeof le === "string" ? null : le } return e }
async function addWordByLemma(w, sentence, src) {
  const e = await entryFor(w); if (!e) return false;
  const ex = (e.e || []).slice(0, 2);
  putWord({ key: w, w, lemma: w, tr: mainTr(e), alts: e.t ? e.t.slice(0, 4).map(t => stripStress(t[0])) : [], ipa: e.i || "", sent: sentence || (ex[0] ? ex[0][0] : ""), src: src || "", note: e.n || "", ex, ctx: "", box: 0, due: Date.now(), added: Date.now(), forms: [w] });
  return true;
}
async function openSet(lv) {
  const L = await levels(); const all = L[lv] || []; let shown = 60;
  openLayer("#layer", `<div class="lbar"><button class="ib" id="stBack" aria-label="Назад">${IC.back}</button><div class="t">Набор ${lv}</div><span style="width:42px"></span></div><div class="page"><h1>Набор ${lv}</h1><p class="lead">${SETINFO[lv]}. Слова идут от самых частых к более редким.</p><div class="acts"><button class="btn primary" id="stAdd10">Добавить 10 новых в карточки</button></div><div class="sec"><h2>Слова</h2><span id="stCnt"></span></div><div class="panel list" id="stList"></div><button class="btn soft block" id="stMore" style="margin-top:12px">Показать ещё</button></div>`);
  $("#stBack").onclick = () => { closeLayer("#layer"); render() };
  const draw = async () => {
    const saved = new Set(liveWords().map(w => w.key)); const part = all.slice(0, shown);
    const rows = await Promise.all(part.map(async w => { const e = await entryFor(w); return `<div class="row"><span class="rw"><b>${esc(w)}</b><span>${esc(mainTr(e))}</span></span><button class="say sm" data-say="${esc(w)}" aria-label="Произнести">${IC.sound}</button><button class="ib" data-addw="${esc(w)}" aria-label="${saved.has(w) ? "В словаре" : "Добавить"}" style="color:${saved.has(w) ? "var(--accent)" : "var(--muted)"}">${saved.has(w) ? IC.check : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'}</button></div>` }));
    $("#stList").innerHTML = rows.join(""); $("#stCnt").textContent = `${all.filter(w => saved.has(w)).length} из ${all.length} в словаре`; $("#stMore").hidden = shown >= all.length;
    $$("[data-addw]").forEach(b => b.onclick = async () => { const w = b.dataset.addw; if (WORDS[w] && !WORDS[w].del) { putWord(Object.assign(WORDS[w], { del: true })) } else { await addWordByLemma(w, "", "Набор " + lv); addXP(1, b) } refreshCounters(); draw() });
  };
  $("#stMore").onclick = () => { shown += 60; draw() };
  $("#stAdd10").onclick = async e => { const saved = new Set(liveWords().map(w => w.key)); const fresh = all.filter(w => !saved.has(w)).slice(0, 10); for (const w of fresh) await addWordByLemma(w, "", "Набор " + lv); addXP(fresh.length, e.currentTarget); toast(`Добавлено ${fresh.length} ${plural(fresh.length, "слово", "слова", "слов")}. Они уже ждут в карточках.`); refreshCounters(); draw() };
  draw();
}

/* ============ phrase / selection translation ============ */
let PC = null;
async function openPhrase(text, context, src) {
  text = text.replace(/\s+/g, " ").trim(); if (!text) return;
  const words = text.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) || []; if (!words.length) return;
  if (words.length === 1 && text.length < 30) { openWord(words[0], context || text, src); return }
  PC = { text, context: context || text, src, ai: null, aiState: "" };
  openSheet('<div class="skel" style="height:26px;width:60%"></div><div class="skel" style="width:80%"></div>', () => { PC = null; try { getSelection().removeAllRanges() } catch (e) {} });
  const low = words.map(w => w.toLowerCase().replace(/’/g, "'"));
  // whole phrase in the dictionary? try as written and with the first word's base form
  let whole = null; if (words.length <= 5) { const first = await lookup(words[0]); for (const k of [low.join(" "), first ? [first.lemma, ...low.slice(1)].join(" ") : null]) { if (!k || whole) continue; const e = await rawEntry(k); if (e && typeof e !== "string") whole = { k, e } } }
  // word by word, also spotting two-word phrases inside
  const parts = []; for (let i = 0; i < words.length && i < 40; i++) {
    const r = await lookup(words[i]); let used = 1, head = words[i], e = r && r.e, lemma = r ? r.lemma : low[i];
    if (i + 1 < words.length) { for (const b0 of [...new Set([lemma, low[i]])]) { const pe = await rawEntry(b0 + " " + low[i + 1]); if (pe && typeof pe !== "string" && pe.c) { e = pe; head = words[i] + " " + words[i + 1]; lemma = b0 + " " + low[i + 1]; used = 2; break } } }
    parts.push({ head, lemma, tr: e ? mainTr(e) : "" }); i += used - 1;
  }
  if (!PC || PC.text !== text) return; PC.whole = whole; PC.parts = parts; PC.sentence = text; renderPhrase(); runFreeTr(PC, renderPhrase);
  if (SET.autoAI && SET.apiKey && navigator.onLine) runPhraseAI();
}
function renderPhrase() {
  if (!PC) return; const { text, context, whole, parts } = PC; const saved = WORDS[text.toLowerCase()] && !WORDS[text.toLowerCase()].del;
  let h = `<div class="wh"><div style="flex:1;min-width:0"><div class="word" style="font-size:${text.length > 40 ? 20 : 26}px">${esc(text)}</div></div><button class="say" data-say="${esc(text)}" aria-label="Произнести">${IC.sound}</button></div>`;
  if (whole) h += `<div class="main-tr">${esc(mainTr(whole.e))}</div>${whole.e.n ? `<p class="note">${esc(whole.e.n)}</p>` : ""}`;
  h += `<div class="box"><h4>Перевод</h4>${trBlock(PC, true)}</div>`;
  if (PC.aiState === "load") h += `<div class="box ai"><h4>Перевод в контексте</h4><div class="skel" style="width:85%"></div><div class="skel" style="width:60%"></div></div>`;
  else if (PC.aiState === "err") h += `<div class="box ai"><h4>Перевод в контексте</h4><p>${esc(PC.aiErr)}</p></div>`;
  else if (PC.ai) h += `<div class="box ai"><h4>Перевод в контексте</h4><p><b>${esc(PC.ai.translation || "")}</b></p>${PC.ai.explanation ? `<p style="margin-top:6px">${esc(PC.ai.explanation)}</p>` : ""}${PC.ai.literal ? `<p class="note">Дословно: ${esc(PC.ai.literal)}</p>` : ""}</div>`;
  if (context && context !== text) h += `<div class="box"><h4>В тексте</h4><div class="sent">${markSentence(context, text)}</div></div>`;
  h += `<div class="box"><h4>По словам</h4>${parts.map(p => `<div class="tr-row"><b style="font-weight:700">${esc(p.head)}</b><span style="color:var(--fg);font-size:15px;font-weight:500;white-space:normal;text-align:right">${esc(p.tr || "—")}</span></div>`).join("")}<p class="note">Пословный перевод собран из офлайн-словаря и помогает понять, из чего состоит фраза.</p></div>`;
  h += `<div class="acts">${PC.ai || PC.aiState === "load" || !SET.apiKey ? "" : `<button class="btn soft" id="pAI">${IC.spark} Объяснить (Claude)</button>`}${saved ? `<button class="btn soft" id="pDel">${IC.check} В словаре</button>` : `<button class="btn primary" id="pSave" ${!whole && !PC.ai && !(PC.tr && PC.tr.text) ? "disabled" : ""}>Добавить в словарь</button>`}</div>`;
  $("#sbody").innerHTML = h;
  const a = $("#pAI"); if (a) a.onclick = runPhraseAI; bindTr(PC, renderPhrase);
  const s = $("#pSave"); if (s) s.onclick = () => { const k = text.toLowerCase(); putWord({ key: k, w: text, lemma: text, tr: whole ? mainTr(whole.e) : PC.ai ? PC.ai.translation : PC.tr.text, alts: [], ipa: "", sent: context, src: PC.src || "", note: PC.ai ? PC.ai.explanation || "" : whole && whole.e.n || "", ex: whole && whole.e.e ? whole.e.e.slice(0, 2) : [], ctx: "", box: 0, due: Date.now(), added: Date.now(), forms: [k] }); addXP(2, s); renderPhrase(); refreshCounters() };
  const d = $("#pDel"); if (d) d.onclick = () => { putWord(Object.assign(WORDS[text.toLowerCase()], { del: true })); renderPhrase(); refreshCounters() };
}
async function runPhraseAI() {
  if (!PC) return; const ctx = PC;
  if (!SET.apiKey) { ctx.aiState = "err"; ctx.aiErr = aiErr({ code: "nokey" }); renderPhrase(); return }
  ctx.aiState = "load"; renderPhrase();
  try {
    const ck = "ph|" + hash(ctx.text + "|" + ctx.context);
    const r = AIC[ck] || await askClaude(`Ты — преподаватель английского для русскоговорящего ученика уровня A2–B1. Ученик выделил фрагмент в книге.
Фрагмент: "${ctx.text}"
Контекст: "${ctx.context}"
Ответь только JSON: {"translation":"естественный перевод фрагмента именно в этом контексте","literal":"дословный перевод, если он заметно отличается, иначе пустая строка","explanation":"1–2 предложения по-русски: как устроена фраза, есть ли идиома, фразовый глагол или особая грамматика"}`, 500);
    AIC[ck] = r; LS.set("sc_ai", AIC); if (PC !== ctx) return; ctx.ai = r; ctx.aiState = "";
  } catch (e) { if (PC !== ctx) return; ctx.aiState = "err"; ctx.aiErr = aiErr(e) }
  renderPhrase();
}
// selection inside the reader → floating "Перевести" button
const selBar = document.createElement("button"); selBar.className = "selbar"; selBar.hidden = true; selBar.innerHTML = IC.spark + "<span>Перевести выделенное</span>"; document.body.appendChild(selBar);
let selT = 0, selData = null;
document.addEventListener("selectionchange", () => {
  clearTimeout(selT); selT = setTimeout(() => {
    const sel = getSelection(); const t = sel && !sel.isCollapsed ? sel.toString().trim() : "";
    const node = sel && sel.anchorNode; const p = node && (node.nodeType === 1 ? node : node.parentElement)?.closest("#txt p");
    if (!RD || !t || !p || t.length > 400 || !/[A-Za-z]/.test(t)) { selBar.hidden = true; selData = null; return }
    const full = p.textContent; const i = full.indexOf(t); const ctx = i >= 0 ? sentenceAt(full, i) : t;
    selData = { t, ctx: ctx.length >= t.length && ctx.includes(t) ? ctx : t }; selBar.hidden = false;
  }, 250);
});
selBar.addEventListener("click", e => { e.stopPropagation(); if (!selData) return; const d = selData; selBar.hidden = true; openPhrase(d.t, d.ctx, RD && RD.book.title) });

/* ============ Mueller dictionary (big, detailed) ============ */
const MSH = {};
async function muEntry(w) {
  const k = (w + "__").slice(0, 2).replace(/[^a-z]/g, "_");
  if (!MSH[k]) MSH[k] = fetch("dict/m/" + k + ".json").then(r => r.ok ? r.json() : {}).catch(() => ({}));
  const s = await MSH[k]; return s[w] || null;
}
function muMain(groups) {
  const s = (groups[0] && groups[0][1][0]) || "";
  let t = s.split(";")[0].replace(/\([^)]*\)/g, "").replace(/[A-Za-z][A-Za-z'’.\- ]*/g, "").replace(/\s+/g, " ").replace(/\s+,/g, ",").trim().replace(/^[,\s]+|[,\s]+$/g, "");
  t = stripStress(t); return t.length > 70 ? t.slice(0, 70).replace(/\s\S*$/, "") + "…" : t;
}
function fmtSense(s) { const show = SET.stress ? s : stripStress(s); return show.split(/([A-Za-z][A-Za-z'’.\-\s]*[A-Za-z.)]|[A-Za-z])/).map((x, i) => i % 2 ? `<i class="en">${esc(x)}</i>` : esc(x)).join("") }
async function fillMueller(ctx) {
  if (!ctx || !ctx.res) return;
  if (ctx.mu === undefined) { ctx.mu = await muEntry(ctx.res.lemma) || (ctx.res.lemma !== ctx.raw.toLowerCase() ? await muEntry(ctx.raw.toLowerCase()) : null); }
  const box = $("#wMu"); if (!box || ctx !== WC || !ctx.mu) return;
  const groups = ctx.mu[1]; const total = groups.reduce((n, g) => n + g[1].length, 0);
  const lim = ctx.muAll ? 99 : 3; let shown = 0, html = "";
  for (const [pos, senses] of groups) {
    if (shown >= lim && !ctx.muAll) break;
    const part = senses.slice(0, Math.max(0, lim - shown)); shown += part.length;
    html += `${pos ? `<div class="mu-pos">${esc(pos)}</div>` : ""}<ol class="mu">${part.map(x => `<li>${fmtSense(x)}</li>`).join("")}</ol>`;
  }
  box.innerHTML = `<div class="box"><h4>Подробно · словарь Мюллера</h4>${html}${total > shown ? `<button class="more" id="muAll">Все значения и выражения (${total})</button>` : ""}</div>`;
  const a = $("#muAll"); if (a) a.onclick = () => { ctx.muAll = true; fillMueller(ctx) };
}

/* ============ free sentence translation ============ */
const TRC = LS.get("sc_tr", {});
const SRC_LABEL = { google: "Google Переводчик, бесплатно", mymemory: "MyMemory, бесплатно", device: "переведено на устройстве" };
function trBlock(ctx, auto) {
  const t = ctx.tr;
  if (SET.mt === "off") return "";
  if (!t) return auto ? "" : `<button class="more" data-trgo style="margin-top:6px">Перевод предложения</button>`;
  if (t.state === "load") return `<div class="skel" style="width:80%;margin-top:10px"></div><div class="skel" style="width:55%"></div>`;
  if (t.err) return `<p class="note">${esc(t.err)}</p>${t.retry ? `<button class="more" data-trgo>Попробовать ещё раз</button>` : ""}`;
  return `<p class="trline">${esc(t.text)}</p><p class="note" style="margin-top:4px">${esc(SRC_LABEL[t.src] || "")}</p>`;
}
function bindTr(ctx, rerender) { $$("[data-trgo]").forEach(b => b.onclick = () => runFreeTr(ctx, rerender, true)) }
async function runFreeTr(ctx, rerender, manual) {
  if (SET.mt === "off" || !ctx || !ctx.sentence) return;
  if (!manual && SET.mt !== "device" && !navigator.onLine && !nmtInstalled()) return;
  ctx.tr = { state: "load" }; rerender();
  try { const r = await freeTranslate(ctx.sentence); ctx.tr = r }
  catch (e) { ctx.tr = { err: e && e.msg || "Не удалось перевести.", retry: 1 } }
  if (ctx === WC || ctx === PC) rerender();
}
function withTimeout(ms) { const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal }
async function trGoogle(text) {
  const r = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=" + encodeURIComponent(text), { signal: withTimeout(8000) });
  if (!r.ok) throw 0; const j = await r.json(); const t = (j[0] || []).map(x => x[0]).join("").trim(); if (!t) throw 0; return t;
}
async function trMyMemory(text) {
  const r = await fetch("https://api.mymemory.translated.net/get?langpair=en%7Cru&q=" + encodeURIComponent(text.slice(0, 500)), { signal: withTimeout(8000) });
  if (!r.ok) throw 0; const j = await r.json(); const t = j && j.responseData && j.responseData.translatedText;
  if (!t || +j.responseStatus !== 200 || /MYMEMORY WARNING|QUERY LENGTH|INVALID/i.test(t)) throw 0; return t;
}
async function freeTranslate(text) {
  const key = hash(text); if (TRC[key]) return TRC[key];
  const mode = SET.mt; let r = null;
  const online = async () => { try { return { text: await trGoogle(text), src: "google" } } catch (e) { try { return { text: await trMyMemory(text), src: "mymemory" } } catch (e2) { return null } } };
  const device = async () => { try { return { text: await nmtTranslate(text), src: "device" } } catch (e) { return null } };
  if (mode === "device") r = await device();
  else if (mode === "online") r = navigator.onLine ? await online() : null;
  else { r = navigator.onLine ? await online() : null; if (!r && nmtInstalled()) r = await device() }
  if (!r) throw { msg: mode === "device" ? (nmtInstalled() ? "Офлайн-переводчик не смог перевести эту фразу." : "Офлайн-переводчик не скачан. Скачайте его в Профиле → Перевод предложений.") : !navigator.onLine ? (nmtInstalled() ? "Не получилось перевести." : "Нет интернета. Чтобы переводить без сети, скачайте офлайн-переводчик в Профиле → Перевод предложений.") : "Сервисы перевода сейчас не отвечают. Попробуйте чуть позже." };
  TRC[key] = r; const ks = Object.keys(TRC); if (ks.length > 1500) delete TRC[ks[0]]; LS.set("sc_tr", TRC);
  return r;
}

/* ============ on-device neural translator (Opus-MT en→ru, runs in the browser) ============ */
let NMT = null, NMTp = null;
const nmtInstalled = () => !!LS.get("sc_nmt", 0);
async function nmtPipe(onProgress) {
  if (NMT) return NMT; if (NMTp) return NMTp;
  NMTp = (async () => {
    const T = await import("./lib/tf/transformers.min.js");
    T.env.allowLocalModels = false; T.env.useBrowserCache = true;
    T.env.backends.onnx.wasm.wasmPaths = new URL("lib/tf/", location.href).href; T.env.backends.onnx.wasm.numThreads = 1; T.env.backends.onnx.wasm.proxy = false;
    NMT = await T.pipeline("translation", "Xenova/opus-mt-en-ru", { dtype: "q8", device: "wasm", progress_callback: onProgress });
    return NMT;
  })();
  try { return await NMTp } catch (e) { NMTp = null; throw e }
}
async function nmtTranslate(text) {
  if (!nmtInstalled()) throw 0;
  const p = await nmtPipe(); const parts = text.match(/[^.!?]+[.!?]*["”’)]*\s*/g) || [text]; const out = [];
  for (const s of parts) { if (!s.trim()) continue; const r = await p(s.trim(), { max_new_tokens: 256 }); out.push(r[0].translation_text) }
  return out.join(" ");
}
function mtSettingsHTML() {
  const inst = nmtInstalled();
  return `<div class="panel" style="padding:16px;margin-top:8px"><p style="font-size:15px">Перевод целых предложений и выделенных фраз. Всё бесплатно, ключи не нужны.</p><p class="note"><b>Онлайн</b> — Google Переводчик, запасной вариант MyMemory. Быстро и качественно, но нужен интернет. Текст предложения уходит в этот сервис.<br><b>На устройстве</b> — нейросеть-переводчик скачивается один раз (около 90 МБ) и потом работает без интернета. Переводит чуть проще, чем Google.<br><b>Авто</b> — онлайн, когда есть интернет, и на устройстве, когда его нет.</p></div>
  <div class="panel" style="margin-top:12px"><div class="set col"><span class="k"><b>Источник перевода</b></span>${seg("mt", [["auto", "Авто"], ["online", "Онлайн"], ["device", "На устройстве"], ["off", "Выкл."]])}</div><div class="set"><span class="k"><b>Переводить предложение сразу</b><small>Вместе с карточкой слова, без лишнего нажатия</small></span>${sw("autoTr")}</div></div>
  <div class="sec"><h2>Офлайн-переводчик · бета</h2><span>${inst ? "скачан" : "не скачан"}</span></div><div class="panel"><div class="set col"><span class="k"><b>${inst ? "Переводчик на устройстве" : "Скачать переводчик"}</b><small>${inst ? "Работает без интернета. Первый перевод после запуска приложения занимает несколько секунд." : "Около 90 МБ, лучше по Wi-Fi. Скачивается один раз."}</small></span><div class="acts" style="margin-top:4px">${inst ? `<button class="btn soft sm" id="nmtTest">Проверить</button><button class="btn warn sm" id="nmtDel">Удалить</button>` : `<button class="btn primary sm" id="nmtGet">${IC.down} Скачать</button>`}</div><p class="note" id="nmtMsg"></p></div></div>`;
}
function bindMtSettings() {
  const msg = t => { const m = $("#nmtMsg"); if (m) m.textContent = t };
  const g = $("#nmtGet"); if (g) g.onclick = async () => {
    if (!navigator.onLine) { msg("Нужен интернет, чтобы скачать переводчик."); return }
    g.disabled = true; const files = {};
    try {
      await nmtPipe(ev => { if (ev.status === "progress" && ev.total) { files[ev.file] = [ev.loaded, ev.total]; const l = Object.values(files).reduce((a, x) => a + x[0], 0), t = Object.values(files).reduce((a, x) => a + x[1], 0); msg(`Скачиваю: ${(l / 1e6).toFixed(0)} из ${(t / 1e6).toFixed(0)} МБ`) } else if (ev.status === "initiate") msg("Готовлю переводчик…") });
      LS.set("sc_nmt", 1); msg("Проверяю…");
      const t = await nmtTranslate("The little mouse runs to the net and starts to bite the ropes.");
      msg("Готово! Пример: " + t); toast("Офлайн-переводчик установлен"); setTimeout(() => openSettings("mt"), 2500);
    } catch (e) { console.error(e); LS.set("sc_nmt", 0); g.disabled = false; msg("Не удалось скачать или запустить переводчик на этом устройстве. Онлайн-перевод продолжит работать.") }
  };
  const t = $("#nmtTest"); if (t) t.onclick = async () => { msg("Перевожу…"); const t0 = Date.now(); try { const r = await nmtTranslate("When Alice reached the shore, she was wet and tired."); msg(r + ` (${((Date.now() - t0) / 1000).toFixed(1)} с)`) } catch (e) { msg("Не получилось. Попробуйте удалить и скачать переводчик заново.") } };
  const d = $("#nmtDel"); if (d) d.onclick = async () => { try { await caches.delete("transformers-cache") } catch (e) {} LS.set("sc_nmt", 0); NMT = null; NMTp = null; toast("Офлайн-переводчик удалён"); openSettings("mt") };
}

/* ============ boot ============ */
document.addEventListener("keydown", e => { if (e.key !== "Escape") return; if (sheet.classList.contains("open")) closeSheet(); else if ($("#layer").classList.contains("open")) { closeLayer("#layer"); render() } else if (RD) closeReader() });
render();
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").then(reg => {
    const show = w => { $("#update").hidden = false; $("#updBtn").onclick = () => w.postMessage("skip") };
    if (reg.waiting && navigator.serviceWorker.controller) show(reg.waiting);
    reg.addEventListener("updatefound", () => { const w = reg.installing; w && w.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) show(w) }) });
    setInterval(() => reg.update().catch(() => {}), 3600e3);
  }).catch(() => {});
  let reloaded = false; navigator.serviceWorker.addEventListener("controllerchange", () => { if (!reloaded) { reloaded = true; location.reload() } });
}
// warm up the most common shards in the background
setTimeout(() => "tsaiwhbmofcd".split("").forEach((l, i) => setTimeout(() => shard(l), i * 150)), 1500);
