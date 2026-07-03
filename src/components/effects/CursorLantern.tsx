"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { effects } from "@/lib/effects";

/**
 * Effet 2 — curseur-lanterne. Desktop (pointer: fine) uniquement, jamais en
 * reduced-motion. Le curseur natif est CONSERVÉ (accessibilité) ; on ajoute
 * un disque écume 8px + halo radial 120px très faible qui suivent la souris
 * (lerp 0.12 via rAF). Sur [data-cursor="link"] le disque grossit à 40px
 * avec un filet ; sur [data-cursor="view"] (items galerie) il devient une
 * pastille « Voir » / « View ».
 * Pilote aussi le spotlight : met à jour --mx/--my (coordonnées locales
 * lissées) sur les éléments .spotlight-wrap sous le pointeur.
 */
export default function CursorLantern() {
  const t = useTranslations("lantern");
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!effects.enableLantern && !effects.enableSpotlight) return;
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    setActive(true);

    const dot = dotRef.current;
    const halo = haloRef.current;
    const label = labelRef.current;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let mode: "default" | "link" | "view" = "default";
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        if (dot) dot.style.opacity = "1";
        if (halo) halo.style.opacity = "1";
      }
      const target = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      const next =
        (target?.dataset.cursor as "link" | "view" | undefined) ?? "default";
      if (next !== mode) {
        mode = next;
        if (dot && label) {
          if (mode === "view") {
            dot.classList.add("lantern-view");
            dot.classList.remove("lantern-link");
            label.style.opacity = "1";
          } else if (mode === "link") {
            dot.classList.add("lantern-link");
            dot.classList.remove("lantern-view");
            label.style.opacity = "0";
          } else {
            dot.classList.remove("lantern-link", "lantern-view");
            label.style.opacity = "0";
          }
        }
      }
    };

    const onLeave = () => {
      visible = false;
      if (dot) dot.style.opacity = "0";
      if (halo) halo.style.opacity = "0";
    };

    const tick = () => {
      x += (mx - x) * 0.12;
      y += (my - y) * 0.12;
      if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%,-50%)`;
      if (halo)
        halo.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%,-50%)`;

      if (effects.enableSpotlight) {
        // Coordonnées locales lissées pour le spotlight
        document
          .querySelectorAll<HTMLElement>(".spotlight-wrap")
          .forEach((el) => {
            const r = el.getBoundingClientRect();
            if (
              x >= r.left - 260 &&
              x <= r.right + 260 &&
              y >= r.top - 260 &&
              y <= r.bottom + 260
            ) {
              el.style.setProperty("--mx", `${x - r.left}px`);
              el.style.setProperty("--my", `${y - r.top}px`);
            }
          });
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!effects.enableLantern) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[68] hidden ${active ? "lg:block" : ""}`}
    >
      <div
        ref={haloRef}
        className="lantern-halo absolute top-0 left-0 opacity-0"
      />
      <div ref={dotRef} className="lantern-dot absolute top-0 left-0 opacity-0">
        <span ref={labelRef} className="lantern-label">
          {t("view")}
        </span>
      </div>
    </div>
  );
}
