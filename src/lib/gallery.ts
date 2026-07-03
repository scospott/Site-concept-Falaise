// Galerie « La dérive » — 10 visuels. `image` optionnel : une fois les
// visuels IA exportés dans public/gallery/, renseigner le champ et le
// composant bascule sur next/image sans autre changement.

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
    id: "verriere-crepuscule",
    legende: {
      fr: "La verrière au crépuscule",
      en: "The glass hall at dusk",
    },
    format: "paysage",
    couleur: "#1E3A33",
  },
  {
    id: "crique-maree-basse",
    legende: { fr: "La crique à marée basse", en: "The cove at low tide" },
    format: "paysage",
    couleur: "#16241D",
  },
  {
    id: "brume-pins",
    legende: { fr: "La brume dans les pins", en: "Mist through the pines" },
    format: "portrait",
    couleur: "#182A20",
  },
  {
    id: "facade-ouest",
    legende: { fr: "La façade ouest", en: "The west face" },
    format: "paysage",
    couleur: "#22302A",
  },
  {
    id: "table-de-nuit",
    legende: { fr: "La table de nuit", en: "The night table" },
    format: "carre",
    couleur: "#2A2420",
  },
  {
    id: "bain-etoiles",
    legende: {
      fr: "Le bain sous les étoiles",
      en: "The bath under the stars",
    },
    format: "paysage",
    couleur: "#16211B",
  },
  {
    id: "suite-aube",
    legende: { fr: "La suite à l’aube", en: "The suite at dawn" },
    format: "portrait",
    couleur: "#22302A",
  },
  {
    id: "sentier",
    legende: { fr: "Le sentier", en: "The path" },
    format: "portrait",
    couleur: "#1E3A33",
  },
  {
    id: "feu",
    legende: { fr: "Le feu", en: "The fire" },
    format: "carre",
    couleur: "#8C7355",
  },
  {
    id: "lisiere-large",
    legende: {
      fr: "La lisière vue du large",
      en: "The tideline from the open sea",
    },
    format: "paysage",
    couleur: "#16241D",
  },
];
