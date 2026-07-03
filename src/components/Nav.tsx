"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getLenis } from "@/lib/lenis";

export default function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Fond nuit + filet après ~40px de scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture au changement de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Overlay ouvert : scroll verrouillé + fermeture Esc
  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.documentElement.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      document.documentElement.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Ancres de la page courante : scroll doux via Lenis
  const onAnchorClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
      if (pathname !== "/") return; // navigation inter-pages classique
      e.preventDefault();
      setOpen(false);
      const lenis = getLenis();
      const target = document.querySelector(hash);
      if (lenis) {
        lenis.scrollTo(hash, { offset: -64 });
      } else if (target) {
        target.scrollIntoView();
      }
    },
    [pathname],
  );

  const links = [
    { key: "villa", href: "/#villa", hash: "#villa" },
    { key: "galerie", href: "/#galerie", hash: "#galerie" },
    { key: "reserver", href: "/reservation", hash: null },
  ] as const;

  const otherLocale = routing.locales.find((l) => l !== locale) ?? "en";

  const localeSwitch = (
    <span className="flex items-center gap-1.5 text-xs tracking-[0.15em]">
      <span aria-current="true" className="text-ecume">
        {locale.toUpperCase()}
      </span>
      <span className="text-ecru/30">·</span>
      <Link
        href={pathname}
        locale={otherLocale}
        className="text-ecru/50 transition-colors duration-300 hover:text-ecru"
      >
        {otherLocale.toUpperCase()}
      </Link>
    </span>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled || open
          ? "border-filet bg-nuit"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-20 md:px-10">
        <Link
          href="/"
          aria-label={t("home")}
          data-cursor="link"
          className="relative z-50 font-display text-xl tracking-wide text-ecru transition-colors duration-300 hover:text-ecume"
        >
          Tideline
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8 text-sm">
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={
                    link.hash
                      ? (e) => onAnchorClick(e, link.hash)
                      : undefined
                  }
                  className={`transition-colors duration-300 ${
                    link.key === "reserver"
                      ? "text-ecume hover:text-ecru"
                      : "text-ecru/80 hover:text-ecume"
                  }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
          {localeSwitch}
        </div>

        {/* Burger mobile */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t("menuClose") : t("menuOpen")}
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span
            className={`absolute h-px w-6 bg-ecru transition-transform duration-300 ease-luxe ${
              open ? "rotate-45" : "-translate-y-[4px]"
            }`}
          />
          <span
            className={`absolute h-px w-6 bg-ecru transition-transform duration-300 ease-luxe ${
              open ? "-rotate-45" : "translate-y-[4px]"
            }`}
          />
        </button>
      </nav>

      {/* Overlay mobile — fond 100 % opaque, animé en transform uniquement */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-nuit px-8 transition-transform duration-500 ease-luxe md:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <ul className="flex flex-col gap-7">
          {links.map((link, i) => (
            <li
              key={link.key}
              className={`transition-all duration-500 ease-luxe ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${150 + i * 80}ms` : "0ms" }}
            >
              <Link
                href={link.href}
                tabIndex={open ? 0 : -1}
                onClick={
                  link.hash
                    ? (e) => onAnchorClick(e, link.hash)
                    : () => setOpen(false)
                }
                className="font-display text-4xl text-ecru transition-colors duration-300 hover:text-ecume"
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>
        <div
          className={`mt-12 transition-all duration-500 ease-luxe ${
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: open ? "420ms" : "0ms" }}
        >
          {localeSwitch}
        </div>
      </div>
    </header>
  );
}
