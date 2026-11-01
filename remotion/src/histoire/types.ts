export type Word = { w: string; kw: boolean; start: number; end: number; beat: number };

export type Beat = {
  start: number;
  end: number;
  image?: string;
  bg: "dark" | "red";
  rays?: boolean;
  zoom?: boolean;
  stamp?: string;
  label?: string;
  date?: string;
  heads?: number;
  counter?: { to: number; suffix?: string };
  outro?: boolean;
};

export type Props = {
  id: string;
  fps: number;
  duration: number;
  audio: string | null;
  words: Word[];
  beats: Beat[];
};
