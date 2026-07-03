// Les espaces de la villa — data bilingue.
// `image` est optionnel : une fois les visuels IA générés (public/espaces/),
// renseigner le champ et le composant bascule sur next/image sans refactor.

export type Espace = {
  id: string;
  nom: { fr: string; en: string };
  description: { fr: string; en: string };
  couleur: string;
  image?: string;
};

export const espaces: Espace[] = [
  {
    id: "verriere",
    nom: { fr: "La verrière", en: "The glass hall" },
    description: {
      fr: "Un salon cathédrale face au large. Double hauteur, cheminée suspendue, et l'horizon pour quatrième mur.",
      en: "A cathedral living room facing the open sea. Double height, a suspended fireplace, the horizon as a fourth wall.",
    },
    couleur: "#1E3A33",
  },
  {
    id: "bain-nordique",
    nom: { fr: "Le bain nordique", en: "The nordic bath" },
    description: {
      fr: "Sous les pins, dans la vapeur. L’océan en fond sonore, les étoiles en plafond.",
      en: "Under the pines, in the steam. The ocean as a soundtrack, the stars as a ceiling.",
    },
    couleur: "#182A20",
  },
  {
    id: "suite-falaise",
    nom: { fr: "La suite falaise", en: "The cliff suite" },
    description: {
      fr: "S’endormir au-dessus de la marée. Lit king, baignoire îlot, et l’aube qui entre par l’est.",
      en: "Falling asleep above the tide. King bed, freestanding bath, and dawn coming in from the east.",
    },
    couleur: "#22302A",
  },
  {
    id: "cuisine-de-nuit",
    nom: { fr: "La cuisine de nuit", en: "The night kitchen" },
    description: {
      fr: "Pierre, laiton et chêne fumé. Une table d’hôte pour dix, tournée vers la lisière.",
      en: "Stone, brass and smoked oak. A table for ten, turned toward the treeline.",
    },
    couleur: "#8C7355",
  },
  {
    id: "sentier-prive",
    nom: { fr: "Le sentier privé", en: "The private path" },
    description: {
      fr: "Quarante-deux marches taillées dans la roche, jusqu'à une crique que la carte ne mentionne pas.",
      en: "Forty-two steps carved into the rock, down to a cove the map does not mention.",
    },
    couleur: "#16241D",
  },
];
