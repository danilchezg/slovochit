"""Converts the Mueller English-Russian dictionary (7th ed., GPL-2.0+, Debian/Ubuntu package mueller7accent-dict)
into Словочит shards: dict/m/<2 letters>.json = {word: [[pos, [sense, ...]], ...]}.
Usage: python3 mueller.py <dir with mueller7accent.index and .dict.dz> <out dict dir> [ipa.json]"""
import gzip, json, os, re, sys
from collections import defaultdict

SRC, OUT = sys.argv[1], sys.argv[2]
B = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
def b64(s):
    n = 0
    for c in s: n = n * 64 + B.index(c)
    return n
data = gzip.open(os.path.join(SRC, "mueller7accent.dict.dz")).read()
POS = {"n": "сущ.", "v": "гл.", "a": "прил.", "adv": "нареч.", "prep": "предл.", "pron": "мест.", "cj": "союз", "int": "межд.", "num": "числ.", "pl": "мн. ч.", "attr": "атрибут.", "p": "прош. вр.", "p-p": "прич.", "pres-p": "прич. наст.", "predic": "предикат.", "emph": "усил.", "sing": "ед. ч."}
LABELS = {"разг.": "разг.", "уст.": "уст.", "перен.": "перен.", "амер.": "амер.", "поэт.": "поэт.", "презр.": "пренебр.", "груб.": "груб.", "шутл.": "шутл.", "ирон.": "ирон.", "книжн.": "книжн."}
RUV = "АЕЁИОУЫЭЮЯ"

def stress(s):
    # Mueller marks the stressed Russian vowel by writing it in upper case: вызывАющий → вызыва́ющий
    def fix(m):
        w = m.group(0)
        if w.isupper() and len(w) > 1: return w  # abbreviations like США
        out = ""
        for ch in w:
            if ch in RUV and ch != "Ё": out += ch.lower() + "́"
            elif ch == "Ё": out += "ё"
            else: out += ch
        return out
    return re.sub(r"[А-Яа-яЁё]+", lambda m: fix(m) if re.search(r"[а-яё]", m.group(0)) or len(m.group(0)) == 1 else fix(m), s)

def clean(t):
    t = re.sub(r"\{[^}]*\}", "", t)                     # {см. тж.}
    t = re.sub(r"_([а-яё]+\.)", lambda m: m.group(1), t)  # _разг. → разг.
    t = re.sub(r"_([a-z\-]+)\.", lambda m: POS.get(m.group(1), m.group(1)) , t)
    t = t.replace("_", "")
    t = re.sub(r"\s+", " ", t).strip(" ;,")
    return stress(t)

def parse(body):
    lines = body.split("\n")[1:]  # first line repeats the headword
    text = "\n".join(lines)
    text = re.sub(r"^\s*\[[^\]]*\]", "", text.strip())  # transcription
    groups = []; cur = None
    # top-level: "1. _n." blocks; senses: "1) ..."
    chunks = re.split(r"\n\s*(?=\d+\.\s)", "\n" + text)
    for ch in chunks:
        ch = ch.strip()
        if not ch: continue
        m = re.match(r"^\d+\.\s*(.*)", ch, re.S)
        if m: ch = m.group(1)
        pm = re.match(r"^_([a-z\-]+)\.\s*", ch)
        pos = ""
        if pm: pos = POS.get(pm.group(1), pm.group(1)); ch = ch[pm.end():]
        ch = re.sub(r"\s*\n\s*", " ", ch)
        senses = [s for s in re.split(r"\s*\d+\)\s*", ch) if s.strip()]
        senses = [clean(s) for s in senses]
        senses = [s for s in senses if s and not re.fullmatch(r"[\W\d]*", s)]
        if senses: groups.append([pos, senses[:12]])
    return groups

IPA = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else {}
shards = defaultdict(dict); n = skip = 0
seen = set()
for line in open(os.path.join(SRC, "mueller7accent.index"), encoding="utf-8", errors="replace"):
    p = line.rstrip("\n").split("\t")
    if len(p) < 3: continue
    w = p[0].strip().lower()
    if not re.fullmatch(r"[a-z][a-z' \-]{0,40}", w) or w in seen: continue
    seen.add(w)
    o, l = b64(p[1]), b64(p[2]); body = data[o:o + l].decode("utf-8", "replace")
    if re.search(r"_p\. от |_p-p\. от |_pl\. от |_pres-p\. от ", body[:200]) and body.count("\n") < 4:
        skip += 1; continue  # bare "went — p. от go": handled by form redirects
    g = parse(body)
    if not g: continue
    key = re.sub(r"[^a-z]", "_", (w + "__")[:2])
    shards[key][w] = [IPA.get(w, ""), g]; n += 1
os.makedirs(os.path.join(OUT, "m"), exist_ok=True)
for old in os.listdir(os.path.join(OUT, "m")): os.remove(os.path.join(OUT, "m", old))
tot = 0
for k, d in shards.items():
    s = json.dumps(d, ensure_ascii=False, separators=(",", ":")); tot += len(s.encode())
    open(os.path.join(OUT, "m", k + ".json"), "w", encoding="utf-8").write(s)
print("entries", n, "skipped forms", skip, "shards", len(shards), "MB %.1f" % (tot / 1e6))
for w in ["abhorrent", "whisper", "run", "give"]:
    k = re.sub(r"[^a-z]", "_", (w + "__")[:2]); print(w, json.dumps(shards[k].get(w), ensure_ascii=False)[:300])
