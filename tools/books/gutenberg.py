"""Converts public-domain Project Gutenberg texts (via GITenberg mirrors) into Словочит book JSON files."""
import json, os, re, sys

SRC = sys.argv[1]; OUT = sys.argv[2]
BOOKS = [
  dict(id="happy-prince", f="The-Happy-Prince-and-Other-Tales_902/902-0.txt", title="The Happy Prince and Other Tales", author="Оскар Уайльд", level="B1", hue=[45, 20],
       head=r"^\s*(The Happy Prince|The Nightingale and the Rose|The Selfish Giant|The Devoted Friend|The Remarkable Rocket)\.?\s*$", flags=re.I),
  dict(id="oz", f="The-Wonderful-Wizard-of-Oz_55/55.txt", title="The Wonderful Wizard of Oz", author="Л. Фрэнк Баум", level="B1", hue=[120, 160],
       head=r"^\s*\d{1,2}\.\s+[A-Z][^\n]{3,60}$"),
  dict(id="just-so", f="Just-So-Stories_2781/2781-0.txt", title="Just So Stories", author="Редьярд Киплинг", level="B1–B2", hue=[30, 55],
       head=r"^(HOW THE [A-Z’' -]+|THE ELEPHANT’S CHILD|THE SING-SONG OF OLD MAN KANGAROO|THE BEGINNING OF THE ARMADILLOS|THE CRAB THAT PLAYED WITH THE SEA|THE CAT THAT WALKED BY HIMSELF|THE BUTTERFLY THAT STAMPED)\s*$"),
  dict(id="alice-original", f="Alice-s-Adventures-in-Wonderland_11/11-0.txt", title="Alice's Adventures in Wonderland", author="Льюис Кэрролл, оригинал", level="B2", hue=[300, 260],
       head=r"^CHAPTER [IVXL]+\.\s.+$"),
  dict(id="peter-pan", f="Peter-Pan_16/16-0.txt", title="Peter Pan", author="Джеймс Барри", level="B2", hue=[190, 140],
       head=r"^Chapter \d+ .+$"),
  dict(id="christmas-carol", f="A-Christmas-Carol_46/46-0.txt", title="A Christmas Carol", author="Чарльз Диккенс", level="B2", hue=[0, 340],
       head=r"^STAVE [IV]+:\s+.+$"),
  dict(id="sherlock", f="The-Adventures-of-Sherlock-Holmes_1661/1661-8.txt", title="The Adventures of Sherlock Holmes", author="Артур Конан Дойл", level="B2–C1", hue=[220, 200],
       head=r"^(ADVENTURE [IVX]+\.\s.+|[IVX]+\. THE ADVENTURE OF .+)$"),
]

def clean(text):
    text = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("﻿")
    s = re.search(r"\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG[^\n]*\n", text, re.I)
    if s: text = text[s.end():]
    e = re.search(r"\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG", text, re.I)
    if e: text = text[:e.start()]
    e = re.search(r"\n\s*End of (the )?Project Gutenberg", text, re.I)
    if e: text = text[:e.start()]
    return text

def tidy_title(t):
    t = re.sub(r"\s+", " ", t.strip())
    t = re.sub(r"^(CHAPTER [IVXL]+\.|Chapter \d+|STAVE [IV]+:|ADVENTURE [IVX]+\.|[IVX]+\.|\d{1,2}\.)\s*", "", t)
    if t.isupper(): t = t.title().replace("’S", "’s").replace("'S", "'s")
    return t

def paras(block):
    out = []
    for p in re.split(r"\n\s*\n", block):
        lines = [l.rstrip() for l in p.split("\n") if l.strip()]
        if not lines: continue
        raw = "\n".join(lines)
        if re.match(r"^\s*\[(Picture|Illustration)[^\]]*\]\s*$", raw, re.S): continue
        if re.fullmatch(r"[\s*.]+", raw): continue
        # keep verse line breaks: indented short lines
        if len(lines) > 1 and all(len(l.strip()) < 60 for l in lines) and sum(l.startswith(" ") for l in lines) >= len(lines) / 2:
            txt = " / ".join(l.strip() for l in lines)
        else:
            txt = " ".join(l.strip() for l in lines)
        txt = re.sub(r"\[(Picture|Illustration)[^\]]*\]", "", txt)
        txt = re.sub(r"_([^_]+)_", r"\1", txt).replace("_", "")
        txt = re.sub(r"\s+", " ", txt).strip()
        if txt and not re.fullmatch(r"[IVXL]+\.?", txt): out.append(txt)
    return out

os.makedirs(OUT, exist_ok=True)
catalog = []
for b in BOOKS:
    text = clean(open(os.path.join(SRC, b["f"]), encoding="utf-8", errors="replace").read())
    rx = re.compile(b["head"], re.M | b.get("flags", 0))
    ms = list(rx.finditer(text))
    # a table of contents repeats the headings: the real text starts at the last occurrence of the first heading
    key = lambda m: tidy_title(m.group(0)).lower().rstrip(".").replace(",", "")
    if ms:
        k0 = key(ms[0]); last = max(i for i, m in enumerate(ms) if key(m) == k0); ms = ms[last:]
    chs = []
    for i, m in enumerate(ms):
        body = text[m.end(): ms[i + 1].start() if i + 1 < len(ms) else len(text)]
        ps = paras(body)
        if sum(len(p) for p in ps) < 300: continue  # table-of-contents entries
        chs.append({"t": tidy_title(m.group(0)), "p": ps})
    # the same heading can appear in a table of contents first: keep only its last (real) occurrence
    seen = {}
    for i, c in enumerate(chs): seen[c["t"].lower().rstrip(".").replace(",", "")] = i
    chs = [c for i, c in enumerate(chs) if seen[c["t"].lower().rstrip(".").replace(",", "")] == i]
    for c in chs: c["t"] = c["t"].rstrip(".")
    words = sum(len(" ".join(c["p"]).split()) for c in chs)
    data = {"id": b["id"], "title": b["title"], "author": b["author"], "level": b["level"], "hue": b["hue"], "chapters": chs}
    json.dump(data, open(os.path.join(OUT, b["id"] + ".json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    catalog.append({"id": b["id"], "title": b["title"], "author": b["author"], "level": b["level"], "hue": b["hue"], "chapters": [{"t": c["t"]} for c in chs], "words": words, "classic": 1})
    print(f'{b["id"]:16} {len(chs):3} глав  {words:6} слов  | {chs[0]["t"]} … {chs[-1]["t"]} | {chs[0]["p"][0][:70]}')
json.dump(catalog, open(os.path.join(OUT, "_catalog.json"), "w", encoding="utf-8"), ensure_ascii=False)
