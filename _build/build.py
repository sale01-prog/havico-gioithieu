"""content.json + _build/index.html.j2 -> index.html; du-an.json -> du-an/*.html + sitemap.xml. Needs jinja2 (pip install jinja2).
Runs on GitHub (.github/workflows/pages.yml) after every Pages CMS save; run it locally to preview."""
import json, os, re, glob, unicodedata
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup, escape

O = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# door photos and 3D offsets, in the order of products.doors
DOORS = [
    {"style": "--ar:255/640;--l:7.8%;--t:4.5%;--r:7.5%", "room": "door-room-fire.webp?v=4", "leaf": "door-fire-leaf-hd.webp?v=2", "frame": "door-fire-frame-hd.webp?v=2"},
    {"style": "--ar:191/535;--l:9.8%;--t:3.5%;--r:10%", "room": "door-room-room.webp?v=5", "leaf": "door-room-leaf-hd.webp", "frame": "door-room-frame-hd.webp"},
    {"style": "--ar:279/624;--l:8%;--t:4.2%;--r:8.8%", "room": "door-room-wc.webp?v=5", "leaf": "door-wc-leaf-hd.webp", "frame": "door-wc-frame-hd.webp"},
]

env = Environment(loader=FileSystemLoader(os.path.join(O, "_build")), autoescape=True, keep_trailing_newline=True,
                  finalize=lambda x: "" if x is None else x)  # the CMS saves cleared fields as null
env.filters["u"] = lambda p: (p or "").lstrip("/")  # CMS stores /img/...; relative keeps local previews working
env.filters["br"] = lambda s: Markup("<br>").join(escape(x) for x in (s or "").split("\n"))
env.filters["tel"] = lambda s: re.sub(r"[^\d+]", "", s or "")
env.globals["DOORS"] = DOORS
env.policies["json.dumps_kwargs"] = {"ensure_ascii": False}

def write(path, html):
    open(os.path.join(O, path), "w", encoding="utf-8", newline="\n").write(html)

def slugify(s):
    s = unicodedata.normalize("NFD", s.replace("đ", "d").replace("Đ", "D"))
    return re.sub(r"[^a-z0-9]+", "-", "".join(c for c in s if not unicodedata.combining(c)).lower()).strip("-")

# projects added in the CMS may come without a slug or photos
P = [p for p in json.load(open(os.path.join(O, "du-an.json"), encoding="utf-8"))["projects"] if p.get("name") and p.get("images")]
for p in P:
    p["slug"] = slugify(p.get("slug") or p["name"])

C = json.load(open(os.path.join(O, "content.json"), encoding="utf-8"))
html = env.get_template("index.html.j2").render(**C, project_count=len(P), project_names={p["slug"]: p["name"] for p in P}, featured=[p for p in P if p.get("featured")][:5])
write("index.html", html)
print("index.html", len(html), "bytes")

os.makedirs(os.path.join(O, "du-an"), exist_ok=True)
for f in glob.glob(os.path.join(O, "du-an", "*.html")):  # drop pages of deleted projects
    os.remove(f)
write("du-an/index.html", env.get_template("du-an-list.html.j2").render(projects=P))
for i, p in enumerate(P):
    write(f"du-an/{p['slug']}.html", env.get_template("du-an.html.j2").render(p=p, others=(P[i + 1:] + P[:i])[:3]))
urls = ["", "du-an/"] + [f"du-an/{p['slug']}.html" for p in P]
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + "".join(f"  <url><loc>https://havicof.vn/{u}</loc></url>\n" for u in urls) + "</urlset>\n")
print(len(P), "project pages")
