// Avis voyageurs — fictifs, assumés dans le cadre du site concept.
// Chaque avis reste dans sa langue d'origine quelle que soit la locale
// (réaliste, et démontre le multilinguisme) ; seuls les libellés et les
// villes sont traduits.

export type Avis = {
  id: string;
  nom: string;
  ville: { fr: string; en: string };
  /** Langue du texte de l'avis (attribut lang) */
  lang: "fr" | "en";
  note: 5;
  texte: string;
};

export const avis: Avis[] = [
  {
    id: "claire-mathieu",
    nom: "Claire & Mathieu",
    ville: { fr: "Paris", en: "Paris" },
    lang: "fr",
    note: 5,
    texte:
      "On est arrivés pour deux nuits, on est restés cinq. Le silence de la forêt d’un côté, la marée de l’autre — on ne savait plus quel monde choisir.",
  },
  {
    id: "ingrid",
    nom: "Ingrid",
    ville: { fr: "Oslo", en: "Oslo" },
    lang: "en",
    note: 5,
    texte:
      "The house breathes with the tide. I have stayed in many coastal villas — none placed you on the edge quite like this.",
  },
  {
    id: "tomas",
    nom: "Tomás",
    ville: { fr: "Lisbonne", en: "Lisbon" },
    lang: "en",
    note: 5,
    texte:
      "Dinner at the oak table, fog rolling through the pines, the ocean glowing below. Unreal.",
  },
  {
    id: "aiko-ren",
    nom: "Aiko & Ren",
    ville: { fr: "Tokyo", en: "Tokyo" },
    lang: "en",
    note: 5,
    texte:
      "Every detail is intentional. The nordic bath under the pines at night is something we still talk about.",
  },
  {
    id: "margaux",
    nom: "Margaux",
    ville: { fr: "Bruxelles", en: "Brussels" },
    lang: "fr",
    note: 5,
    texte:
      "La suite falaise porte bien son nom : on s’endort littéralement au-dessus de l’eau. Réveil brumeux inoubliable.",
  },
  {
    id: "james",
    nom: "James",
    ville: { fr: "Londres", en: "London" },
    lang: "en",
    note: 5,
    texte:
      "Booked for the architecture, stayed for the silence. The private path to the cove is worth the trip alone.",
  },
];
