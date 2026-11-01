"""Plages d'images où il y a du motion design (seules celles-ci sont rendues par Remotion).

Usage : python3 tools/gfx_ranges.py src/data/video.json sortie.json [fin_en_secondes]
"""
import json
import sys

e = json.load(open(sys.argv[1]))
F = 30
limit = float(sys.argv[3]) if len(sys.argv) > 3 else e["duration"]
r = [(t["at"], t["at"] + t["dur"]) for t in e["titles"]]
for c in e["chapters"]:
    r.append((c["at"] + 0.2, c["at"] + 2.4))
    r.append((c["at"] + 2.4, c["at"] + 7.0))
r += [(t["at"], t["at"] + t["dur"]) for t in e["tips"]]
r += [(p["at"], p["at"] + p["dur"]) for p in e["pops"]]
r.append((e["endScreenAt"], e["duration"]))
last = round(e["duration"] * F) - 1
r = sorted((max(0, int(a * F)), min(int(b * F) + 1, last)) for a, b in r if a < limit)
m = []
for a, b in r:
    if m and a <= m[-1][1] + 15:  # fusionne les plages proches (évite les petits rendus)
        m[-1] = (m[-1][0], max(b, m[-1][1]))
    else:
        m.append((a, b))
m = [(a, min(b, int(limit * F))) for a, b in m]
json.dump(m, open(sys.argv[2], "w"))
print(len(m), "plages,", sum(b - a + 1 for a, b in m), "images")
