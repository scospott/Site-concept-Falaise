// Avis voyageurs — fictifs, assumés dans le cadre du site concept.
// Chaque avis reste dans sa langue d'origine quelle que soit la locale
// (réaliste, et démontre le multilinguisme) ; seuls les libellés, les
// villes et les dates sont traduits.

export type Avis = {
  id: string;
  nom: string;
  ville: { fr: string; en: string };
  /** Mois du séjour (fictif), affiché à côté de la ville */
  date: { fr: string; en: string };
  /** Langue du texte de l'avis (attribut lang) */
  lang: "fr" | "en";
  note: 5;
  texte: string;
};

/** Sous-notes par catégorie (pattern plateforme, re-skinné La Falaise) */
export type AvisCategorie = {
  key: string;
  label: { fr: string; en: string };
  note: number;
};

export const categoriesAvis: AvisCategorie[] = [
  { key: "proprete", label: { fr: "Propreté", en: "Cleanliness" }, note: 4.9 },
  { key: "exactitude", label: { fr: "Exactitude", en: "Accuracy" }, note: 5.0 },
  { key: "arrivee", label: { fr: "Arrivée", en: "Check-in" }, note: 4.9 },
  {
    key: "communication",
    label: { fr: "Communication", en: "Communication" },
    note: 5.0,
  },
  { key: "emplacement", label: { fr: "Emplacement", en: "Location" }, note: 5.0 },
  { key: "qualite-prix", label: { fr: "Qualité-prix", en: "Value" }, note: 4.8 },
];

export const avis: Avis[] = [
  {
    id: "claire-mathieu",
    nom: "Claire & Mathieu",
    ville: { fr: "Paris", en: "Paris" },
    date: { fr: "Février 2026", en: "February 2026" },
    lang: "fr",
    note: 5,
    texte:
      "On est arrivés pour deux nuits, on est restés cinq. Le silence de la forêt d’un côté, la marée de l’autre — on ne savait plus quel monde choisir.",
  },
  {
    id: "ingrid",
    nom: "Ingrid",
    ville: { fr: "Oslo", en: "Oslo" },
    date: { fr: "Mars 2026", en: "March 2026" },
    lang: "en",
    note: 5,
    texte:
      "The house breathes with the tide. I have stayed in many coastal villas — none placed you on the edge quite like this.",
  },
  {
    id: "tomas",
    nom: "Tomás",
    ville: { fr: "Lisbonne", en: "Lisbon" },
    date: { fr: "Avril 2026", en: "April 2026" },
    lang: "en",
    note: 5,
    texte:
      "Dinner at the oak table, fog rolling through the pines, the ocean glowing below. Unreal.",
  },
  {
    id: "aiko-ren",
    nom: "Aiko & Ren",
    ville: { fr: "Tokyo", en: "Tokyo" },
    date: { fr: "Mai 2026", en: "May 2026" },
    lang: "en",
    note: 5,
    texte:
      "Every detail is intentional. The nordic bath under the pines at night is something we still talk about.",
  },
  {
    id: "margaux",
    nom: "Margaux",
    ville: { fr: "Bruxelles", en: "Brussels" },
    date: { fr: "Mai 2026", en: "May 2026" },
    lang: "fr",
    note: 5,
    texte:
      "La suite falaise porte bien son nom : on s’endort littéralement au-dessus de l’eau. Réveil brumeux inoubliable.",
  },
  {
    id: "james",
    nom: "James",
    ville: { fr: "Londres", en: "London" },
    date: { fr: "Juin 2026", en: "June 2026" },
    lang: "en",
    note: 5,
    texte:
      "Booked for the architecture, stayed for the silence. The private path to the cove is worth the trip alone.",
  },
];
