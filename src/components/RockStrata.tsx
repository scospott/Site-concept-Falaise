type RockStrataProps = {
  className?: string;
  /** Couche arrière (profondeur) */
  back?: string;
  /** Couche avant (strate principale) */
  front?: string;
  /** Retourne la strate tête en bas (usage décoratif) */
  flip?: boolean;
};

/**
 * Silhouette de strate rocheuse littorale — horizontale et anguleuse :
 * méplats légèrement inclinés, petits décrochés verticaux, aucune pointe.
 * Deux couches pour la profondeur (arrière plus haute, avant qui la recouvre).
 * preserveAspectRatio none : s'étire sur toute la largeur.
 */
export default function RockStrata({
  className,
  back = "#55503F",
  front = "#3A362C",
  flip,
}: RockStrataProps) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      {/* Couche arrière — affleurements plus hauts, en retrait */}
      <path
        fill={back}
        d="M0 120L0 40L88 37L96 24L240 26L246 16L420 19L428 31L600 28L680 30L688 18L850 16L858 27L1000 25L1100 28L1108 20L1260 17L1268 29L1440 26L1440 120Z"
      />
      {/* Couche avant — la strate principale, méplats et décrochés */}
      <path
        fill={front}
        d="M0 120L0 70L120 68L128 55L310 53L316 66L354 65L470 63L478 47L560 46L640 49L646 61L820 59L826 68L866 67L1010 65L1018 50L1180 48L1186 60L1256 59L1334 62L1440 60L1440 120Z"
      />
    </svg>
  );
}
