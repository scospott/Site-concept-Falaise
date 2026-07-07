// Galerie « La dérive » — vraies photos uniquement (public/gallery/).
// Les slots sans visuel (ex-07-pins, ex-10-mer) ont été retirés : si une
// photo arrive, ajouter l'item avec son champ image (le placeholder
// couleur ne sert que de fallback de chargement).

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
    couleur: "#1E3A31",
    image: "/gallery/01-seuil.jpg",
  },
  {
    id: "terrasse-ouest",
    legende: { fr: "La terrasse ouest", en: "The west terrace" },
    format: "paysage",
    couleur: "#2C3024",
    image: "/gallery/02-terrasse.jpg",
  },
  {
    id: "matiere",
    legende: { fr: "Calcaire et chêne", en: "Limestone and oak" },
    format: "carre",
    couleur: "#8A6B3F",
    image: "/gallery/03-matiere.jpg",
  },
  {
    id: "baignoire-pins",
    legende: {
      fr: "La baignoire face aux pins",
      en: "The bath among the pines",
    },
    format: "portrait",
    couleur: "#2E4429",
    image: "/gallery/04-bain.jpg",
  },
  {
    id: "feu",
    legende: { fr: "Le feu", en: "The fire" },
    format: "portrait",
    couleur: "#3A362C",
    image: "/gallery/05-feu.jpg",
  },
  {
    id: "table-du-soir",
    legende: { fr: "La table du soir", en: "The evening table" },
    format: "paysage",
    couleur: "#2C3024",
    image: "/gallery/06-table.jpg",
  },
  {
    id: "crique",
    legende: { fr: "La crique", en: "The cove" },
    format: "paysage",
    couleur: "#3A362C",
    image: "/gallery/08-crique.jpg",
  },
  {
    id: "villa-mer",
    legende: { fr: "La villa, vue du large", en: "The villa from the sea" },
    format: "paysage",
    couleur: "#2C3024",
    image: "/gallery/09-villa-mer.jpg",
  },
];
