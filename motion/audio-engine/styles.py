"""Styles musicaux originaux pour les vidéos « utiles » (une mesure = 16 pas).

Chaque style pose `nbars` mesures à partir de t0 sur un Bus, et ajoute ses grosses caisses à `kicks`
(pour le ducking). Tous les motifs sont écrits ici (aucun échantillon externe).
  bossa       — bossa nova : guitare en accords syncopés, rim, shaker, basse en quinte
  futurebass  — future bass : accords supersaw « wobble », trap en demi-temps
  baroque     — pop baroque : clavecin en arpèges, pizz, grosse caisse douce
  neosoul     — néo-soul : piano électrique, batterie traînante, basse ronde
  afro        — afrobeat : guitare en notes piquées, cloche, toms, shaker
  dembow      — dembow : grosse caisse en 4, caisse « boom-ch-boom-chick », synthé pluck
  citypop     — city pop : piano électrique, basse slappée, batterie disco douce
  ska         — ska : guitare sur les contretemps, cuivres de synthé, batterie rapide
  reggae      — reggae (one drop) : skank d'orgue, basse ronde, caisse sur le 3
  indie       — indie pop : guitare en arpèges clairs, batterie droite, tambourin
  calypso     — calypso : steel-drum en rebonds, basse sautillante, shaker
  country     — country : banjo en roulements, basse alternée, batterie « train »
  synthpop    — synthpop 80 : arpège de scie brillant, caisse claire « gated », basse en croches
  triphop     — trip-hop : batterie lente et lourde, nappe sombre, piano électrique feutré
  tango       — tango : accords staccato (bandonéon de synthé), rythme habanera, basse marquée
  bhangra     — bhangra : dhol (grave + claquement) en chaal, tumbi aigu en riff
  jazz        — jazz : contrebasse qui marche, cymbale ride swing, accords de piano
  celtic      — celtique : gigue en triolets (flûte de synthé), bodhrán, bourdon
  electropop  — électropop : basse synthé en croches, accords brillants, claps
  samba       — samba : surdo, tamborim en doubles, cuíca de synthé, cavaquinho
  flamenco    — rumba flamenca : guitare en rasgueado, palmas, cajón
  dub         — dub : skank d'orgue avec écho, basse très ronde, caisse sur le 3
  highlife    — highlife : guitares en arpèges croisés, cloche, congas
  klezmer     — klezmer : clarinette de synthé en mineur harmonique, oum-pa, tambour
  chillwave   — chillwave : nappes floues, batterie douce, arpège filtré
  zouk        — zouk : « tic-ta-tac » de rim, basse chaloupée, nappes de synthé
  trance      — trance : arpège en doubles croches, supersaw, grosse caisse à la noire
  breakbeat   — breakbeat : batterie cassée syncopée, basse acide, stabs
  soul        — soul : piano électrique, basse Motown, tambourin, claps sur 2 et 4
  baile       — baile funk : tamborzão (grosse caisse et toms en rafales), voix découpées
  lofi        — lo-fi hip-hop : piano électrique feutré, batterie traînante, souffle de vinyle
  disco       — disco : grosse caisse à la noire, charleston ouvert, basse en octaves, cordes
  dnb         — drum & bass : break rapide (grosse caisse 1 et 11, caisse 5 et 13), basse ronde, nappe
  gospel      — gospel : orgue en accords, claps sur 2 et 4, basse qui marche, chœur « oh »
  mambo       — mambo : piano en montuno, clave 2-3, cloche, congas, basse en tumbao
  house       — deep house : grosse caisse à la noire, accords d'orgue en contretemps, basse ronde
  garage      — UK garage : 2-step (grosse caisse décalée), accords hachés, voix découpées
  cumbia      — cumbia : güiro, accordéon de synthé, basse « oum-pa » sur 1 et 3
  swing       — électro-swing : contrebasse qui marche, cuivres, charleston swing, caisse sur 2 et 4
  amapiano    — amapiano : log drum (basse percussive glissée), shaker, piano en accords
  phonk       — phonk : mélodie de cloche 808, basse 808 saturée, charleston en triolets
  rockabilly  — rockabilly : contrebasse slappée qui marche, guitare « twang », caisse claire au balai
  jersey      — jersey club : grosse caisse en rebonds, voix découpées, claps rapides
  fanfare     — fanfare : cuivres en accords, tuba « oum-pa », roulements de caisse claire
  ukulele     — ukulélé pop : grattage aigu, claps, glockenspiel, grosse caisse légère
"""
import numpy as np

import engine as E


def _chord_hits(bus, ch, t, L, gain, inst, pan=0.0, rev=0.2):
    for n in ch:
        bus.add(inst(n, L), t, gain / len(ch) * 1.8, pan=pan, rev=rev, duck=True)


def nylon(note, L=0.5):
    t = E.secs(L)
    f = E.midi(note)
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (5 + 4 * k)) / k ** 1.3 for k in (1, 2, 3, 4, 5))
    return s * np.minimum(t / 0.004, 1) * 0.4


def harpsi(note, L=0.4):
    t = E.secs(L)
    f = E.midi(note)
    s = E.saw(f, t) * 0.6 + E.sq(f * 2, t) * 0.2
    return E.highpass(s, 300) * np.exp(-t * 7) * 0.3


def rim(L=0.06):
    t = E.secs(L)
    return (np.sin(2 * np.pi * 1700 * t) * 0.6 + E.bandpass(E.noise(L), 2000, 6000)) * np.exp(-t * 90) * 0.5


def shaker(L=0.06):
    t = E.secs(L)
    return E.highpass(E.noise(L), 6000) * np.sin(np.pi * np.clip(t / L, 0, 1)) * 0.35


def bell(note, L=0.25):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.4 * t)) * np.exp(-t * 16) * 0.3


def tom(note=45, L=0.3):
    t = E.secs(L)
    f = E.midi(note) * (1 + 0.5 * np.exp(-t * 30))
    return np.sin(np.cumsum(2 * np.pi * f / E.SR)) * np.exp(-t * 9) * 0.6


def ding(note=86, L=0.6):
    t = E.secs(L)
    return (np.sin(2 * np.pi * E.midi(note) * t) + 0.3 * np.sin(2 * np.pi * E.midi(note + 12) * t)) * np.exp(-t * 6) * 0.3


def style(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    if name in ("phonk", "rockabilly", "jersey", "fanfare", "ukulele"):
        return style9(name, bus, kicks, t0, nbars, BAR, prog, gain, drums)
    if name in ("house", "garage", "cumbia", "swing", "amapiano"):
        return style8(name, bus, kicks, t0, nbars, BAR, prog, gain, drums)
    if name in ("lofi", "disco", "dnb", "gospel", "mambo"):
        return style7(name, bus, kicks, t0, nbars, BAR, prog, gain, drums)
    if name in ("zouk", "trance", "breakbeat", "soul", "baile"):
        return style6(name, bus, kicks, t0, nbars, BAR, prog, gain, drums)
    if name in ("flamenco", "dub", "highlife", "klezmer", "chillwave"):
        return style5(name, bus, kicks, t0, nbars, BAR, prog, gain, drums)
    if name in ("bhangra", "jazz", "celtic", "electropop", "samba"):
        return style4(name, bus, kicks, t0, nbars, BAR, prog, gain, drums)
    if name in ("calypso", "country", "synthpop", "triphop", "tango"):
        return style3(name, bus, kicks, t0, nbars, BAR, prog, gain, drums)
    if name in ("dembow", "citypop", "ska", "reggae", "indie"):
        return style2(name, bus, kicks, t0, nbars, BAR, prog, gain, drums)
    STEP = BAR / 16
    K = E.kick(top=150, low=48, drive=1.8)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "bossa":
            for s in (0, 3, 6, 10, 13):
                _chord_hits(bus, [n + 12 for n in ch], at(s), STEP * 2.5, 0.5 * gain, nylon, pan=-0.15)
            if drums:
                for s in (0, 8):
                    bus.add(K, at(s), 0.55 * gain)
                    kicks.append(at(s))
                for s in (3, 6, 10, 12):
                    bus.add(rim(), at(s), 0.35 * gain, pan=0.2)
                for s in range(16):
                    bus.add(shaker(), at(s), (0.18 if s % 2 else 0.1) * gain, pan=0.3)
            bus.add(E.bass808(ch[0] - 24, STEP * 5, drive=1.2), at(0), 0.5 * gain)
            bus.add(E.bass808(ch[0] - 17, STEP * 5, drive=1.2), at(8), 0.45 * gain)
        elif name == "futurebass":
            for s, L in ((0, 4), (6, 2), (10, 6)):
                bus.add(E.supersaw([n + 12 for n in ch], STEP * L, cutoff=5000), at(s), 0.3 * gain, rev=0.3, duck=True)
            if drums:
                for s in (0, 10) if b % 2 == 0 else (0, 7, 10):
                    bus.add(K, at(s), 0.85 * gain)
                    kicks.append(at(s))
                bus.add(E.clap(), at(8), 0.55 * gain, rev=0.3)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.035), at(s), 0.18 * gain, pan=0.25)
                if b % 2:
                    for k in range(6):
                        bus.add(E.hat(0.03, tone=1.2), at(12) + k * STEP * 2 / 3, (0.12 + 0.03 * k) * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 9, drive=2.0), at(0), 0.6 * gain)
        elif name == "baroque":
            arp = [0, 1, 2, 1, 2, 3 % len(ch), 2, 1]
            for k, a in enumerate(arp * 2):
                bus.add(harpsi(ch[a] + 12, STEP * 1.2), at(k), 0.4 * gain, pan=0.2 * (-1) ** k, rev=0.2, duck=True)
            if drums:
                for s in (0, 8):
                    bus.add(K, at(s), 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.2, tone=230, crack=0.5), at(s), 0.35 * gain, rev=0.3)
            bus.add(E.bass808(ch[0] - 24, STEP * 7, drive=1.2), at(0), 0.45 * gain)
            bus.add(E.bass808(ch[1] - 24, STEP * 7, drive=1.2), at(8), 0.4 * gain)
        elif name == "neosoul":
            sw = lambda s: at(s) + (STEP * 0.25 if s % 2 else 0)  # noqa: E731
            for s in (0, 7, 11):
                for n in ch:
                    bus.add(E.ep(n + 12, STEP * 5), sw(s), 0.3 * gain / len(ch) * 2.5, pan=-0.1, rev=0.3, duck=True)
            if drums:
                for s in (0, 9, 10):
                    bus.add(K, sw(s), 0.7 * gain)
                    kicks.append(sw(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.3, tone=190, crack=0.7), sw(s) + STEP * 0.15, 0.45 * gain, rev=0.3)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.04), sw(s), 0.14 * gain, pan=0.25)
            bus.add(E.bass808(ch[0] - 24, STEP * 6, drive=1.3), sw(0), 0.55 * gain)
            bus.add(E.bass808(ch[2] - 24, STEP * 4, drive=1.3), sw(10), 0.45 * gain)
        elif name == "afro":
            for s in (0, 3, 5, 8, 11, 13):
                bus.add(nylon(ch[(s // 3) % len(ch)] + 24, STEP * 1.2), at(s), 0.35 * gain, pan=0.25, rev=0.15, duck=True)
            if drums:
                for s in (0, 6, 10):
                    bus.add(K, at(s), 0.75 * gain)
                    kicks.append(at(s))
                for s in (0, 3, 6, 8, 10, 12, 14):
                    bus.add(bell(84), at(s), 0.3 * gain, pan=-0.3)
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.4 * gain, rev=0.2)
                for s in (13, 14, 15):
                    bus.add(tom(45 + 3 * (15 - s)), at(s), 0.35 * gain)
                for s in range(16):
                    bus.add(shaker(), at(s), (0.16 if s % 2 else 0.08) * gain, pan=0.3)
            bus.add(E.bass808(ch[0] - 24, STEP * 3, drive=1.5), at(0), 0.55 * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 2, drive=1.5), at(6), 0.45 * gain)
            bus.add(E.bass808(ch[1] - 24, STEP * 3, drive=1.5), at(10), 0.5 * gain)


def brass(note, L=0.2):
    t = E.secs(L)
    f = E.midi(note)
    s = np.tanh((E.saw(f, t) + 0.5 * E.saw(f * 1.005, t)) * 1.4)
    return E.lowpass(s, 2600) * np.minimum(t / 0.015, 1) * np.exp(-np.maximum(t - L * 0.6, 0) * 25) * 0.25


def organ(note, L=0.15):
    t = E.secs(L)
    f = E.midi(note)
    s = sum(np.sin(2 * np.pi * f * k * t) / k for k in (1, 2, 3, 4))
    return s * np.minimum(t / 0.004, 1) * np.exp(-t * 14) * 0.25


def tamb(L=0.1):
    t = E.secs(L)
    return E.highpass(E.noise(L), 7000) * np.exp(-t * 30) * 0.4


def style2(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    STEP = BAR / 16
    K = E.kick(top=160, low=48, drive=2.0)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "dembow":
            for s in (0, 3, 6, 10, 14):
                bus.add(E.pluck(ch[(s // 3) % len(ch)] + 12, STEP * 1.5, bright=5000), at(s), 0.4 * gain, pan=0.2, rev=0.2, duck=True)
            if drums:
                for s in (0, 4, 8, 12):
                    bus.add(K, at(s), 0.8 * gain)
                    kicks.append(at(s))
                for s in (3, 6, 11, 14):
                    bus.add(E.snare(L=0.15, tone=240, crack=1.0), at(s), 0.45 * gain, rev=0.15)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.03), at(s), 0.15 * gain, pan=0.25)
            bus.add(E.bass808(ch[0] - 24, STEP * 7, drive=2.2), at(0), 0.55 * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 5, drive=2.2), at(8), 0.5 * gain)
        elif name == "citypop":
            for s in (0, 6, 10):
                for n in ch:
                    bus.add(E.ep(n + 12, STEP * 4), at(s), 0.28 * gain / len(ch) * 2.5, pan=-0.1, rev=0.3, duck=True)
            if drums:
                for s in (0, 4, 8, 12):
                    bus.add(K, at(s), 0.65 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.4 * gain, rev=0.25)
                for s in range(2, 16, 4):
                    bus.add(E.hat(0.12, open_=True), at(s), 0.14 * gain, pan=0.25)
            for s, d in ((0, 0), (3, 12), (6, 7), (10, 0), (13, 12)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * 1.6, drive=2.6), at(s), 0.45 * gain)
        elif name == "ska":
            for s in (2, 6, 10, 14):
                for n in ch:
                    bus.add(nylon(n + 12, STEP * 0.9), at(s), 0.3 * gain, pan=0.25, rev=0.1, duck=True)
            if b % 2 == 1:
                for s, n in ((0, 12), (3, 14), (6, 16)):
                    bus.add(brass(ch[0] + n, STEP * 2), at(s), 0.45 * gain, pan=-0.2, rev=0.2)
            if drums:
                for s in (0, 8):
                    bus.add(K, at(s), 0.7 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.2, tone=220, crack=0.9), at(s), 0.45 * gain, rev=0.2)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.03), at(s), 0.15 * gain, pan=0.25)
            for s in (0, 4, 8, 12):
                bus.add(E.bass808(ch[(s // 4) % len(ch)] - 24, STEP * 3.5, drive=1.6), at(s), 0.45 * gain)
        elif name == "reggae":
            for s in (4, 12):
                for n in ch:
                    bus.add(organ(n + 12, STEP * 1.5), at(s), 0.35 * gain, pan=0.2, rev=0.2, duck=True)
            if drums:
                bus.add(K, at(8), 0.75 * gain)
                kicks.append(at(8))
                bus.add(rim(), at(8), 0.45 * gain)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.03), at(s) + (STEP * 0.3 if s % 4 == 2 else 0), 0.14 * gain, pan=0.25)
            for s, d, L in ((0, 0, 3), (3, 0, 2), (6, 7, 2), (10, 5, 3), (13, 7, 2)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * L, drive=1.2), at(s), 0.55 * gain)
        elif name == "indie":
            arp = [0, 1, 2, 1] * 4
            for k, a in enumerate(arp):
                bus.add(nylon(ch[a % len(ch)] + 24, STEP * 2), at(k), 0.3 * gain, pan=0.25 * (-1) ** k, rev=0.3, duck=True)
            if drums:
                for s in (0, 8, 10):
                    bus.add(K, at(s), 0.7 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.25, tone=200, crack=0.7), at(s), 0.45 * gain, rev=0.25)
                for s in range(0, 16, 2):
                    bus.add(tamb(), at(s), 0.15 * gain, pan=0.3)
            bus.add(E.bass808(ch[0] - 24, STEP * 7, drive=1.3), at(0), 0.5 * gain)
            bus.add(E.bass808(ch[1] - 24, STEP * 7, drive=1.3), at(8), 0.45 * gain)


def steel(note, L=0.4):
    t = E.secs(L)
    f = E.midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 10) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 18)
    return s * np.minimum(t / 0.003, 1) * np.exp(-t * 5) * 0.22


def banjo(note, L=0.25):
    t = E.secs(L)
    f = E.midi(note)
    s = E.saw(f, t) * 0.5 + E.sq(f, t) * 0.2
    return E.bandpass(s, 600, 5000) * np.exp(-t * 16) * 0.5


def bando(notes, L=0.18):
    t = E.secs(L)
    s = sum(E.saw(E.midi(n), t) + 0.5 * E.sq(E.midi(n) * 0.5, t) for n in notes)
    env = np.minimum(t / 0.01, 1) * np.exp(-np.maximum(t - L * 0.5, 0) * 30)
    return E.lowpass(np.tanh(s * 0.6), 2200) * env * 0.35 / len(notes) * 2


def gated(L=0.22):
    t = E.secs(L)
    n = E.bandpass(E.noise(L), 700, 6000) * (t < 0.15)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 20)
    return (n * 0.6 + tone * 0.5) * 0.7


def style3(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    STEP = BAR / 16
    K = E.kick(top=150, low=48, drive=1.8)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "calypso":
            pat = [(0, 2), (3, 1), (6, 0), (8, 2), (10, 1), (12, 2), (14, 3 % len(ch))]
            for s, i in pat:
                bus.add(steel(ch[i % len(ch)] + 12), at(s), 0.5 * gain, pan=0.2 * (-1) ** s, rev=0.25, duck=True)
            if drums:
                for s in (0, 6, 8, 14):
                    bus.add(K, at(s), 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(rim(), at(s), 0.4 * gain)
                for s in range(16):
                    bus.add(shaker(), at(s), (0.16 if s % 2 else 0.08) * gain, pan=0.3)
            for s, d in ((0, 0), (4, 7), (8, 0), (11, 7), (14, 12)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * 2, drive=1.4), at(s), 0.45 * gain)
        elif name == "country":
            roll = [0, 1, 2, 1, 0, 2, 1, 2] * 2
            for k, i in enumerate(roll):
                bus.add(banjo(ch[i % len(ch)] + 12 + (12 if k % 4 == 3 else 0), STEP * 1.4), at(k), 0.3 * gain, pan=0.25, rev=0.15, duck=True)
            if drums:
                for s in (0, 8):
                    bus.add(K, at(s), 0.65 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.18, tone=230, crack=0.6), at(s), 0.4 * gain, rev=0.15)
                for s in range(16):
                    bus.add(shaker(), at(s), (0.18 if s % 4 == 2 else 0.08) * gain, pan=-0.2)
            for s, n in ((0, ch[0]), (4, ch[2]), (8, ch[0]), (12, ch[2])):
                bus.add(E.bass808(n - 24, STEP * 3, drive=1.2), at(s), 0.5 * gain)
        elif name == "synthpop":
            arp = [0, 1, 2, 3 % len(ch), 2, 1] * 3
            for k in range(16):
                bus.add(E.pluck(ch[arp[k] % len(ch)] + 12 + (12 if k % 8 >= 4 else 0), STEP * 0.9, bright=7000), at(k), 0.3 * gain, pan=0.2 * (-1) ** k, rev=0.3, duck=True)
            bus.add(E.pad([n + 12 for n in ch], BAR, cutoff=2400, attack=0.1), tb, 0.22 * gain, rev=0.3, duck=True)
            if drums:
                for s in (0, 4, 8, 12):
                    bus.add(K, at(s), 0.7 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(gated(), at(s), 0.55 * gain, rev=0.4)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.03), at(s), 0.14 * gain, pan=0.25)
            for k in range(8):
                bus.add(E.bass808(ch[0] - 24, STEP * 1.6, drive=1.8), at(k * 2), 0.42 * gain)
        elif name == "triphop":
            for n in ch:
                bus.add(E.ep(n + 12, BAR * 0.9), tb, 0.22 * gain / len(ch) * 3, pan=-0.1, rev=0.4, duck=True)
            bus.add(E.pad([n for n in ch], BAR, cutoff=900, attack=0.3), tb, 0.25 * gain, rev=0.5)
            if drums:
                for s in (0, 7, 10):
                    bus.add(E.kick(L=0.6, top=110, low=42, drive=2.4), at(s), 0.85 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.45, tone=170, crack=0.9), at(s), 0.6 * gain, rev=0.45)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.05), at(s) + (STEP * 0.3 if s % 4 else 0), 0.12 * gain, pan=0.25)
            bus.add(E.bass808(ch[0] - 24, STEP * 10, drive=1.5), at(0), 0.55 * gain)
        elif name == "tango":
            for s in (0, 3, 4, 6, 8, 11, 12, 14):
                acc = 1.0 if s in (0, 3, 8, 11) else 0.6
                bus.add(bando([n + 12 for n in ch], STEP * 1.2), at(s), 0.55 * gain * acc, pan=-0.1, rev=0.2, duck=True)
            if drums:
                for s in (0, 3, 8, 11):
                    bus.add(K, at(s), 0.55 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(rim(), at(s), 0.35 * gain)
            for s, d in ((0, 0), (3, 7), (4, 0), (8, 0), (11, 7), (12, 5)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * 1.5, drive=1.6), at(s), 0.5 * gain)


def dhol(low=True, L=0.25):
    t = E.secs(L)
    if low:
        f = 70 * (1 + 0.6 * np.exp(-t * 25))
        return np.sin(np.cumsum(2 * np.pi * f / E.SR)) * np.exp(-t * 9) * 0.8
    return (E.bandpass(E.noise(L), 1500, 6000) * np.exp(-t * 40) + np.sin(2 * np.pi * 420 * t) * np.exp(-t * 30) * 0.5) * 0.6


def tumbi(note, L=0.18):
    t = E.secs(L)
    f = E.midi(note) * (1 + 0.03 * np.exp(-t * 30))
    s = E.saw(1, np.cumsum(f) / E.SR)
    return E.highpass(s, 500) * np.exp(-t * 18) * 0.3


def flute(note, L=0.2):
    t = E.secs(L)
    f = E.midi(note) * (1 + 0.006 * np.sin(2 * np.pi * 5.5 * t))
    s = np.sin(np.cumsum(2 * np.pi * f / E.SR)) + 0.08 * E.noise(L)
    return s * np.minimum(t / 0.02, 1) * np.exp(-np.maximum(t - L * 0.6, 0) * 20) * 0.25


def ride(L=0.3):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 4000, 12000) * np.exp(-t * 9) * 0.3 + np.sin(2 * np.pi * 5200 * t) * np.exp(-t * 12) * 0.03


def style4(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    STEP = BAR / 16
    K = E.kick(top=150, low=48, drive=1.8)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "bhangra":
            riff = [0, 2, 1, 2, 0, 1, 2, 3 % len(ch)]
            for k, i in enumerate(riff):
                bus.add(tumbi(ch[i % len(ch)] + 24, STEP * 1.5), at(k * 2), 0.45 * gain, pan=0.25, rev=0.15, duck=True)
            if drums:
                for s in (0, 3, 6, 8, 11, 14):
                    bus.add(dhol(True), at(s), 0.75 * gain)
                    kicks.append(at(s))
                for s in (2, 4, 7, 10, 12, 15):
                    bus.add(dhol(False), at(s), 0.45 * gain, pan=-0.2)
            bus.add(E.bass808(ch[0] - 24, STEP * 6, drive=1.8), at(0), 0.5 * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 5, drive=1.8), at(8), 0.45 * gain)
        elif name == "jazz":
            sw = lambda s: at(s) + (STEP * 0.33 if s % 4 == 2 else 0)  # noqa: E731
            walk = [ch[0], ch[1], ch[2], ch[1] + 1]
            for q in range(4):
                bus.add(E.bass808(walk[q] - 24, STEP * 3.6, drive=1.0), at(q * 4), 0.55 * gain)
            for s in (2, 10):
                for n in ch:
                    bus.add(E.ep(n + 12, STEP * 3), sw(s), 0.25 * gain / len(ch) * 3, pan=-0.15, rev=0.3, duck=True)
            if drums:
                for s in (0, 4, 6, 8, 12, 14):
                    bus.add(ride(), sw(s), 0.35 * gain, pan=0.3)
                for s in (4, 12):
                    bus.add(E.hat(0.05), at(s), 0.2 * gain)
                bus.add(K, at(0), 0.4 * gain)
                kicks.append(at(0))
        elif name == "celtic":
            trip = STEP * 4 / 3
            mel = [0, 1, 2, 1, 0, 2, 3 % len(ch), 2, 1, 0, 1, 2]
            for k, i in enumerate(mel):
                bus.add(flute(ch[i % len(ch)] + 24 + (12 if k % 6 == 5 else 0), trip * 0.95), tb + k * trip, 0.45 * gain, pan=0.15, rev=0.3, duck=True)
            bus.add(E.pad([ch[0] - 12, ch[0]], BAR, cutoff=900, attack=0.05), tb, 0.2 * gain, rev=0.3)
            if drums:
                for k in range(12):
                    if k % 3 == 0:
                        bus.add(tom(43, 0.25), tb + k * trip, 0.6 * gain)
                        kicks.append(tb + k * trip)
                    else:
                        bus.add(tom(50, 0.12), tb + k * trip, 0.25 * gain)
        elif name == "electropop":
            for k in range(8):
                bus.add(E.bass808(ch[0] - 24 + (12 if k % 2 else 0), STEP * 1.6, drive=2.2), at(k * 2), 0.42 * gain)
            for s, L in ((0, 3), (6, 2), (10, 4)):
                bus.add(E.supersaw([n + 12 for n in ch], STEP * L, cutoff=6000), at(s), 0.26 * gain, rev=0.3, duck=True)
            if drums:
                for s in (0, 4, 8, 12):
                    bus.add(K, at(s), 0.75 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.5 * gain, rev=0.25)
                for s in range(2, 16, 4):
                    bus.add(E.hat(0.1, open_=True), at(s), 0.15 * gain, pan=0.25)
        elif name == "samba":
            cav = [0, 2, 1, 2, 0, 2, 1, 2]
            for k, i in enumerate(cav):
                bus.add(nylon(ch[i % len(ch)] + 24, STEP * 1.2), at(k * 2 + (1 if k % 2 else 0)), 0.3 * gain, pan=0.25, rev=0.15, duck=True)
            if drums:
                for s in (0, 8):
                    bus.add(E.kick(L=0.4, top=90, low=40, drive=1.4), at(s), 0.7 * gain)
                    kicks.append(at(s))
                bus.add(E.kick(L=0.3, top=110, low=55, drive=1.2), at(12), 0.5 * gain)
                for s in (0, 3, 6, 8, 10, 13, 14):
                    bus.add(rim(), at(s), 0.3 * gain, pan=-0.25)
                for s in range(16):
                    bus.add(shaker(), at(s), (0.18 if s % 2 else 0.1) * gain, pan=0.3)
            bus.add(E.bass808(ch[0] - 24, STEP * 3, drive=1.4), at(0), 0.5 * gain)
            bus.add(E.bass808(ch[0] - 17, STEP * 3, drive=1.4), at(8), 0.45 * gain)


def strum(notes, L=0.25, down=True):
    out = np.zeros(int((L + 0.06) * E.SR) + 1)
    seq = notes if down else notes[::-1]
    for k, n in enumerate(seq):
        p = nylon(n, L)
        i = int(k * 0.012 * E.SR)
        m = min(len(p), len(out) - i)
        out[i:i + m] += p[:m]
    return out * 0.6


def palmas(L=0.08):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 900, 4000) * np.exp(-t * 60) * 0.7


def clarinet(note, L=0.3):
    t = E.secs(L)
    f = E.midi(note) * (1 + 0.008 * np.sin(2 * np.pi * 6 * t))
    ph = np.cumsum(2 * np.pi * f / E.SR)
    s = np.sin(ph) + 0.4 * np.sin(3 * ph) + 0.2 * np.sin(5 * ph)
    return E.lowpass(s, 3000) * np.minimum(t / 0.03, 1) * np.exp(-np.maximum(t - L * 0.7, 0) * 18) * 0.22


def conga(note=57, L=0.2):
    t = E.secs(L)
    f = E.midi(note) * (1 + 0.3 * np.exp(-t * 40))
    return np.sin(np.cumsum(2 * np.pi * f / E.SR)) * np.exp(-t * 14) * 0.5


def style5(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    STEP = BAR / 16
    K = E.kick(top=150, low=48, drive=1.8)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "flamenco":
            for s, d in ((0, True), (3, False), (4, True), (6, True), (8, True), (11, False), (12, True), (14, True)):
                bus.add(strum([n + 12 for n in ch] + [ch[0] + 24], STEP * 1.6, d), at(s), 0.5 * gain, pan=-0.1, rev=0.15, duck=True)
            if drums:
                for s in (2, 6, 10, 14):
                    bus.add(palmas(), at(s), 0.45 * gain, pan=0.3)
                for s in (0, 8):
                    bus.add(E.kick(L=0.25, top=120, low=60, drive=1.2), at(s), 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.12, tone=260, crack=0.4), at(s), 0.35 * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 4, drive=1.2), at(0), 0.45 * gain)
            bus.add(E.bass808(ch[0] - 17, STEP * 4, drive=1.2), at(8), 0.4 * gain)
        elif name == "dub":
            for s in (4, 12):
                for d, g in ((0, 1.0), (3, 0.5), (6, 0.25)):
                    for n in ch:
                        bus.add(organ(n + 12, STEP), at(s) + d * STEP, 0.3 * gain * g, pan=0.3 * (-1) ** d, rev=0.3, duck=True)
            if drums:
                bus.add(E.kick(L=0.6, top=100, low=40, drive=2.0), at(8), 0.85 * gain)
                kicks.append(at(8))
                bus.add(E.snare(L=0.4, tone=180, crack=0.7), at(8), 0.5 * gain, rev=0.5)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.03), at(s), 0.12 * gain, pan=0.2)
            for s, d, L in ((0, 0, 5), (6, 7, 2), (10, 5, 4), (14, 7, 2)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * L, drive=1.0), at(s), 0.65 * gain)
        elif name == "highlife":
            for k in range(16):
                n = ch[(k * 2) % len(ch)] + 24 if k % 2 == 0 else ch[(k + 1) % len(ch)] + 19
                bus.add(nylon(n, STEP * 1.3), at(k), 0.26 * gain, pan=0.3 if k % 2 else -0.3, rev=0.2, duck=True)
            if drums:
                for s in (0, 3, 6, 10, 12):
                    bus.add(bell(86), at(s), 0.25 * gain, pan=-0.2)
                for s, n in ((2, 57), (5, 62), (7, 57), (13, 62), (14, 57)):
                    bus.add(conga(n), at(s), 0.45 * gain, pan=0.25)
                for s in (0, 8):
                    bus.add(K, at(s), 0.6 * gain)
                    kicks.append(at(s))
            bus.add(E.bass808(ch[0] - 24, STEP * 3, drive=1.3), at(0), 0.5 * gain)
            bus.add(E.bass808(ch[1] - 24, STEP * 3, drive=1.3), at(6), 0.45 * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 3, drive=1.3), at(10), 0.45 * gain)
        elif name == "klezmer":
            mel = [0, 1, 2, 3 % len(ch), 2, 1, 2, 0]
            for k, i in enumerate(mel):
                bus.add(clarinet(ch[i % len(ch)] + 12 + (1 if k == 3 else 0), STEP * 2), at(k * 2), 0.45 * gain, pan=0.1, rev=0.3, duck=True)
            for s in (0, 8):
                bus.add(E.bass808(ch[0] - 24, STEP * 3, drive=1.2), at(s), 0.5 * gain)
            for s in (4, 12):
                for n in ch:
                    bus.add(organ(n, STEP * 1.5), at(s), 0.25 * gain, pan=-0.2)
            if drums:
                for s in (0, 8):
                    bus.add(tom(43, 0.3), at(s), 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.15, tone=240, crack=0.5), at(s), 0.35 * gain)
        elif name == "chillwave":
            bus.add(E.pad([n + 12 for n in ch], BAR, cutoff=1400, attack=0.4), tb, 0.3 * gain, rev=0.6, duck=True)
            for k in range(8):
                bus.add(E.pluck(ch[k % len(ch)] + 24, STEP * 1.6, bright=2500), at(k * 2), 0.25 * gain, pan=0.3 * (-1) ** k, rev=0.5)
            if drums:
                for s in (0, 8, 10):
                    bus.add(E.kick(L=0.4, top=120, low=46, drive=1.4), at(s), 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.35 * gain, rev=0.5)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.04), at(s), 0.1 * gain, pan=0.25)
            bus.add(E.bass808(ch[0] - 24, STEP * 14, drive=1.2), at(0), 0.45 * gain)


def acid(note, L=0.2):
    t = E.secs(L)
    s = E.saw(E.midi(note), t)
    return E.sweep_filter(s, 2800, 300, 8) * np.exp(-t * 8) * 0.4


def style6(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    STEP = BAR / 16
    K = E.kick(top=160, low=48, drive=2.0)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "zouk":
            bus.add(E.pad([n + 12 for n in ch], BAR, cutoff=2200, attack=0.2), tb, 0.25 * gain, rev=0.4, duck=True)
            for s in (0, 3, 6, 10, 12):
                bus.add(E.ep(ch[(s // 3) % len(ch)] + 24, STEP * 2), at(s), 0.22 * gain, pan=0.2, rev=0.3)
            if drums:
                for s in (0, 3, 4, 8, 11, 12):
                    bus.add(rim(), at(s), 0.35 * gain, pan=-0.2)
                for s in (0, 8):
                    bus.add(K, at(s), 0.7 * gain)
                    kicks.append(at(s))
                bus.add(E.snare(L=0.2, tone=220, crack=0.6), at(12), 0.35 * gain, rev=0.2)
            for s, d in ((0, 0), (3, 0), (6, 7), (8, 0), (11, 0), (14, 5)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * 2.5, drive=1.6), at(s), 0.5 * gain)
        elif name == "trance":
            for k in range(16):
                bus.add(E.pluck(ch[k % len(ch)] + 24 + (12 if k % 4 == 3 else 0), STEP * 0.9, bright=8000), at(k), 0.25 * gain, pan=0.25 * (-1) ** k, rev=0.35, duck=True)
            bus.add(E.supersaw([n + 12 for n in ch], BAR, cutoff=5000, attack=0.05), tb, 0.2 * gain, rev=0.4, duck=True)
            if drums:
                for q in range(4):
                    bus.add(K, at(q * 4), 0.8 * gain)
                    kicks.append(at(q * 4))
                    bus.add(E.hat(0.08, open_=True), at(q * 4 + 2), 0.18 * gain, pan=0.25)
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.35 * gain, rev=0.3)
            for q in range(4):
                bus.add(E.bass808(ch[0] - 24, STEP * 1.6, drive=1.8), at(q * 4 + 2), 0.45 * gain)
        elif name == "breakbeat":
            for s in (0, 10):
                bus.add(K, at(s), 0.85 * gain)
                kicks.append(at(s))
            if drums:
                for s in (4, 12):
                    bus.add(E.snare(L=0.25, tone=200, crack=1.0), at(s), 0.55 * gain, rev=0.2)
                bus.add(E.snare(L=0.15, tone=200, crack=0.8), at(7), 0.3 * gain)
                bus.add(E.snare(L=0.15, tone=200, crack=0.8), at(15), 0.25 * gain)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.03), at(s), 0.16 * gain, pan=0.25)
            for s in (0, 2, 3, 6, 8, 11, 14):
                bus.add(acid(ch[0] - 12 + (12 if s in (3, 11) else 0), STEP * 1.5), at(s), 0.4 * gain, pan=-0.1, duck=True)
            bus.add(bando([n + 12 for n in ch], STEP * 1.2), at(6), 0.4 * gain, rev=0.3)
        elif name == "soul":
            for s in (0, 6, 10):
                for n in ch:
                    bus.add(E.ep(n + 12, STEP * 4), at(s), 0.26 * gain / len(ch) * 2.5, pan=-0.1, rev=0.3, duck=True)
            if drums:
                for s in (0, 8, 10):
                    bus.add(K, at(s), 0.65 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.45 * gain, rev=0.25)
                    bus.add(E.snare(L=0.2, tone=210, crack=0.6), at(s), 0.35 * gain)
                for s in range(0, 16, 2):
                    bus.add(tamb(), at(s), 0.14 * gain, pan=0.3)
            for s, d in ((0, 0), (2, 12), (4, 7), (6, 0), (8, 5), (10, 7), (12, 0), (14, 12)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * 1.6, drive=1.4), at(s), 0.4 * gain)
        elif name == "baile":
            if drums:
                for s in (0, 3, 6, 10, 13):
                    bus.add(E.kick(L=0.35, top=180, low=50, drive=2.6), at(s), 0.85 * gain)
                    kicks.append(at(s))
                for s in (7, 11, 14, 15):
                    bus.add(tom(47 + (s % 3) * 3, 0.2), at(s), 0.45 * gain)
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.45 * gain, rev=0.2)
            for k, s in enumerate((2, 8)):
                bus.add(E.vox("aoei"[(b + k) % 4], ch[2], STEP * 1.2), at(s), 0.3 * gain, pan=0.2, rev=0.3)
            bus.add(E.supersaw([n + 12 for n in ch], STEP * 3, cutoff=4000), at(0), 0.25 * gain, duck=True)
            bus.add(E.bass808(ch[0] - 24, STEP * 6, drive=2.4), at(0), 0.55 * gain)


def crackle(L):
    n = E.noise(L)
    return E.highpass(n * (np.abs(n) > 2.6), 2500) * 0.25 + E.lowpass(E.noise(L), 800) * 0.02


def style7(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    STEP = BAR / 16
    K = E.kick(top=150, low=46, drive=1.8)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "lofi":
            for s in (0, 7):
                for n in ch + [ch[0] + 14]:
                    bus.add(E.lowpass(E.ep(n + 12, STEP * 6), 2200), at(s), 0.26 * gain / 4 * 2.5, pan=-0.15, rev=0.35, duck=True)
            bus.add(crackle(BAR), tb, 0.3 * gain, pan=0.1)
            if drums:
                for s in (0, 7, 10):
                    bus.add(E.kick(top=120, low=44, drive=1.4), at(s) + STEP * 0.12, 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.lowpass(E.snare(L=0.25, tone=190, crack=0.7), 5000), at(s) + STEP * 0.15, 0.4 * gain, rev=0.25)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.04, tone=0.7), at(s) + (STEP * 0.18 if s % 4 else 0), 0.12 * gain, pan=0.3)
            bus.add(E.bass808(ch[0] - 24, STEP * 6, drive=1.1), at(0), 0.45 * gain)
            bus.add(E.bass808(ch[0] - 24 + 7, STEP * 4, drive=1.1), at(10), 0.35 * gain)
        elif name == "disco":
            for s in (2, 6, 10, 14):
                _chord_hits(bus, [n + 12 for n in ch], at(s), STEP * 1.2, 0.4 * gain, lambda n, L: E.pluck(n, L, bright=6000), pan=0.2)
            bus.add(E.pad([n + 24 for n in ch], BAR, cutoff=3500, attack=0.15), tb, 0.18 * gain, rev=0.4, duck=True)
            if drums:
                for q in range(4):
                    bus.add(K, at(q * 4), 0.75 * gain)
                    kicks.append(at(q * 4))
                    bus.add(E.hat(0.12, open_=True), at(q * 4 + 2), 0.2 * gain, pan=0.25)
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.4 * gain, rev=0.25)
                    bus.add(E.snare(L=0.2, tone=220, crack=0.7), at(s), 0.3 * gain)
            for s in range(0, 16, 2):
                bus.add(E.bass808(ch[0] - 24 + (12 if s % 4 else 0), STEP * 1.6, drive=1.5), at(s), 0.42 * gain)
        elif name == "dnb":
            bus.add(E.pad([n + 12 for n in ch], BAR, cutoff=2000, attack=0.4), tb, 0.24 * gain, rev=0.45, duck=True)
            if drums:
                for s in (0, 10):
                    bus.add(E.kick(L=0.3, top=170, low=50, drive=2.0), at(s), 0.8 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.22, tone=230, crack=1.1), at(s), 0.55 * gain, rev=0.15)
                bus.add(E.snare(L=0.1, tone=230, crack=0.8), at(15), 0.2 * gain)
                for s in range(16):
                    bus.add(E.hat(0.025), at(s), (0.14 if s % 2 else 0.08) * gain, pan=0.25)
            bus.add(E.bass808(ch[0] - 24, STEP * 7, drive=1.8, glide_from=ch[0] - 12), at(0), 0.5 * gain)
            bus.add(E.bass808(ch[0] - 24 + 3, STEP * 5, drive=1.8), at(10), 0.4 * gain)
            if b % 2:
                bus.add(E.pluck(ch[2] + 24, STEP * 3, bright=5000), at(6), 0.2 * gain, pan=-0.3, rev=0.5)
        elif name == "gospel":
            for s in (0, 6, 8, 14):
                for n in ch + [ch[0] + 12]:
                    bus.add(organ(n + 12, STEP * 2.5), at(s), 0.32 * gain / 4 * 2.5, pan=-0.1, rev=0.3, duck=True)
            bus.add(E.vox("o", ch[1] + 12, STEP * 3), at(0), 0.22 * gain, rev=0.45)
            bus.add(E.vox("o", ch[2] + 12, STEP * 3), at(8), 0.2 * gain, rev=0.45)
            if drums:
                for s in (0, 9):
                    bus.add(K, at(s), 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.5 * gain, rev=0.3)
                for s in range(0, 16, 2):
                    bus.add(tamb(), at(s), 0.12 * gain, pan=0.3)
            for q, d in enumerate((0, 4, 7, 9)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * 3.5, drive=1.3), at(q * 4), 0.42 * gain)
        elif name == "mambo":
            for s in (0, 3, 4, 7, 8, 11, 12, 15):
                n = ch[(s // 4) % len(ch)] + 24 + (12 if s % 2 else 0)
                bus.add(E.pluck(n, STEP * 0.9, bright=4500), at(s), 0.26 * gain, pan=-0.2, rev=0.25, duck=True)
            if drums:
                for s in ((0, 3, 6, 10, 12) if b % 2 else (2, 4, 8, 11, 14)):
                    bus.add(rim(), at(s), 0.35 * gain, pan=0.25)
                for s in (0, 4, 8, 12):
                    bus.add(E.cowbell(81, 0.12), at(s), 0.14 * gain, pan=-0.3)
                for s, nn in ((6, 60), (7, 60), (14, 55), (15, 55)):
                    bus.add(conga(nn), at(s), 0.35 * gain, pan=0.15)
                for s in (0, 8):
                    bus.add(E.kick(top=120, low=50, drive=1.4), at(s), 0.5 * gain)
                    kicks.append(at(s))
            bus.add(E.bass808(ch[0] - 24 + 7, STEP * 2.5, drive=1.3), at(3), 0.45 * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 4, drive=1.3), at(6), 0.48 * gain)
            bus.add(E.bass808(ch[0] - 24 + 7, STEP * 2.5, drive=1.3), at(11), 0.4 * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 4, drive=1.3), at(14), 0.42 * gain)


def guiro(L=0.12):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 2500, 7000) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 90 * t))) * np.exp(-t * 12) * 0.35


def accordion(notes, L=0.3):
    t = E.secs(L)
    s = sum(E.saw(E.midi(n), t) * 0.5 + E.saw(E.midi(n) * 1.004, t) * 0.5 for n in notes) / len(notes)
    return E.lowpass(s, 2600) * np.minimum(t / 0.02, 1) * np.exp(-t * 2.5) * 0.35


def logdrum(note, L=0.4):
    t = E.secs(L)
    f = E.midi(note) * (1 + 0.8 * np.exp(-t * 18))
    s = np.sin(np.cumsum(2 * np.pi * f / E.SR))
    return np.tanh(s * 2.2) * np.exp(-t * 6) * 0.55


def style8(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    STEP = BAR / 16
    K = E.kick(top=150, low=46, drive=1.8)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "house":
            for s in (2, 6, 10, 14):
                for n in ch + [ch[0] + 12]:
                    bus.add(organ(n + 12, STEP * 1.4), at(s), 0.3 * gain / 4 * 2.5, pan=-0.15, rev=0.3, duck=True)
            if drums:
                for q in range(4):
                    bus.add(K, at(q * 4), 0.8 * gain)
                    kicks.append(at(q * 4))
                    bus.add(E.hat(0.1, open_=True), at(q * 4 + 2), 0.18 * gain, pan=0.25)
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.35 * gain, rev=0.3)
                for s in range(1, 16, 2):
                    bus.add(shaker(), at(s), 0.12 * gain, pan=-0.3)
            for s in (0, 3, 6, 8, 11, 14):
                bus.add(E.bass808(ch[0] - 24 + (7 if s in (6, 14) else 0), STEP * 2, drive=1.4), at(s), 0.42 * gain)
        elif name == "garage":
            for s in (0, 3, 7, 10):
                _chord_hits(bus, [n + 12 for n in ch], at(s), STEP * 1.0, 0.38 * gain, lambda n, L: E.ep(n, L), pan=0.15)
            if drums:
                for s in (0, 7, 10):
                    bus.add(K, at(s), 0.75 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.2, tone=220, crack=0.9), at(s), 0.45 * gain, rev=0.25)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.03), at(s + (0.3 if s % 4 else 0)), 0.15 * gain, pan=0.3)
            bus.add(E.vox("aeio"[b % 4], ch[2] + 12, STEP * 0.8), at(6), 0.22 * gain, pan=0.25, rev=0.4)
            bus.add(E.vox("oaei"[b % 4], ch[1] + 12, STEP * 0.8), at(14), 0.2 * gain, pan=-0.25, rev=0.4)
            bus.add(E.bass808(ch[0] - 24, STEP * 5, drive=1.8), at(0), 0.5 * gain)
            bus.add(E.bass808(ch[0] - 24 + 3, STEP * 4, drive=1.8), at(10), 0.42 * gain)
        elif name == "cumbia":
            for s in (2, 6, 10, 14):
                bus.add(accordion([n + 12 for n in ch], STEP * 1.6), at(s), 0.45 * gain, pan=0.2, rev=0.25, duck=True)
            if drums:
                for s in range(0, 16, 2):
                    bus.add(guiro(STEP * (1.6 if s % 4 == 0 else 0.8)), at(s), 0.3 * gain, pan=0.3)
                for s in (0, 8):
                    bus.add(E.kick(top=120, low=48, drive=1.4), at(s), 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(rim(), at(s), 0.4 * gain, pan=-0.2)
                for s, nn in ((6, 57), (7, 52), (14, 57), (15, 52)):
                    bus.add(conga(nn), at(s), 0.3 * gain, pan=-0.1)
            bus.add(E.bass808(ch[0] - 24, STEP * 3, drive=1.3), at(0), 0.48 * gain)
            bus.add(E.bass808(ch[0] - 24 + 7, STEP * 3, drive=1.3), at(8), 0.45 * gain)
        elif name == "swing":
            SW = STEP * 0.33
            for q in range(4):
                d = (0, 4, 7, 9)[q]
                bus.add(E.bass808(ch[0] - 24 + d, STEP * 3, drive=1.2), at(q * 4), 0.45 * gain)
            for s in (0, 6 + 0.33, 8, 14 + 0.33):
                _chord_hits(bus, [n + 12 for n in ch], at(s), STEP * 1.5, 0.4 * gain, brass, pan=0.2, rev=0.3)
            if drums:
                for s in (0, 8):
                    bus.add(K, at(s), 0.65 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.2, tone=210, crack=0.7), at(s), 0.42 * gain, rev=0.2)
                    bus.add(E.clap(), at(s), 0.25 * gain, rev=0.25)
                for q in range(4):
                    bus.add(ride(), at(q * 4), 0.15 * gain, pan=0.3)
                    bus.add(ride(0.15), at(q * 4 + 2) + SW, 0.12 * gain, pan=0.3)
        elif name == "amapiano":
            for s in (0, 6, 10):
                for n in ch:
                    bus.add(E.ep(n + 12, STEP * 3), at(s), 0.24 * gain / len(ch) * 2.5, pan=-0.15, rev=0.35, duck=True)
            if drums:
                for q in range(4):
                    bus.add(E.kick(top=130, low=46, drive=1.5), at(q * 4), 0.6 * gain)
                    kicks.append(at(q * 4))
                for s in range(16):
                    bus.add(shaker(), at(s), (0.18 if s % 2 else 0.1) * gain, pan=0.3)
                for s in (4, 12):
                    bus.add(E.clap(), at(s) + STEP * 0.1, 0.3 * gain, rev=0.3)
            for s, d in ((3, 0), (6, 7), (11, 0), (13, 12), (14, 7)):
                bus.add(logdrum(ch[0] - 12 + d, STEP * 2.5), at(s), 0.42 * gain)


def style9(name, bus, kicks, t0, nbars, BAR, prog, gain=1.0, drums=True):
    STEP = BAR / 16
    K = E.kick(top=160, low=46, drive=2.0)
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        at = lambda s: tb + s * STEP  # noqa: E731
        if name == "phonk":
            for s, d in ((0, 12), (3, 12), (6, 7), (8, 10), (10, 7), (12, 3), (14, 0)):
                bus.add(E.cowbell(ch[0] + 12 + d, 0.18), at(s), 0.22 * gain, pan=0.15, rev=0.2, duck=True)
            if drums:
                for s in (0, 6, 10):
                    bus.add(K, at(s), 0.8 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.4 * gain, rev=0.2)
                for k in range(24):
                    bus.add(E.hat(0.025), tb + k * BAR / 24, (0.15 if k % 3 == 0 else 0.08) * gain, pan=0.3)
            bus.add(E.bass808(ch[0] - 24, STEP * 6, drive=3.0, glide_from=ch[0] - 12), at(0), 0.55 * gain)
            bus.add(E.bass808(ch[0] - 24, STEP * 4, drive=3.0), at(10), 0.45 * gain)
        elif name == "rockabilly":
            for q, d in enumerate((0, 4, 7, 9)):
                bus.add(E.bass808(ch[0] - 24 + d, STEP * 1.5, drive=1.2), at(q * 4), 0.45 * gain)
                bus.add(tom(ch[0] - 12, 0.05), at(q * 4 + 2), 0.15 * gain)
            for s in (0, 2, 3, 6, 8, 10, 11, 14):
                n = ch[(s // 2) % len(ch)] + 12 + (12 if s in (3, 11) else 0)
                bus.add(E.pluck(n, STEP * 1.2, bright=7000), at(s), 0.22 * gain, pan=-0.2, rev=0.35, duck=True)
            if drums:
                for s in (0, 8, 10):
                    bus.add(E.kick(top=120, low=50, drive=1.3), at(s), 0.55 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.25, tone=200, crack=1.2), at(s), 0.45 * gain, rev=0.3)
                for s in range(0, 16, 2):
                    bus.add(shaker(0.1), at(s), 0.14 * gain, pan=0.3)
        elif name == "jersey":
            if drums:
                for s in (0, 3, 6, 8, 10, 12, 14):
                    bus.add(E.kick(L=0.25, top=180, low=52, drive=2.2), at(s), 0.75 * gain)
                    kicks.append(at(s))
                for s in (4, 12, 15):
                    bus.add(E.clap(), at(s), 0.35 * gain, rev=0.2)
                for s in range(0, 16, 2):
                    bus.add(E.hat(0.03), at(s), 0.12 * gain, pan=0.3)
            for k, s in enumerate((1, 5, 9, 13)):
                bus.add(E.vox("aeio"[(b + k) % 4], ch[(k + 1) % 3] + 12, STEP * 0.7), at(s), 0.28 * gain, pan=0.25 * (-1) ** k, rev=0.3)
            bus.add(E.supersaw([n + 12 for n in ch], STEP * 4, cutoff=4500), at(0), 0.22 * gain, rev=0.3, duck=True)
            bus.add(E.bass808(ch[0] - 24, STEP * 6, drive=2.2), at(0), 0.5 * gain)
        elif name == "fanfare":
            for s in (0, 3, 6, 10, 12):
                _chord_hits(bus, [n + 12 for n in ch], at(s), STEP * (2 if s in (6, 12) else 1.2), 0.45 * gain, brass, pan=0.15, rev=0.3)
            for q in range(4):
                bus.add(E.bass808(ch[0] - 24 + (0 if q % 2 == 0 else 7), STEP * 1.8, drive=1.4), at(q * 4), 0.5 * gain)
            if drums:
                for s in (0, 8):
                    bus.add(E.kick(top=110, low=48, drive=1.3), at(s), 0.6 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.snare(L=0.25, tone=210, crack=1.0), at(s), 0.45 * gain, rev=0.3)
                for k in range(8):
                    bus.add(E.snare(L=0.06, tone=230, crack=0.8), at(14) + k * STEP / 4, 0.12 * gain * (k + 2) / 9)
                bus.add(E.hat(0.4, open_=True), at(0), 0.16 * gain, pan=0.3)
        elif name == "ukulele":
            for s in (0, 2, 3, 6, 8, 10, 11, 14):
                for i, n in enumerate(ch + [ch[0] + 12]):
                    bus.add(nylon(n + 12, STEP * 1.6), at(s) + i * 0.008, 0.16 * gain, pan=-0.2, rev=0.25, duck=True)
            for s, d in ((0, 12), (6, 7), (8, 4), (12, 7)):
                bus.add(bell(ch[0] + 24 + d, 0.4), at(s), 0.3 * gain, pan=0.3, rev=0.4)
            if drums:
                for s in (0, 8):
                    bus.add(E.kick(top=120, low=50, drive=1.2), at(s), 0.5 * gain)
                    kicks.append(at(s))
                for s in (4, 12):
                    bus.add(E.clap(), at(s), 0.42 * gain, rev=0.25)
                for s in range(0, 16, 2):
                    bus.add(shaker(), at(s), 0.12 * gain, pan=0.3)
            bus.add(E.bass808(ch[0] - 24, STEP * 4, drive=1.1), at(0), 0.4 * gain)
            bus.add(E.bass808(ch[0] - 24 + 7, STEP * 4, drive=1.1), at(8), 0.38 * gain)
