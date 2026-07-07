"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  PRICING,
  addDays,
  formatPrice,
  fromISO,
  getSeason,
  isBooked,
  isRangeFree,
  nightsBetween,
  toISO,
} from "@/lib/pricing";

type CalendrierProps = {
  start: string | null;
  end: string | null;
  onChange: (start: string | null, end: string | null) => void;
};

type MonthDef = { year: number; month: number };

function monthsInWindow(minDate: Date, maxDate: Date): MonthDef[] {
  const months: MonthDef[] = [];
  const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  while (cursor <= maxDate) {
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

/**
 * Calendrier custom (aucune librairie) — fenêtre de réservation de demain à
 * +6 mois, 2 mois côte à côte en desktop / 1 sur mobile, sélection
 * début → fin avec minimum de nuits par saison et nuits occupées bloquantes.
 */
export default function Calendrier({ start, end, onChange }: CalendrierProps) {
  const t = useTranslations("booking.calendar");
  const locale = useLocale();
  const intlLocale = locale === "fr" ? "fr-FR" : "en-GB";

  // Bornes calculées une fois par montage (composant rendu après mount —
  // pas de mismatch d'hydration).
  const { minDate, maxDate, months } = useMemo(() => {
    const today = new Date();
    const min = addDays(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      1,
    );
    const max = new Date(min);
    max.setMonth(max.getMonth() + PRICING.bookingWindowMonths);
    return { minDate: min, maxDate: max, months: monthsInWindow(min, max) };
  }, []);

  const [offset, setOffset] = useState(0);
  const [tooltipDay, setTooltipDay] = useState<string | null>(null);
  const maxOffset = months.length - 2;

  const dayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intlLocale, { weekday: "short" });
    // Semaine commençant lundi (2024-01-01 est un lundi)
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2024, 0, 1 + i)).replace(".", ""),
    );
  }, [intlLocale]);

  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }),
    [intlLocale],
  );
  const dayFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(intlLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [intlLocale],
  );

  const minNights = start ? PRICING[getSeason(fromISO(start))].minNights : 0;

  const handleClick = (iso: string) => {
    setTooltipDay(null);
    // Redémarrage : pas de début, ou plage déjà complète
    if (!start || (start && end)) {
      onChange(iso, null);
      return;
    }
    // Clic avant/sur le début → nouveau début
    if (iso <= start) {
      onChange(iso, null);
      return;
    }
    const nights = nightsBetween(start, iso);
    if (nights < minNights) {
      setTooltipDay(iso); // tooltip « Minimum X nuits », pas de sélection
      return;
    }
    if (!isRangeFree(start, iso)) {
      onChange(iso, null); // une nuit occupée dans l'intervalle → redémarre
      return;
    }
    onChange(start, iso);
  };

  const renderMonth = (def: MonthDef, hideOnMobile: boolean) => {
    const first = new Date(def.year, def.month, 1);
    const daysInMonth = new Date(def.year, def.month + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // lundi = 0
    const cells: (string | null)[] = [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) =>
        toISO(new Date(def.year, def.month, i + 1)),
      ),
    ];

    return (
      <div
        key={`${def.year}-${def.month}`}
        className={hideOnMobile ? "hidden md:block" : ""}
      >
        <p className="text-center font-display text-[22px] text-encre capitalize">
          {monthFmt.format(first)}
        </p>
        <div className="mt-4 grid grid-cols-7 gap-1">
          {dayNames.map((name) => (
            <span
              key={name}
              className="pb-1.5 text-center text-sm tracking-[0.08em] text-encre/60 uppercase"
            >
              {name}
            </span>
          ))}
          {cells.map((iso, i) => {
            if (!iso) return <span key={`blank-${i}`} />;
            const date = fromISO(iso);
            const outside = date < minDate || date > maxDate;
            const booked = !outside && isBooked(iso);
            const isStart = iso === start;
            const isEnd = iso === end;
            const inRange =
              start && end ? iso > start && iso < end : false;
            const rangeIndex = inRange && start ? nightsBetween(start, iso) : 0;
            const insufficient =
              !!start &&
              !end &&
              !booked &&
              !outside &&
              iso > start &&
              nightsBetween(start, iso) < minNights;
            const dayNumber = date.getDate();

            if (outside) {
              return (
                <span
                  key={iso}
                  aria-hidden
                  className="flex aspect-square min-h-11 items-center justify-center text-base text-encre/15"
                >
                  {dayNumber}
                </span>
              );
            }
            if (booked) {
              return (
                <span
                  key={iso}
                  aria-label={`${dayFmt.format(date)} — ${t("legendBooked")}`}
                  className="cal-booked flex aspect-square min-h-11 items-center justify-center rounded-[8px] text-base text-encre/45"
                >
                  {dayNumber}
                </span>
              );
            }
            return (
              <button
                key={iso}
                type="button"
                onClick={() => handleClick(iso)}
                aria-label={dayFmt.format(date)}
                aria-pressed={isStart || isEnd}
                className={`group relative flex aspect-square min-h-11 items-center justify-center rounded-[8px] border text-base transition-colors duration-300 ${
                  isStart || isEnd
                    ? "border-pin bg-pin text-creme"
                    : inRange
                      ? "cal-range border-transparent text-encre"
                      : "border-filet bg-blanc text-encre/85 hover:border-pin/60 hover:bg-pin/10"
                }`}
                style={
                  inRange
                    ? { animationDelay: `${rangeIndex * 22}ms` }
                    : undefined
                }
              >
                {dayNumber}
                {(insufficient || tooltipDay === iso) && (
                  <span
                    role="tooltip"
                    className={`pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-md border border-filet bg-calcaire px-3 py-1.5 text-sm whitespace-nowrap text-encre/90 transition-opacity duration-200 ${
                      tooltipDay === iso
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    {t("minNights", { n: minNights })}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const visibleSeason = getSeason(
    new Date(months[offset].year, months[offset].month, 15),
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          aria-label={t("prevMonth")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-filet text-encre transition-colors duration-300 hover:border-pin hover:text-pin disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </button>
        <p className="text-[15px] text-encre/75">
          {!start
            ? t("selectPrompt")
            : !end
              ? t("selectEnd")
              : t("nightsSelected", { n: nightsBetween(start, end) })}
        </p>
        <button
          type="button"
          onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
          disabled={offset >= maxOffset}
          aria-label={t("nextMonth")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-filet text-encre transition-colors duration-300 hover:border-pin hover:text-pin disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {renderMonth(months[offset], false)}
        {months[offset + 1] && renderMonth(months[offset + 1], true)}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-filet pt-5">
        <p className="text-[15px] text-encre/75">
          {visibleSeason === "haute"
            ? t("seasonHaute", {
                price: formatPrice(PRICING.haute.nightly, locale),
              })
            : t("seasonBasse", {
                price: formatPrice(PRICING.basse.nightly, locale),
              })}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-encre/75">
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px] border border-filet bg-blanc" />
            {t("legendAvailable")}
          </li>
          <li className="flex items-center gap-2">
            <span className="cal-booked h-3 w-3 rounded-[3px]" />
            {t("legendBooked")}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px] bg-pin" />
            {t("legendSelected")}
          </li>
        </ul>
      </div>
    </div>
  );
}
