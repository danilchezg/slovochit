"""Adds hand-written glosses, examples (examples2*.txt) and phrases (phrases.txt) to the built dictionary shards.
Usage: python3 enrich.py <dict_dir>"""
import glob, json, os, sys
from wordfreq import zipf_frequency as zf

D = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__))
sh = {os.path.basename(f)[0]: json.load(open(f, encoding="utf-8")) for f in glob.glob(os.path.join(D, "*.json"))}

def entry(w):
    s = sh.setdefault(w[0], {}); e = s.get(w)
    if isinstance(e, str): return None  # a form redirect: leave it
    if e is None: e = s[w] = {"z": round(zf(w, "en") * 10)}
    return e

added = ph = 0
for f in sorted(glob.glob(os.path.join(HERE, "examples2*.txt"))):
    for line in open(f, encoding="utf-8"):
        p = line.rstrip("\n").split("|")
        if len(p) != 4: continue
        w, gloss, en, ru = p
        e = entry(w)
        if e is None: continue
        if not e.get("c"): e["c"] = gloss
        ex = e.setdefault("e", [])
        if [en, ru] not in ex: ex.append([en, ru]); added += 1
for line in open(os.path.join(HERE, "phrases.txt"), encoding="utf-8"):
    p = line.rstrip("\n").split("|")
    if len(p) != 4: continue
    w, gloss, en, ru = p
    e = entry(w)
    if e is None: continue
    e["c"] = gloss; e["ph"] = 1
    ex = e.setdefault("e", [])
    if [en, ru] not in ex: ex.insert(0, [en, ru])
    ph += 1
for l, d in sh.items():
    json.dump(d, open(os.path.join(D, l + ".json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("examples added", added, "phrases", ph)
