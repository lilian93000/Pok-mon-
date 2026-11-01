// Format du fichier de montage (src/data/*.json), généré par tools/build_edit.py
export type Segment = {
  /** début / fin dans la source, en secondes */
  from: number;
  to: number;
  /** clip vertical avec bandes noires incrustées : on recadre + fond flou */
  vertical?: boolean;
  /** zoom léger (1 = aucun) */
  zoom?: number;
  /** volume (1 = normal) */
  volume?: number;
};

export type Chapter = { at: number; n: number; title: string; place: string };

export type CaptionWord = { w: string; s: number; e: number };
export type CaptionPage = { s: number; e: number; words: CaptionWord[] };

export type Tip = { at: number; dur: number; icon: string; title: string; text: string };

export type Title = { at: number; dur: number; text: string; sub?: string };

export type Edit = {
  src: string;
  fps: number;
  /** durée totale du montage en secondes */
  duration: number;
  segments: Segment[];
  chapters: Chapter[];
  captions: CaptionPage[];
  titles: Title[];
  /** fiches info (guide de survie) */
  tips: Tip[];
  /** début de l'écran de fin (s) */
  endScreenAt: number;
};
