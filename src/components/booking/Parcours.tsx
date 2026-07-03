"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  formatPrice,
  fromISO,
  quote,
  type Quote,
} from "@/lib/pricing";
import Calendrier from "./Calendrier";
import Button from "@/components/Button";

const STEPS = ["dates", "guests", "summary", "details"] as const;
const MAX_GUESTS = 10;

type FormState = { name: string; email: string; phone: string; message: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

function Champ({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-ecru/70">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-bois">{error}</p>}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-[10px] border bg-sousbois px-4 py-3 text-sm text-ecru placeholder:text-ecru/35 transition-colors duration-300 focus:outline-none ${
    hasError ? "border-bois" : "border-filet focus:border-ecume/60"
  }`;

function Compteur({
  label,
  hint,
  value,
  min,
  max,
  onChange,
  decreaseLabel,
  increaseLabel,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-ecru/30 text-lg text-ecru transition-colors duration-300 hover:border-ecume hover:text-ecume disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="flex items-center justify-between border-b border-filet py-5">
      <div>
        <p className="text-ecru">{label}</p>
        <p className="text-xs text-ecru/50">{hint}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className={btn}
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={`${decreaseLabel} — ${label}`}
        >
          −
        </button>
        <span className="w-8 text-center font-display text-2xl text-ecru">
          {value}
        </span>
        <button
          type="button"
          className={btn}
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`${increaseLabel} — ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function RecapContenu({
  start,
  end,
  adults,
  children,
  devis,
  locale,
}: {
  start: string | null;
  end: string | null;
  adults: number;
  children: number;
  devis: Quote | null;
  locale: string;
}) {
  const t = useTranslations("booking.summary");
  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
        weekday: "short",
        day: "numeric",
        month: "long",
      }),
    [locale],
  );

  if (!start || !end || !devis) {
    return <p className="text-sm text-ecru/50">{t("empty")}</p>;
  }
  return (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-ecru/60">{t("arrival")}</span>
        <span className="text-right text-ecru">
          {dateFmt.format(fromISO(start))}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-ecru/60">{t("departure")}</span>
        <span className="text-right text-ecru">
          {dateFmt.format(fromISO(end))}
        </span>
      </div>
      <div className="flex justify-between gap-4 border-b border-filet pb-4">
        <span className="text-ecru/60">
          {t("travellers", { adults, children })}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-ecru/60">
          {t("nightsLine", {
            n: devis.nights,
            price: formatPrice(devis.nightly, locale),
          })}
        </span>
        <span className="text-ecru">
          {formatPrice(devis.accommodation, locale)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-ecru/60">{t("cleaning")}</span>
        <span className="text-ecru">{formatPrice(devis.cleaning, locale)}</span>
      </div>
      <div className="flex justify-between gap-4 border-b border-filet pb-4">
        <span className="text-ecru/60">
          {t("touristTax")}
          <span className="mt-0.5 block text-[11px] text-ecru/40">
            {t("touristTaxHint")}
          </span>
        </span>
        <span className="text-ecru">
          {formatPrice(devis.touristTax, locale)}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-4 pt-1">
        <span className="text-ecru/60">{t("total")}</span>
        <span className="font-display text-[32px] leading-none text-ecru">
          {formatPrice(devis.total, locale)}
        </span>
      </div>
    </div>
  );
}

function Confirmation({
  reference,
  start,
  end,
  adults,
  children,
  devis,
  locale,
  onReset,
}: {
  reference: string;
  start: string;
  end: string;
  adults: number;
  children: number;
  devis: Quote;
  locale: string;
  onReset: () => void;
}) {
  const t = useTranslations("booking.confirmation");
  return (
    <div className="step-enter mx-auto max-w-xl text-center">
      <svg
        viewBox="0 0 64 64"
        className="confirm-check mx-auto h-20 w-20"
        aria-hidden
      >
        <circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke="#A9D8C6"
          strokeWidth="1.5"
        />
        <path
          d="M20 33.5L28.5 42 44 24"
          fill="none"
          stroke="#A9D8C6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h2 className="display-l mt-8 text-ecru">{t("title")}</h2>
      <p className="mt-3 text-sm tracking-wide text-ecume">
        {t("reference", { ref: reference })}
      </p>
      <div className="mt-10 rounded-[10px] border border-filet bg-sousbois p-6 text-left">
        <RecapContenu
          start={start}
          end={end}
          adults={adults}
          children={children}
          devis={devis}
          locale={locale}
        />
      </div>
      <p className="mt-6 text-sm text-ecru/70">{t("reply")}</p>
      <p className="mx-auto mt-8 max-w-md rounded-[10px] border border-filet px-5 py-4 text-xs leading-relaxed text-ecru/50">
        {t("demo")}
      </p>
      <div className="mt-10">
        <Button variant="ghost" onClick={onReset}>
          {t("newRequest")}
        </Button>
      </div>
    </div>
  );
}

/**
 * Parcours de réservation 4 étapes — maquette haute finition SANS paiement :
 * aucune requête réseau, envoi simulé (1 200 ms), données de disponibilité
 * déterministes. Rendu après mount (les bornes de dates dépendent du jour
 * réel — pas de mismatch d'hydration avec le HTML statique).
 */
export default function Parcours() {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [step, setStep] = useState(0);
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const devis = start && end ? quote(start, end, adults) : null;

  const canContinue =
    step === 0 ? Boolean(start && end) : step === 1 ? adults >= 1 : true;

  const validateForm = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = t("form.required");
    if (!form.email.trim()) next.email = t("form.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = t("form.invalidEmail");
    if (!form.phone.trim()) next.phone = t("form.required");
    else if (!/^[+0-9][0-9 ().-]{5,19}$/.test(form.phone.trim()))
      next.phone = t("form.invalidPhone");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validateForm() || sending) return;
    setSending(true);
    // Envoi simulé — aucun appel réseau réel
    window.setTimeout(() => {
      setSending(false);
      setReference(
        `TDL-2026-${String(Date.now() % 10000).padStart(4, "0")}`,
      );
    }, 1200);
  };

  const reset = () => {
    setStep(0);
    setStart(null);
    setEnd(null);
    setAdults(2);
    setChildren(0);
    setForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setReference(null);
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-6 pb-32 md:px-10">
        <div className="h-96 animate-pulse rounded-[10px] border border-filet bg-sousbois/50" />
      </div>
    );
  }

  if (reference && start && end && devis) {
    return (
      <div className="mx-auto max-w-6xl px-6 pt-4 pb-32 md:px-10">
        <Confirmation
          reference={reference}
          start={start}
          end={end}
          adults={adults}
          children={children}
          devis={devis}
          locale={locale}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-40 md:px-10 lg:pb-32">
      {/* Barre de progression — 4 segments */}
      <nav aria-label={t("stepLabel", { current: step + 1, total: 4 })}>
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((key, i) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`w-full text-left ${i < step ? "cursor-pointer" : ""}`}
              >
                <span
                  className={`block h-[3px] rounded-full transition-colors duration-500 ${
                    i <= step ? "bg-ecume" : "bg-filet"
                  }`}
                />
                <span
                  className={`mt-2 hidden text-[11px] tracking-[0.15em] uppercase md:block ${
                    i === step ? "text-ecume" : "text-ecru/40"
                  }`}
                >
                  {t(`steps.${key}`)}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] tracking-[0.15em] text-ecru/50 uppercase md:hidden">
          {t(`steps.${STEPS[step]}`)} — {t("stepLabel", { current: step + 1, total: 4 })}
        </p>
      </nav>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_360px]">
        {/* Colonne principale — contenu de l'étape (remonté à chaque step) */}
        <div key={step} className="step-enter">
          {step === 0 && (
            <Calendrier
              start={start}
              end={end}
              onChange={(s, e) => {
                setStart(s);
                setEnd(e);
              }}
            />
          )}

          {step === 1 && (
            <div>
              <Compteur
                label={t("guests.adults")}
                hint={t("guests.adultsHint")}
                value={adults}
                min={1}
                max={Math.min(10, MAX_GUESTS - children)}
                onChange={setAdults}
                decreaseLabel={t("guests.decrease")}
                increaseLabel={t("guests.increase")}
              />
              <Compteur
                label={t("guests.children")}
                hint={t("guests.childrenHint")}
                value={children}
                min={0}
                max={Math.min(8, MAX_GUESTS - adults)}
                onChange={setChildren}
                decreaseLabel={t("guests.decrease")}
                increaseLabel={t("guests.increase")}
              />
              <p className="mt-5 text-xs text-ecru/50">
                {t("guests.capacity")} · {t("guests.crib")}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-[10px] border border-filet bg-sousbois p-6 md:p-8 lg:border-transparent lg:bg-transparent lg:p-0">
              <h2 className="display-l mb-8 text-ecru">
                {t("summary.title")}
              </h2>
              <RecapContenu
                start={start}
                end={end}
                adults={adults}
                children={children}
                devis={devis}
                locale={locale}
              />
            </div>
          )}

          {step === 3 && (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              noValidate
            >
              <Champ id="bk-name" label={t("form.name")} error={errors.name}>
                <input
                  id="bk-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass(Boolean(errors.name))}
                />
              </Champ>
              <div className="grid gap-6 md:grid-cols-2">
                <Champ
                  id="bk-email"
                  label={t("form.email")}
                  error={errors.email}
                >
                  <input
                    id="bk-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass(Boolean(errors.email))}
                  />
                </Champ>
                <Champ
                  id="bk-phone"
                  label={t("form.phone")}
                  error={errors.phone}
                >
                  <input
                    id="bk-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className={inputClass(Boolean(errors.phone))}
                  />
                </Champ>
              </div>
              <Champ id="bk-message" label={t("form.message")}>
                <textarea
                  id="bk-message"
                  rows={4}
                  placeholder={t("form.messagePlaceholder")}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`${inputClass(false)} resize-none`}
                />
              </Champ>
            </form>
          )}

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between gap-4">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                {t("nav.back")}
              </Button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <Button
                onClick={() => canContinue && setStep(step + 1)}
                disabled={!canContinue}
                className={!canContinue ? "cursor-not-allowed opacity-40" : ""}
              >
                {t("nav.next")}
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={sending}
                className={sending ? "cursor-wait opacity-70" : ""}
              >
                {sending ? t("nav.sending") : t("nav.submit")}
              </Button>
            )}
          </div>
        </div>

        {/* Récap sticky desktop — visible dès l'étape 1, pleine lumière à l'étape 3 */}
        <aside
          className={`sticky top-28 hidden rounded-[10px] border bg-sousbois p-6 transition-all duration-500 lg:block ${
            step === 2
              ? "border-ecume/50 shadow-[0_0_50px_rgba(169,216,198,0.07)]"
              : "border-filet"
          }`}
        >
          <p className="eyebrow mb-6">{t("summary.title")}</p>
          <RecapContenu
            start={start}
            end={end}
            adults={adults}
            children={children}
            devis={devis}
            locale={locale}
          />
        </aside>
      </div>

      {/* Récap mobile — carte repliable en bas d'écran */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-filet bg-sousbois lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen((o) => !o)}
          aria-expanded={sheetOpen}
          className="flex w-full items-center justify-between px-6 py-4 pr-24"
        >
          <span className="text-xs tracking-[0.15em] text-ecru/60 uppercase">
            {sheetOpen ? t("summary.hide") : t("summary.show")}
          </span>
          <span className="font-display text-xl text-ecru">
            {devis ? formatPrice(devis.total, locale) : "—"}
          </span>
        </button>
        <div
          className={`grid transition-all duration-500 ease-luxe ${
            sheetOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-filet px-6 py-5">
              <RecapContenu
                start={start}
                end={end}
                adults={adults}
                children={children}
                devis={devis}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
