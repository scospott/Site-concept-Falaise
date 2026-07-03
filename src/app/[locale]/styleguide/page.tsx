import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import ForestLine from "@/components/ForestLine";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const palette = [
  { name: "Nuit", token: "nuit", hex: "#101914", usage: "Fond global" },
  { name: "Sous-bois", token: "sousbois", hex: "#16211B", usage: "Surfaces, cartes" },
  { name: "Écru", token: "ecru", hex: "#ECE8DC", usage: "Texte" },
  { name: "Écume", token: "ecume", hex: "#A9D8C6", usage: "Accent, CTA, liens actifs" },
  { name: "Bois", token: "bois", hex: "#8C7355", usage: "Accent chaud, rare" },
  { name: "Filet", token: "filet", hex: "#2A362F", usage: "Bordures, séparateurs" },
];

const swatchBg: Record<string, string> = {
  nuit: "bg-nuit",
  sousbois: "bg-sousbois",
  ecru: "bg-ecru",
  ecume: "bg-ecume",
  bois: "bg-bois",
  filet: "bg-filet",
};

function Bloc({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-filet py-14">
      <p className="eyebrow mb-8">{title}</p>
      {children}
    </section>
  );
}

export default async function StyleguidePage({
  params,
}: PageProps<"/[locale]/styleguide">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-5xl px-6 pb-32 pt-32 md:px-10">
      <Eyebrow>Système de design</Eyebrow>
      <h1 className="display-xl mt-4">
        Nocturne <em>— styleguide</em>
      </h1>
      <p className="mt-4 max-w-lg text-ecru/60">
        Page d&apos;audit de la direction artistique. Non indexée, réservée à
        la validation visuelle des fondations.
      </p>

      <div className="mt-16 space-y-0">
        <Bloc title="Palette">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {palette.map((c) => (
              <div
                key={c.token}
                className="overflow-hidden rounded-[10px] border border-filet"
              >
                <div className={`h-24 ${swatchBg[c.token]}`} />
                <div className="bg-sousbois p-4">
                  <p className="text-sm text-ecru">{c.name}</p>
                  <p className="mt-1 font-mono text-xs text-ecru/50">
                    {c.hex} · --color-{c.token}
                  </p>
                  <p className="mt-1 text-xs text-ecru/50">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </Bloc>

        <Bloc title="Échelle typographique">
          <div className="space-y-10">
            <div>
              <p className="mb-2 text-xs text-ecru/40">
                display-xl — Bodoni Moda, clamp(2.6rem, 7vw, 4.5rem)
              </p>
              <p className="display-xl">Where the sea meets the forest</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-ecru/40">
                display-l — Bodoni Moda, clamp(1.8rem, 4vw, 2.6rem)
              </p>
              <p className="display-l">La lisière, à la nuit tombée</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-ecru/40">
                Spécimen italique — Bodoni Moda Italic
              </p>
              <p className="display-l">
                <em>Entre le dernier pin et la première vague</em>
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-ecru/40">eyebrow — 11px, 0.3em</p>
              <Eyebrow>Villa · Côte sauvage</Eyebrow>
            </div>
            <div>
              <p className="mb-2 text-xs text-ecru/40">
                Corps — Instrument Sans 15–16px, interligne 1.7
              </p>
              <p className="max-w-xl">
                Côté ouest, le verre encadre le large. Côté est, le chêne
                s&apos;ouvre sur la canopée. Entre les deux : un seuil, une
                maison, un silence. Les nuances de texte atténué passent par
                l&apos;opacité —{" "}
                <span className="text-ecru/70">écru 70&nbsp;%</span>,{" "}
                <span className="text-ecru/50">écru 50&nbsp;%</span>.
              </p>
            </div>
          </div>
        </Bloc>

        <Bloc title="Titres de section">
          <SectionTitle>Ce qu&apos;ils en disent</SectionTitle>
        </Bloc>

        <Bloc title="Boutons">
          <div className="flex flex-wrap items-center gap-5">
            <Button href="/reservation">Réserver un séjour</Button>
            <Button href="/" variant="ghost">
              Découvrir la villa
            </Button>
          </div>
          <p className="mt-4 text-xs text-ecru/40">
            Pill 999px · transition 0.35s cubic-bezier(.22,1,.36,1) · hover :
            écume éclaircie + translateY(-1px) / filet + texte écume
          </p>
        </Bloc>

        <Bloc title="Reveal (fade + stagger)">
          <Reveal stagger={0.12} className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-[10px] border border-filet bg-sousbois p-6"
              >
                <p className="font-display text-2xl text-ecume">0{n}</p>
                <p className="mt-2 text-sm text-ecru/70">
                  Révélé au scroll — fade + translateY(24px), expo.out, 1s.
                </p>
              </div>
            ))}
          </Reveal>
        </Bloc>

        <Bloc title="Reveal (variante mask)">
          <Reveal variant="mask">
            <p className="display-l max-w-2xl">
              La lumière gagne sur le noir, ligne après ligne.
            </p>
          </Reveal>
        </Bloc>

        <Bloc title="ForestLine">
          <div className="overflow-hidden rounded-[10px] border border-filet bg-[#1a2a22]">
            <ForestLine className="block h-28 w-full text-nuit" />
          </div>
        </Bloc>
      </div>
    </main>
  );
}
