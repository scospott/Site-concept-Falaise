import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import RockStrata from "@/components/RockStrata";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const palette = [
  { name: "Calcaire", token: "calcaire", hex: "#EFE6D2", usage: "Pierre au soleil, fond global" },
  { name: "Sable", token: "sable", hex: "#E6D7B8", usage: "Surfaces, sections alternées, calendrier" },
  { name: "Encre", token: "encre", hex: "#2C3024", usage: "Texte, vert-brun des pins sombres" },
  { name: "Pin", token: "pin", hex: "#3C5638", usage: "Accent : CTA, liens actifs, sélections" },
  { name: "Soleil", token: "soleil", hex: "#C08A45", usage: "Miel : étoiles, index, labels chauds" },
  { name: "Filet", token: "filet", hex: "#D9CBA8", usage: "Bordures, séparateurs" },
  { name: "Abysse", token: "abysse", hex: "#3A362C", usage: "Granit : footer" },
];

const swatchBg: Record<string, string> = {
  calcaire: "bg-calcaire",
  sable: "bg-sable",
  encre: "bg-encre",
  pin: "bg-pin",
  soleil: "bg-soleil",
  filet: "bg-filet",
  abysse: "bg-abysse",
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
        Littoral <em>— styleguide</em>
      </h1>
      <p className="mt-4 max-w-lg text-encre/60">
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
                <div className="bg-sable p-4">
                  <p className="text-sm text-encre">{c.name}</p>
                  <p className="mt-1 font-mono text-xs text-encre/50">
                    {c.hex} · --color-{c.token}
                  </p>
                  <p className="mt-1 text-xs text-encre/50">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </Bloc>

        <Bloc title="Échelle typographique">
          <div className="space-y-10">
            <div>
              <p className="mb-2 text-xs text-encre/40">
                display-xl — Bodoni Moda, clamp(3.2rem, 9vw, 6.8rem)
              </p>
              <p className="display-xl">Where the sea meets the forest</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-encre/40">
                display-l — Bodoni Moda, clamp(2.4rem, 5.5vw, 4.2rem)
              </p>
              <p className="display-l">La falaise, à l’heure dorée</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-encre/40">
                Spécimen italique — Bodoni Moda Italic
              </p>
              <p className="display-l">
                <em>Entre le dernier pin et la première vague</em>
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-encre/40">eyebrow — 13px, 0.3em</p>
              <Eyebrow>Villa · Côte sauvage</Eyebrow>
            </div>
            <div>
              <p className="mb-2 text-xs text-encre/40">
                Corps — Instrument Sans 16–17px, interligne 1.65
              </p>
              <p className="max-w-xl">
                Côté ouest, le verre encadre le large. Côté est, le chêne
                s&apos;ouvre sur la canopée. Entre les deux : un seuil, une
                maison, un silence. Les nuances de texte atténué passent par
                l&apos;opacité —{" "}
                <span className="text-encre/70">encre 70&nbsp;%</span>,{" "}
                <span className="text-encre/50">encre 50&nbsp;%</span>.
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
          <p className="mt-4 text-xs text-encre/40">
            Pill 999px · transition 0.35s cubic-bezier(.22,1,.36,1) · hover :
            pin plus profond + translateY(-1px) / filet + texte pin
          </p>
        </Bloc>

        <Bloc title="Reveal (fade + stagger)">
          <Reveal stagger={0.12} className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-[10px] border border-filet bg-sable p-6"
              >
                <p className="font-display text-2xl text-pin">0{n}</p>
                <p className="mt-2 text-sm text-encre/70">
                  Révélé au scroll — fade + translateY(24px), expo.out, 1s.
                </p>
              </div>
            ))}
          </Reveal>
        </Bloc>

        <Bloc title="Reveal (variante mask)">
          <Reveal variant="mask">
            <p className="display-l max-w-2xl">
              La lumière dorée se pose, ligne après ligne.
            </p>
          </Reveal>
        </Bloc>

        <Bloc title="RockStrata">
          <div className="overflow-hidden rounded-[10px] border border-filet bg-calcaire">
            <RockStrata className="block h-28 w-full" />
          </div>
        </Bloc>
      </div>
    </main>
  );
}
