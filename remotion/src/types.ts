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

export type Chapter = { at: number; n: number; title: string; place: string; map?: string; mapFrom?: string };

type PopBase = { at: number; dur: number };
/** animations ponctuelles (motion design) */
export type Pop =
  | (PopBase & { kind: "quote"; text: string; by?: string; pos?: "left" | "right" })
  | (PopBase & { kind: "money"; won: number; eur: number })
  | (PopBase & { kind: "route"; from: string; to: string; km: number; time: string })
  | (PopBase & { kind: "thermo"; value: number })
  | (PopBase & { kind: "rating"; value: number; max: number; label: string })
  | (PopBase & { kind: "subscribe" })
  | (PopBase & { kind: "place"; name: string; sub?: string })
  | (PopBase & { kind: "price"; item: string; price: string; conv?: string })
  | (PopBase & { kind: "chip"; value: string; label: string });

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
  pops: Pop[];
  /** début de l'écran de fin (s) */
  endScreenAt: number;
  /** carte : nom de la ville + lieux (lat/lon) */
  city?: string;
  places?: Record<string, { lat: number; lon: number; name: string }>;
  /** écran de fin : [sur-titre, titre] */
  endText?: [string, string];
};
