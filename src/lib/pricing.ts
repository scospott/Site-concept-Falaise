// Tarifs & disponibilités fictives — DÉTERMINISTES (jamais de Math.random
// au render : piège hydration). Toute la logique de dates travaille en
// heure locale avec des clés ISO YYYY-MM-DD.

export type Season = "haute" | "basse";

export const PRICING = {
  haute: { nightly: 1900, minNights: 3, occupancy: 60 }, // juin → septembre
  basse: { nightly: 1100, minNights: 2, occupancy: 25 }, // octobre → mai
  cleaningFee: 250,
  touristTaxPerNightPerAdult: 2.5,
  bookingWindowMonths: 6,
} as const;

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Juin (5) → septembre (8) : haute saison. */
export function getSeason(date: Date): Season {
  const month = date.getMonth();
  return month >= 5 && month <= 8 ? "haute" : "basse";
}

/**
 * Disponibilité fictive : hash simple de la chaîne date → occupé si
 * hash % 100 < taux d'occupation de la saison. Fonction pure.
 */
export function isBooked(dateISO: string): boolean {
  let hash = 0;
  for (let i = 0; i < dateISO.length; i++) {
    hash = (hash * 31 + dateISO.charCodeAt(i)) % 1000003;
  }
  const season = getSeason(fromISO(dateISO));
  return hash % 100 < PRICING[season].occupancy;
}

/** Nombre de nuits entre deux dates (arrivée / départ). */
export function nightsBetween(startISO: string, endISO: string): number {
  const ms = fromISO(endISO).getTime() - fromISO(startISO).getTime();
  return Math.round(ms / 86400000);
}

/** Toutes les nuits du séjour sont-elles libres ? (le jour de départ peut être occupé) */
export function isRangeFree(startISO: string, endISO: string): boolean {
  let cursor = fromISO(startISO);
  const end = fromISO(endISO);
  while (cursor < end) {
    if (isBooked(toISO(cursor))) return false;
    cursor = addDays(cursor, 1);
  }
  return true;
}

export type Quote = {
  nights: number;
  nightly: number;
  season: Season;
  accommodation: number;
  cleaning: number;
  touristTax: number;
  total: number;
};

/** Devis : X nuits × tarif de la saison d'arrivée + ménage + taxe de séjour. */
export function quote(
  startISO: string,
  endISO: string,
  adults: number,
): Quote {
  const nights = nightsBetween(startISO, endISO);
  const season = getSeason(fromISO(startISO));
  const nightly = PRICING[season].nightly;
  const accommodation = nights * nightly;
  const cleaning = PRICING.cleaningFee;
  const touristTax = PRICING.touristTaxPerNightPerAdult * nights * adults;
  return {
    nights,
    nightly,
    season,
    accommodation,
    cleaning,
    touristTax,
    total: accommodation + cleaning + touristTax,
  };
}

export function formatPrice(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
