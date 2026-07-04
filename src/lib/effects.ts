// Flags de la couche signature (chantier 8) — chaque effet est débrayable
// ici sans refactor. Tous les effets sont absents en prefers-reduced-motion.

export const effects = {
  /** Effet 1 — titre du hero accueil qui se condense hors de la brume */
  enableTitleReveal: true,
  /** Effet 2 — curseur-lanterne (halo) + pastille « Voir » */
  enableLantern: true,
  /** Effet 2 — spotlight images (galerie + espaces) */
  enableSpotlight: true,
  /** Effet 3 — brume shader dans les heros (OFF en DA Solaire) */
  enableMist: false,
  /** Effet 3 — poussières dorées dans la lumière des heros */
  enableFireflies: true,
  /** Effet 4 — océan nocturne au pied du footer */
  enableOcean: true,
  /** Effet 5 — transitions de page en nappe de brume */
  enablePageMist: true,
} as const;
