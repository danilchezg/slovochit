// Builds content.js: own stories (base + extra chapters + new books) and the catalog of classic books (texts in books/*.json).
import fs from "node:fs"; import vm from "node:vm";
const dir = new URL(".", import.meta.url).pathname, root = dir + "../../";
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(dir + "content.base.js", "utf8").replace(/^"use strict";/, "") + "\n;globalThis.BOOKS=BOOKS;globalThis.UNITS=UNITS;", ctx);
const books = ctx.BOOKS, units = ctx.UNITS;
const more = JSON.parse(fs.readFileSync(dir + "more_chapters.json", "utf8"));
for (const b of books) if (more[b.id]) b.chapters.push(...more[b.id]);
books.push(...JSON.parse(fs.readFileSync(dir + "new_books.json", "utf8")));
const classics = JSON.parse(fs.readFileSync(root + "books/_catalog.json", "utf8"));
const order = ["anna", "max", "aesop", "summer", "light", "alice", "train", "attic", "happy-prince", "oz", "just-so", "alice-original", "peter-pan", "christmas-carol", "sherlock"];
const all = [...books, ...classics].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
for (const b of all) if (!b.words) b.words = b.chapters.reduce((n, c) => n + (c.x || "").split(/\s+/).length, 0);
units.push(JSON.parse(fs.readFileSync(dir + "../lessons/unit_b1.json", "utf8")));
const practice = {};
for (const line of fs.readFileSync(dir + "../lessons/practice.txt", "utf8").split("\n")) {
  if (!line.trim() || line.startsWith("#")) continue;
  const [l, t, q, a, e] = line.split("|"); if (!e) { console.error("bad line", line); continue }
  (practice[l] ||= []).push({ t, q, a: a.split(";").map(x => x.trim()), e });
}
fs.writeFileSync(root + "content.js", '"use strict";\nconst BOOKS=' + JSON.stringify(all) + ";\nconst UNITS=" + JSON.stringify(units) + ";\nconst PRACTICE=" + JSON.stringify(practice) + ";\n");
console.log(all.map(b => `${b.id}:${b.chapters.length}`).join(" ")); console.log("lessons", units.reduce((n, u) => n + u.ls.length, 0), "practice", Object.values(practice).reduce((n, x) => n + x.length, 0), Object.keys(practice).length + " тем");
