"""Builds the deployable site into dist/: copies files, draws icons, writes the service worker with a precache list."""
import hashlib, json, os, shutil, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")

def icon(size, maskable=False):
    s = size * 4  # supersample
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    bg = (17, 19, 21, 255); mint = (61, 214, 163, 255); pale = (236, 237, 238, 255)
    if maskable: d.rectangle([0, 0, s, s], fill=bg)
    else: d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=bg)
    k = 0.78 if maskable else 1.0
    c = s / 2
    def P(x, y): return (c + (x - 0.5) * s * k, c + (y - 0.5) * s * k)
    # open book: two pages meeting at the spine
    left = [P(0.20, 0.33), P(0.47, 0.38), P(0.47, 0.74), P(0.20, 0.69)]
    right = [P(0.53, 0.38), P(0.80, 0.33), P(0.80, 0.69), P(0.53, 0.74)]
    d.polygon(left, fill=pale); d.polygon(right, fill=mint)
    # text lines on the left page
    for i, y in enumerate([0.46, 0.53, 0.60]):
        x2 = 0.41 if i < 2 else 0.35
        d.line([P(0.26, y - 0.012 + 0.0), P(x2, y + 0.006)], fill=(17, 19, 21, 180), width=max(2, int(s * 0.018)))
    # translation spark above the right page
    sx, sy = P(0.66, 0.20); r = s * 0.075 * k
    d.polygon([(sx, sy - r), (sx + r * .28, sy - r * .28), (sx + r, sy), (sx + r * .28, sy + r * .28), (sx, sy + r), (sx - r * .28, sy + r * .28), (sx - r, sy), (sx - r * .28, sy - r * .28)], fill=mint)
    return img.resize((size, size), Image.LANCZOS)

def main():
    if os.path.exists(DIST): shutil.rmtree(DIST)
    os.makedirs(DIST)
    for item in ["index.html", "style.css", "app.js", "content.js", "manifest.webmanifest", "dict", "books", "fonts", "lib", "LICENSE-DATA.md", "README.md"]:
        src = os.path.join(ROOT, item)
        if os.path.isdir(src): shutil.copytree(src, os.path.join(DIST, item))
        elif os.path.exists(src): shutil.copy(src, DIST)
    os.makedirs(os.path.join(DIST, "icons"))
    icon(180).save(os.path.join(DIST, "icons", "apple-touch-icon.png"))
    icon(192).save(os.path.join(DIST, "icons", "icon-192.png"))
    icon(512).save(os.path.join(DIST, "icons", "icon-512.png"))
    icon(512, True).save(os.path.join(DIST, "icons", "icon-512-maskable.png"))
    files = ["./"]; h = hashlib.sha256()
    for dp, _, fs in os.walk(DIST):
        for f in sorted(fs):
            rel = os.path.relpath(os.path.join(dp, f), DIST).replace(os.sep, "/")
            if rel.endswith(".md") or rel.startswith("lib/tf/") or rel == "books/_catalog.json": continue  # offline translator is cached on demand
            files.append(rel); h.update(rel.encode()); h.update(open(os.path.join(dp, f), "rb").read())
    h.update(open(os.path.join(ROOT, "sw.js"), "rb").read())
    ver = h.hexdigest()[:10]
    sw = open(os.path.join(ROOT, "sw.js"), encoding="utf-8").read().replace("__VERSION__", ver).replace("__FILES__", json.dumps(sorted(files), ensure_ascii=False))
    open(os.path.join(DIST, "sw.js"), "w", encoding="utf-8").write(sw)
    open(os.path.join(DIST, ".nojekyll"), "w").write("")
    size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(DIST) for f in fs)
    print("version", ver, "files", len(files), "size %.1f MB" % (size / 1e6))

main()
