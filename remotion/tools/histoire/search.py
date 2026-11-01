"""Cherche des images libres de droits (Met CC0, Cleveland CC0, Library of Congress sans restriction).
Usage : python3 tools/histoire/search.py <planche.jpg> "requête 1" "requête 2" ...
Préfixes : "loc:requête" (Library of Congress), "cma:requête" (Cleveland), sinon Met.
Affiche  N | source | titre | date | url  et écrit une planche numérotée pour choisir."""
import io, json, sys, time, urllib.parse, urllib.request
from PIL import Image, ImageDraw

UA = {"User-Agent": "Mozilla/5.0 histoire-shorts"}
def get(u, raw=False):
    for k in range(4):
        try:
            r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40).read()
            return r if raw else json.loads(r)
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            time.sleep(4 * (k + 1))
        except Exception:
            time.sleep(3)
    return None

def met(q, n=6):
    r = get("https://collectionapi.metmuseum.org/public/collection/v1.1/search?hasImages=true&limit=12&q=" + urllib.parse.quote(q)) or {}
    out = []
    for i in (r.get("objectIDs") or []):
        d = get(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{i}") or {}
        time.sleep(0.25)
        if d.get("isPublicDomain") and d.get("primaryImageSmall"):
            out.append(("met", d["title"], d.get("objectDate", ""), d["primaryImageSmall"].replace("web-large", "original"), d["primaryImageSmall"]))
        if len(out) >= n: break
    return out

def cma(q, n=6):
    r = get("https://openaccess-api.clevelandart.org/api/artworks/?cc0=1&has_image=1&limit=%d&q=%s" % (n, urllib.parse.quote(q))) or {}
    out = []
    for d in r.get("data", []):
        im = d.get("images") or {}
        big = (im.get("print") or im.get("web") or {}).get("url")
        if big: out.append(("cma", d["title"], d.get("creation_date", ""), big, im["web"]["url"]))
    return out

def loc(q, n=6):
    r = get("https://www.loc.gov/photos/?fo=json&c=20&fa=online-format:image&q=" + urllib.parse.quote(q)) or {}
    out = []
    for d in r.get("results", []):
        if d.get("access_restricted") in (True, "True"): continue
        it = get(d["id"].replace("http://", "https://") + "?fo=json") or {}
        item = it.get("item", {})
        ra = item.get("rights_advisory") or ""
        rights = (" ".join(ra) if isinstance(ra, list) else ra) + " " + str(item.get("rights_information", ""))
        if "No known restrictions" not in rights: continue
        urls = [u.split("#")[0] for u in d.get("image_url", [])]
        if not urls: continue
        out.append(("loc", d.get("title", ""), d.get("date", ""), urls[-1], urls[min(1, len(urls) - 1)]))
        if len(out) >= n: break
    return out

sheet, queries = sys.argv[1], sys.argv[2:]
rows = []
for q in queries:
    src, _, qq = q.partition(":") if q.split(":")[0] in ("loc", "cma", "met") else ("met", "", q)
    res = {"met": met, "cma": cma, "loc": loc}[src](qq)
    print(f"## {q} ({len(res)})")
    for s, t, d, big, small in res:
        rows.append((s, t, d, big, small))
        print(f"{len(rows):3d} | {s} | {t[:70]} | {d} | {big}")
cols = 6
S = Image.new("RGB", (cols * 200, ((len(rows) + cols - 1) // cols) * 215 or 10), (35, 35, 35))
dr = ImageDraw.Draw(S)
for k, r in enumerate(rows):
    x, y = (k % cols) * 200, (k // cols) * 215
    try:
        im = Image.open(io.BytesIO(get(r[4], raw=True))).convert("RGB"); im.thumbnail((195, 190)); S.paste(im, (x, y))
    except Exception: pass
    dr.rectangle((x, y, x + 34, y + 18), fill="black"); dr.text((x + 3, y + 3), str(k + 1), fill="yellow")
S.save(sheet)
