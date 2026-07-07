type RockStrataProps = {
  className?: string;
  /** Plan lointain (le plus haut, pris dans la lumière) */
  far?: string;
  /** Plan moyen */
  mid?: string;
  /** Plan proche (fusionne avec le fond du footer) */
  near?: string;
  /** Rim light du couchant sur les arêtes des plans moyen et proche */
  rim?: boolean;
  /** Retourne la silhouette tête en bas (usage décoratif) */
  flip?: boolean;
};

/** Arêtes supérieures des plans moyen et proche — partagées entre la forme
 *  pleine et le trait de rim light. */
const MID_TOP =
  "M0 76L70 74L76 56L190 54L196 70L320 68L326 50L470 48L476 66L610 64L680 66L686 48L820 46L826 62L960 60L1040 62L1046 46L1180 44L1186 60L1320 58L1440 60";
const NEAR_TOP =
  "M0 116L110 114L116 96L260 94L266 112L420 110L510 112L516 94L660 92L666 108L820 106L900 108L906 92L1060 90L1066 106L1210 104L1300 106L1306 90L1440 92";

/**
 * Falaise littorale en TROIS plans de profondeur — méplats et décrochés
 * verticaux francs, aucune pointe. La lumière du couchant vient de la
 * droite : fins traits dorés posés sur les arêtes des plans moyen et
 * proche, opacité croissante de gauche à droite.
 * preserveAspectRatio none : s'étire sur toute la largeur.
 */
export default function RockStrata({
  className,
  far = "#6E6349",
  mid = "#4C4534",
  near = "#37322A",
  rim = true,
  flip,
}: RockStrataProps) {
  return (
    <svg
      viewBox="0 0 1440 140"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      {rim && (
        <defs>
          <linearGradient id="strata-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#D9A85E" stopOpacity="0" />
            <stop offset="0.45" stopColor="#D9A85E" stopOpacity="0.22" />
            <stop offset="1" stopColor="#E9BC6C" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      )}
      {/* Plan lointain — pris dans la lumière */}
      <path
        fill={far}
        d="M0 140L0 30L90 28L96 14L210 16L216 30L330 27L420 29L426 12L560 15L566 27L700 24L780 26L786 12L920 14L926 26L1060 23L1150 25L1156 10L1290 13L1296 25L1440 22L1440 140Z"
      />
      {/* Plan moyen */}
      <path fill={mid} d={`${MID_TOP}L1440 140L0 140Z`} />
      {/* Plan proche — fusionne avec le fond du footer */}
      <path fill={near} d={`${NEAR_TOP}L1440 140L0 140Z`} />
      {/* Rim light du couchant sur les arêtes moyennes et proches */}
      {rim && (
        <>
          <path
            d={MID_TOP}
            fill="none"
            stroke="url(#strata-rim)"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={NEAR_TOP}
            fill="none"
            stroke="url(#strata-rim)"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
}
