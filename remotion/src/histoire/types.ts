export type Word = { w: string; kw: boolean; start: number; end: number; beat: number };

export type Beat = {
  start: number;
  end: number;
  image?: string;
  alt?: string; // v2 : seconde image qui prend le relais à mi-plan (rythme plus rapide)
  bg: "dark" | "red";
  rays?: boolean;
  zoom?: boolean;
  stamp?: string;
  label?: string;
  date?: string;
  title?: string; // v2 : gros titre fixe en haut (accroche lisible sans le son)
  heads?: number;
  counter?: { to: number; suffix?: string };
  outro?: boolean;
};

export type Props = {
  id: string;
  fps: number;
  duration: number;
  audio: string | null;
  music?: string;
  v2?: boolean; // format court en boucle : pas de bandeau ni d'écran de fin, accroche visible dès la 1re image
  words: Word[];
  beats: Beat[];
};
