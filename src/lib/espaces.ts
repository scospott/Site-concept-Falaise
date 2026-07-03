// Les espaces de la villa — data bilingue. Visuels IA identifiés et
// branchés (public/espaces/) ; les sources PNG vivent dans bible/ (gitignoré).

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
      fr: "Un salon cathédrale face au large. Double hauteur, cheminée suspendue, et l’horizon pour quatrième mur.",
      en: "A cathedral living room facing the open sea. Double height, a suspended fireplace, the horizon as a fourth wall.",
    },
    couleur: "#1E3A33",
    image: "/espaces/verriere.jpg",
  },
  {
    id: "bain-nordique",
    nom: { fr: "Le bain nordique", en: "The nordic bath" },
    description: {
      fr: "Sous les pins, dans la vapeur. L’océan en fond sonore, le soir qui descend.",
      en: "Under the pines, in the steam. The ocean as a soundtrack, the evening settling in.",
    },
    couleur: "#182A20",
    image: "/espaces/bain-nordique.jpg",
  },
  {
    id: "suite-falaise",
    nom: { fr: "La suite falaise", en: "The cliff suite" },
    description: {
      fr: "S’endormir au-dessus de la marée, la lumière du soir sur le lin.",
      en: "Falling asleep above the tide, the evening light on the linen.",
    },
    couleur: "#22302A",
    image: "/espaces/suite-falaise.jpg",
  },
  {
    id: "cuisine-de-nuit",
    nom: { fr: "La cuisine de nuit", en: "The night kitchen" },
    description: {
      fr: "Pierre, chêne clair et laiton. Une table d’hôte pour dix, tournée vers la lisière.",
      en: "Stone, pale oak and brass. A table for ten, turned toward the treeline.",
    },
    couleur: "#8C7355",
    image: "/espaces/cuisine.jpg",
  },
  {
    id: "sentier-prive",
    nom: { fr: "Le sentier privé", en: "The private path" },
    description: {
      fr: "Quarante-deux marches taillées dans la roche, jusqu'à une crique que la carte ne mentionne pas.",
      en: "Forty-two steps carved into the rock, down to a cove the map does not mention.",
    },
    couleur: "#16241D",
    image: "/espaces/sentier.jpg",
  },
  {
    id: "piscine-horizon",
    nom: { fr: "La piscine de l’horizon", en: "The horizon pool" },
    description: {
      fr: "Un bassin à débordement posé au bord du vide. L’eau de la piscine et celle de l’océan ne font plus qu’une.",
      en: "An infinity pool set on the edge of the void. Where the water of the pool and the ocean become one.",
    },
    couleur: "#1E3A33",
    image: "/espaces/piscine.jpg",
  },
];
