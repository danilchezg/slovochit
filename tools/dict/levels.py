"""Builds dict/levels.json: frequency-ranked study sets A1–B2 from the dictionary (only words with a usable translation)."""
import json, glob, os, re, sys
from wordfreq import top_n_list
D = sys.argv[1]
sh = {}
for f in glob.glob(os.path.join(D, "[a-z].json")): sh.update(json.load(open(f, encoding="utf-8")))
FUNC = set("a an the of to in on at by for from with as is are am was were be been and or but if so than that this these those it its he she they we you i me him her them us my your his our their there here not no yes do does did will would shall should can could may might must".split())
BAD = set("fuck fucking shit damn hell ass sex sexual gay porn".split())
words = []
for w in top_n_list("en", 30000):
    if not re.fullmatch(r"[a-z]{2,}", w) or w in FUNC or w in BAD: continue
    e = sh.get(w)
    if not isinstance(e, dict) or not (e.get("c") or e.get("t")): continue
    if e.get("z", 0) < 30 or e.get("l"): continue
    bases = [w[:-1], w[:-2], w[:-3], w[:-3] + "e", w[:-2] + "e", w[:-3] + "y"] if re.search(r"(s|ed|ing|ies|er|est)$", w) else []
    if any(isinstance(sh.get(b), dict) and len(b) > 2 for b in bases): continue
    words.append(w)
# words with equal frequency come out alphabetically: mix them, deterministically
import hashlib
words.sort(key=lambda w: (-round(sh[w].get("z", 0)), hashlib.md5(w.encode()).hexdigest()))
cut = {"A1": 600, "A2": 1600, "B1": 3200, "B2": 6000}
out, start = {}, 0
for lv, end in cut.items():
    out[lv] = words[start:end]; start = end
json.dump(out, open(os.path.join(D, "levels.json"), "w"), separators=(",", ":"))
print({k: len(v) for k, v in out.items()}, out["B2"][:15])
