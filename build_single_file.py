#!/usr/bin/env python3
"""Build a self-contained HTML from the modular Smart E-Mobility project.
Run from the project folder: python build_single_file.py
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
index = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
index = re.sub(r'<link rel="stylesheet" href="\./css/styles\.css">', '<style>\n' + css + '\n</style>', index)
pattern = re.compile(r'<script defer src="\./js/([^"]+)"></script>')
def inline(match):
    rel = match.group(1)
    content = (ROOT / "js" / rel).read_text(encoding="utf-8")
    return '<script>\n' + content + '\n</script>'
index = pattern.sub(inline, index)
out = ROOT / "Smart_E_Mobility_Diagrams_Single_File.html"
out.write_text(index, encoding="utf-8")
print(f"Built: {out}")
