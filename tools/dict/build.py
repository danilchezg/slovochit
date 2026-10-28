"""Builds the offline EN->RU dictionary shards from openrussian.org data (CC BY-SA 4.0).
Output: out/dict/<a..z>.json  — {word: [ipa, zipf10, [[ru, pos], ...]] | "=lemma"}"""
import csv, json, re, os, sys
from collections import defaultdict
from wordfreq import zipf_frequency as zf

SRC = sys.argv[1]; OUT = sys.argv[2]
csv.field_size_limit(10**8)
POS = {"nouns": "сущ.", "verbs": "гл.", "adjectives": "прил.", "others": ""}
STRESS = "́"

def accent(a):
    # openrussian marks stress with an apostrophe after the stressed vowel
    return a.replace("'", STRESS).replace("’", STRESS)

junk = re.compile(r"\(.*?\)|\[.*?\]|\bsth\b|\bsmth\b|\bsb\b|\bsmb\b|\bsomething\b|\bsomebody\b|\bsomeone\b|\bone's\b|\betc\.?|…|\.\.\.")
okw = re.compile(r"^[a-z][a-z'\-]*( [a-z][a-z'\-]*){0,2}$")
pairs = defaultdict(dict)  # en -> ru -> score
for fname, pos in POS.items():
    with open(os.path.join(SRC, fname + ".csv"), encoding="utf-8") as f:
        r = csv.DictReader(f, delimiter="\t")
        for rank, row in enumerate(r):
            ru_bare = (row.get("bare") or "").strip()
            gl = (row.get("translations_en") or "").strip()
            if not ru_bare or not gl or " " in ru_bare and fname != "others":
                continue
            ru = accent((row.get("accented") or ru_bare).strip()) or ru_bare
            rzf = zf(ru_bare, "ru")
            if rzf < 1.0 and rank > 4000:
                continue
            p = POS[fname]
            if fname == "verbs" and row.get("aspect"):
                p = "гл., " + ("сов." if row["aspect"].startswith("perf") else "несов.")
            groups = [g for g in re.split(r";", gl)]
            gi = 0
            for g in groups:
                for ti, t in enumerate(g.split(",")):
                    t = junk.sub("", t.lower()).strip(" .!?\"'*/-")
                    t = re.sub(r"^(to|a|an) ", "", t).strip()
                    t = re.sub(r"\s+", " ", t)
                    if not t or not okw.match(t) or t.startswith("the "):
                        continue
                    score = rzf - 0.9 * gi - 0.45 * ti - (0.4 if " " in t else 0) + (0.6 if gi == 0 and ti == 0 else 0)
                    key = ru
                    cur = pairs[t].get(key)
                    if cur is None or score > cur[0]:
                        pairs[t][key] = (score, p)
                gi += 1

# hand-written core entries win for function words and very common words
core = {}
for chunk in open(os.path.join(os.path.dirname(__file__), "core.txt"), encoding="utf-8").read().split(";"):
    if "=" in chunk:
        k, v = chunk.split("=", 1); core[k.strip()] = v.strip()

ipa = json.load(open("ipa.json")); forms = json.load(open("forms.json"))
IRR = json.load(open("irr.json"))
entries = {}
for en, rus in pairs.items():
    ezf = zf(en, "en")
    if " " not in en and ezf < 1.2:
        continue
    if " " in en and ezf < 1.0 and len(rus) < 2:
        continue
    best = sorted(rus.items(), key=lambda kv: -kv[1][0])[:6]
    entries[en] = [ipa.get(en, ""), round(ezf * 10), [[ru, p] for ru, (s, p) in best], ""]
FUNC = set("a an the of to in on at by for from with as is are am was were be been and or but if so than that this these those it its he she they we you i me him her them us my your his our their there here not no yes do does did".split())
for f in FUNC:
    if f in entries: entries[f][2] = []
for en, tr in core.items():
    e = entries.get(en) or [ipa.get(en, ""), round(zf(en, "en") * 10), [], ""]
    e[3] = tr  # short curated gloss shown first
    entries[en] = e

redir = {}
for form, lemmas in forms.items():
    if form in entries: continue
    ls = [l for l in lemmas if l in entries]
    if ls and zf(form, "en") >= 1.5:
        redir[form] = ls[0]
KEEP = set("left found lay ground felt saw lead wound bound rose fell spoke tore light ate".split())
for form, l in IRR.items():
    if l not in entries or form in core: continue
    if form in entries and form in KEEP:
        entries[form].append(l)  # e.g. "left": a word AND a form of leave
    else:
        entries.pop(form, None); redir[form] = l

EX = defaultdict(list)
for line in open("examples.txt", encoding="utf-8"):
    parts = line.rstrip("\n").split("|")
    if len(parts) == 3: EX[parts[0]].append([parts[1], parts[2]])
NOTES = {}
for line in open("notes.txt", encoding="utf-8"):
    if "|" in line: k, v = line.rstrip("\n").split("|", 1); NOTES[k] = v
def obj(e, en):
    o = {}
    if e[0]: o["i"] = e[0]
    o["z"] = e[1]
    if e[2]: o["t"] = e[2]
    if e[3]: o["c"] = e[3]
    if len(e) > 4: o["l"] = e[4]
    if EX.get(en): o["e"] = EX[en]
    if NOTES.get(en): o["n"] = NOTES[en]
    return o
for k in list(NOTES):
    if k not in entries: entries[k] = [ipa.get(k, ""), round(zf(k, "en") * 10), [], ""]
shards = defaultdict(dict)
for k, v in entries.items(): shards[k[0]][k] = obj(v, k)
for k, v in redir.items(): shards[k[0]][k] = "=" + v + ("|" + ipa[k] if ipa.get(k) else "")
os.makedirs(os.path.join(OUT, "dict"), exist_ok=True)
total = 0
for letter, d in sorted(shards.items()):
    if not re.match(r"[a-z]", letter): continue
    s = json.dumps(d, ensure_ascii=False, separators=(",", ":"))
    total += len(s.encode())
    open(os.path.join(OUT, "dict", letter + ".json"), "w", encoding="utf-8").write(s)
print("headwords", len(entries), "forms", len(redir), "bytes", total, "examples", sum(map(len, EX.values())), "notes", len(NOTES))
for w in ["say", "went", "the", "left", "make", "lighthouse"]:
    d = shards[w[0]].get(w); print(w, "->", json.dumps(d, ensure_ascii=False)[:260])
