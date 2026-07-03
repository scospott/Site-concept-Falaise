// Galerie « La dérive » — 10 visuels identifiés et branchés
// (public/gallery/). 07-pins et 10-mer n'ont pas encore de visuel correct :
// ils gardent leur aplat placeholder (voir PROGRESS « Photos manquantes »).

export type GalleryFormat = "portrait" | "paysage" | "carre";

export type GalleryItem = {
  id: string;
  legende: { fr: string; en: string };
  format: GalleryFormat;
  couleur: string;
  image?: string;
};

export const gallery: GalleryItem[] = [
  {
    id: "seuil",
    legende: { fr: "Le seuil", en: "The threshold" },
    format: "paysage",
    couleur: "#1E3A33",
    image: "/gallery/01-seuil.jpg",
  },
  {
    id: "terrasse-ouest",
    legende: { fr: "La terrasse ouest", en: "The west terrace" },
    format: "paysage",
    couleur: "#16241D",
    image: "/gallery/02-terrasse.jpg",
  },
  {
    id: "matiere",
    legende: { fr: "Calcaire et chêne", en: "Limestone and oak" },
    format: "carre",
    couleur: "#8C7355",
    image: "/gallery/03-matiere.jpg",
  },
  {
    id: "baignoire-pins",
    legende: {
      fr: "La baignoire face aux pins",
      en: "The bath among the pines",
    },
    format: "portrait",
    couleur: "#182A20",
    image: "/gallery/04-bain.jpg",
  },
  {
    id: "feu",
    legende: { fr: "Le feu", en: "The fire" },
    format: "portrait",
    couleur: "#2A2420",
    image: "/gallery/05-feu.jpg",
  },
  {
    id: "table-du-soir",
    legende: { fr: "La table du soir", en: "The evening table" },
    format: "paysage",
    couleur: "#16211B",
    image: "/gallery/06-table.jpg",
  },
  {
    id: "pins-dores",
    legende: { fr: "Les pins dorés", en: "Golden pines" },
    format: "portrait",
    couleur: "#1E3A33",
    // Visuel manquant — placeholder conservé
  },
  {
    id: "crique",
    legende: { fr: "La crique", en: "The cove" },
    format: "paysage",
    couleur: "#22302A",
    image: "/gallery/08-crique.jpg",
  },
  {
    id: "villa-mer",
    legende: { fr: "La villa, vue du large", en: "The villa from the sea" },
    format: "paysage",
    couleur: "#16241D",
    image: "/gallery/09-villa-mer.jpg",
  },
  {
    id: "mer-scintillante",
    legende: { fr: "La mer scintillante", en: "The glittering sea" },
    format: "paysage",
    couleur: "#16211B",
    // Visuel manquant — placeholder conservé
  },
];
