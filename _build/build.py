"""content.json + _build/index.html.j2 -> index.html. Needs jinja2 (pip install jinja2).
Runs on GitHub (.github/workflows/pages.yml) after every Pages CMS save; run it locally to preview."""
import json, os, re
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup, escape

O = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# door photos and 3D offsets, in the order of products.doors
DOORS = [
    {"style": "--ar:255/640;--l:7.8%;--t:4.5%;--r:7.5%", "room": "pr-vlasta-2.webp", "leaf": "door-fire-leaf.webp", "frame": "door-fire-frame.webp"},
    {"style": "--ar:191/535;--l:9.8%;--t:3.5%;--r:10%", "room": "col-bed-2.webp", "leaf": "door-room-leaf.webp", "frame": "door-room-frame.webp"},
    {"style": "--ar:279/624;--l:8%;--t:4.2%;--r:8.8%", "room": "behind-bath.webp", "leaf": "door-wc-leaf.webp", "frame": "door-wc-frame.webp"},
]

env = Environment(loader=FileSystemLoader(os.path.join(O, "_build")), autoescape=True, keep_trailing_newline=True,
                  finalize=lambda x: "" if x is None else x)  # the CMS saves cleared fields as null
env.filters["u"] = lambda p: (p or "").lstrip("/")  # CMS stores /img/...; relative keeps local previews working
env.filters["br"] = lambda s: Markup("<br>").join(escape(x) for x in (s or "").split("\n"))
env.filters["tel"] = lambda s: re.sub(r"[^\d+]", "", s or "")
env.globals["DOORS"] = DOORS
env.policies["json.dumps_kwargs"] = {"ensure_ascii": False}

C = json.load(open(os.path.join(O, "content.json"), encoding="utf-8"))
html = env.get_template("index.html.j2").render(**C)
open(os.path.join(O, "index.html"), "w", encoding="utf-8", newline="\n").write(html)
print("index.html", len(html), "bytes")
