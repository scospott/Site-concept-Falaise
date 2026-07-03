"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ChatWindow from "./ChatWindow";

/**
 * Widget flottant global — bulle bas-droite, panneau 380×560 (plein écran
 * sur mobile), même hook et même historique que la section inline.
 */
export default function ChatWidget() {
  const t = useTranslations("hote");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Panneau */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label={t("title")}
        aria-hidden={!open}
        className={`fixed z-[60] transition-all duration-300 ease-luxe motion-reduce:transition-none ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        } inset-0 origin-bottom-right p-3 md:inset-auto md:right-6 md:bottom-24 md:h-[560px] md:w-[380px] md:p-0`}
      >
        <div className="h-full w-full">
          <ChatWindow compact />
        </div>
      </div>

      {/* Bulle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? t("widgetClose") : t("widgetOpen")}
        className="fixed right-5 bottom-5 z-[61] flex h-14 w-14 items-center justify-center rounded-full bg-ecume text-nuit shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-luxe hover:-translate-y-0.5 md:right-6 md:bottom-6"
      >
        {open ? (
          <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden>
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <path
              fill="currentColor"
              d="M12 3C7 3 3 6.6 3 11c0 2.2 1 4.2 2.7 5.6-.1.9-.5 2.2-1.5 3.2-.2.2 0 .5.2.5 1.9-.1 3.4-.9 4.3-1.6.4.1 2.2.3 3.3.3 5 0 9-3.6 9-8S17 3 12 3z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
