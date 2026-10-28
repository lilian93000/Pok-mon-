"""Styles musicaux originaux pour les vidéos « utiles » (une mesure = 16 pas).

Chaque style pose `nbars` mesures à partir de t0 sur un Bus, et ajoute ses grosses caisses à `kicks`
(pour le ducking). Tous les motifs sont écrits ici (aucun échantillon externe).
  bossa       — bossa nova : guitare en accords syncopés, rim, shaker, basse en quinte
  futurebass  — future bass : accords supersaw « wobble », trap en demi-temps
  baroque     — pop baroque : clavecin en arpèges, pizz, grosse caisse douce
  neosoul     — néo-soul : piano électrique, batterie traînante, basse ronde
  afro        — afrobeat : guitare en notes piquées, cloche, toms, shaker
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
