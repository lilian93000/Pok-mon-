"""Petit helper pour écrire les épisodes en Python : from ep import *"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2] / "histoire" / "episodes"
def met(path, cut=True, credit=""): return {"url": "https://images.metmuseum.org/CRDImages/" + path, "cut": cut, "credit": credit + " — The Met (CC0)"}
def cma(acc, cut=True, credit=""): return {"url": f"https://openaccess-cdn.clevelandart.org/{acc}/{acc}_print.jpg", "cut": cut, "credit": credit + " — Cleveland Museum of Art (CC0)"}
def loc(url, cut=False, credit=""): return {"url": url, "cut": cut, "credit": credit + " — Library of Congress (sans restriction connue)"}
def url(u, cut=False, credit=""): return {"url": u, "cut": cut, "credit": credit}
def B(text, img=None, red=False, **k):
    b = {"text": text, "bg": "red" if red else "dark"}
    if red: b["rays"] = True
    if img: b["image"] = img
    b.update(k); return b
OUTRO = {"text": "Un fait d'histoire par jour. *Abonnez-vous*.", "bg": "dark", "outro": True}
def save(id, titre, sources, images, beats):
    e = {"id": id, "titre": titre, "duree": 60, "sources": sources, "images": images, "beats": beats + [OUTRO]}
    json.dump(e, open(ROOT / f"{id}.json", "w"), ensure_ascii=False, indent=2)

SEARCH = Path("/tmp/claude-0/-home-user-Pok-mon-/4e4a5f22-f6ab-55a0-968b-f8fc8937ced5/scratchpad/s")
def pick(sheet, n, cut=False, credit=""):
    """Image n° n de la planche de recherche <sheet> (s/<sheet>.txt)."""
    for line in open(SEARCH / f"{sheet}.txt"):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 5 and parts[0].isdigit() and int(parts[0]) == n:
            src, title, date, u = parts[1], parts[2], parts[3], parts[4]
            lic = {"met": "The Met (CC0)", "cma": "Cleveland Museum of Art (CC0)", "loc": "Library of Congress (sans restriction connue)"}[src]
            return {"url": u, "cut": cut, "credit": f"{credit or title}, {date} — {lic}"}
    raise KeyError(f"{sheet}#{n}")
