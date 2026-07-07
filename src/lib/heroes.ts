// Manifest des heros scroll-scrubbed — source unique de configuration.
// Quand les frames seront extraites (ffmpeg, voir shot-list), renseigner
// `frameCount` avec le nombre exact de frames : c'est le SEUL changement
// de code nécessaire pour brancher les vraies vidéos.

export type HeroSlot = "home" | "reservation";

export type HeroConfig = {
  /** Dossier public des frames, ex. /frames/hero-home/ */
  framesPath: string;
  /** Motif de nommage, index à partir de 0001 */
  framePattern: string;
  /** Nombre de frames extraites (valeur provisoire tant que les frames n'existent pas) */
  frameCount: number;
  /** Image statique de secours (public/heroes/) — aussi poster/LCP */
  fallbackSrc: string;
  /** Hauteur de scrub en vh (durée de l'épinglage) */
  scrubVh: number;
};

export const heroes: Record<HeroSlot, HeroConfig> = {
  home: {
    framesPath: "/frames/hero-home/",
    framePattern: "frame-%04d.webp",
    // 162 frames réelles extraites (ffmpeg) — vérifié sans trou 0001→0162
    frameCount: 162,
    fallbackSrc: "/heroes/home.jpg",
    // Traversée ~8 s : scrub allongé pour se déguster sans traîner
    scrubVh: 300,
  },
  reservation: {
    framesPath: "/frames/hero-reservation/",
    framePattern: "frame-%04d.webp",
    // 121 frames réelles extraites — vérifié sans trou 0001→0121 ;
    // fallback ≈ frame 0001 (diff 1,86/255, aucun flash poster→canvas)
    frameCount: 121,
    fallbackSrc: "/heroes/reservation.jpg",
    scrubVh: 200,
  },
};

/** URL de la frame i (1-based) d'un slot */
export function frameUrl(config: HeroConfig, index: number): string {
  return (
    config.framesPath +
    config.framePattern.replace("%04d", String(index).padStart(4, "0"))
  );
}
