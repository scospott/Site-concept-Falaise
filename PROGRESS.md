# TIDELINE — Journal de bord du run maître

Run autonome démarré le 2026-07-03. Chantiers 1 → 8 exécutés dans l'ordre.

## Environnement constaté au démarrage
- Node 20.20.2, npm 10.8.2, git 2.43.0. **`gh` CLI indisponible** → pas de
  remote GitHub créé, tous les commits sont locaux (voir « AU RÉVEIL »).
- **MCP Context7 et Playwright non connectés à la session.** Fallbacks
  utilisés : docs officielles (docs Next.js 16.2 embarquées dans
  `node_modules/next/dist/docs/`, next-intl.dev, gsap.com, lenis) lues AVANT
  d'écrire le code ; audits visuels via le package npm `playwright`
  (`scripts/audit.mjs`, screenshots 1440px + 390px dans `audits/chantier-N/`).
- create-next-app a installé **Next.js 16.2.10** (pas 15) : params async
  obligatoires, `src/proxy.ts` au lieu de middleware, Turbopack par défaut,
  `priority` déprécié sur next/image (→ `preload`/`fetchPriority`),
  `next build` n'affiche plus les tailles de bundle.

---

## CHANTIER 1 — Fondations + système DA Nocturne ✅ (2026-07-03)

**Statut : terminé.** `npx tsc --noEmit` OK, `npm run build` vert,
audit visuel Playwright fait (10 captures dans `audits/chantier-1/`).

### Livré
- Étape 0 : scaffold Next 16.2 + Tailwind v4, git init, user.email configuré.
- Étape 1 : next-intl v4 — `routing.ts` (fr défaut sans préfixe, `/en`
  préfixé, `as-needed`), `proxy.ts`, `request.ts`, navigation typée,
  `generateStaticParams` + `dynamicParams = false`, messages fr/en.
- Étape 2 : fonts `Bodoni_Moda` (normal+italic, variable) + `Instrument_Sans`
  via next/font → `--font-display` / `--font-sans` dans `@theme inline` ;
  tokens couleurs (`nuit`, `sousbois`, `ecru`, `ecume`, `bois`, `filet`),
  utilities `display-xl` / `display-l` / `eyebrow`, ::selection écume/nuit,
  focus-visible écume.
- Étape 3 : `SmoothScroll` (Lenis 1.3 autoRaf:false + ticker GSAP,
  lagSmoothing(0), rien en reduced-motion), instance partagée `lib/lenis.ts`,
  `<Reveal>` (fade/mask, delay, stagger, gsap.matchMedia, once).
- Étape 4 : `Button` (primary/ghost pill), `Eyebrow`, `SectionTitle`,
  `ForestLine` (crête de conifères générée par script déterministe,
  `scripts/` + preview validée à l'œil), `Nav` (transparente → nuit+filet
  après 40px, overlay mobile 100 % opaque animé en transform, stagger CSS,
  verrou scroll via lenis.stop), `Footer` (ForestLine, filets, 3 colonnes,
  mention ScottLab → scottlab.app).
- Étape 5 : hero accueil placeholder (gradient nuit, H1 Bodoni avec
  « meets » en italique via t.rich, 2 CTA), hero court /reservation,
  metadata par locale (template « %s — Tideline »), og.jpg + favicon.png
  générés par `scripts/generate-placeholder-assets.mjs` (sharp).
- Étape 6 : `/styleguide` (noindex) — palette + hex, échelle typo, italique,
  boutons, démos Reveal, ForestLine.
- Étape 7 : audit visuel complet + correctifs.

### Décisions prises (mode autonome)
- `localeDetection: false` dans le routing next-intl : `/` est TOUJOURS fr,
  `/en` toujours en. Motif : déterminisme (audits, CDN, SEO) — détecté après
  qu'un cookie NEXT_LOCALE=en a fait basculer `/reservation` en anglais
  pendant l'audit.
- `metadataBase: https://tideline.scottlab.app` (URL plausible du déploiement,
  à ajuster au besoin).
- Palette étendue d'aucun token : les couleurs ponctuelles hors DA
  (dégradés placeholder) restent en valeurs arbitraires Tailwind.
- Le titre H1 est identique dans les deux locales (marque en anglais),
  seule la baseline est traduite.

### Problèmes rencontrés → résolution
- Types `PageProps`/`LayoutProps` générés par Next : obsolètes après
  suppression des routes du scaffold → `npx next typegen` après chaque
  changement d'arborescence de routes.
- Screenshot fullPage ≠ scroll réel : les `<Reveal>` restaient invisibles
  sur les captures → le script d'audit fait un balayage de scroll avant
  chaque capture pleine page.
- `pkill -f "next start"` se tuait lui-même (pattern dans sa propre ligne de
  commande) → serveur démarré/arrêté via tâches de fond dédiées.

### Dette restante
- Aucune sur ce chantier. Les sections commentées de l'accueil arrivent aux
  chantiers 3-5, le vrai contenu de /reservation au chantier 6.

---

## CHANTIER 2 — ScrollHero scroll-scrubbed (2 slots) ✅ (2026-07-03)

**Statut : terminé.** tsc OK, build vert, audit Playwright
(`audits/chantier-2/` : initial / mi-scrub / sortie de pin × desktop/mobile
× 2 pages) + vérification console (une seule 404 attendue : le probe de
frame-0001, aucune boucle d'erreur).

### Livré
- `src/lib/heroes.ts` : manifest des 2 slots (framesPath, framePattern
  `frame-%04d.webp`, frameCount provisoire 240/168, fallbackSrc, scrubVh
  260/160) + helper `frameUrl`.
- `src/components/ScrollHero.tsx` : section pinnée h-svh, ScrollTrigger
  `pin + scrub:true + anticipatePin + invalidateOnRefresh`, canvas cover
  (ratio préservé, crop centré, DPR cap 2, redraw au resize), préchargement
  frame 0001 puis lots de 20 en tâche de fond, dessin de la frame chargée la
  plus proche (pas de trou noir), fade-out overlay + translateY(-24) sur les
  premiers 15 % du scrub piloté par onUpdate (pas de 2e ScrollTrigger sur la
  section pinnée), indicateur ligne écume pulsante (CSS keyframes) masqué dès
  2 % de scrub, fallback next/image plein écran si frame 0001 absente.
- Poster/LCP : le fallback est TOUJOURS rendu sous le canvas
  (`loading="eager"` + `fetchPriority="high"` — `priority` est déprécié en
  Next 16) → zéro flash, LCP garanti dans les deux modes.
- reduced-motion : ni pin ni scrub ni chargement de frames — fallback
  statique + overlay fixe, indicateur caché.
- Fallbacks générés (`scripts/generate-hero-fallbacks.mjs`, sharp 1920×1080) :
  aplats #0D1511→#16241D + halo discret + ForestLine.
- Intégration : accueil (même overlay qu'au chantier 1) et /reservation
  (« Vos nuits sur la lisière » / « Your nights on the tideline »).

### Décisions
- La détection frames/fallback se fait par UN probe JS de la frame 0001 :
  une unique 404 en console tant que les frames n'existent pas — c'est le
  mécanisme prévu par le cahier des charges (« si la frame 0001 renvoie
  404 »), impossible à détecter sans requête.
- frameCount provisoires (240 home / 168 reservation) alignés sur la
  recommandation shot-list (150-240) — à remplacer par les valeurs exactes.

### Dette
- Quand les vraies frames seront là : penser à remplacer aussi
  `fallbackSrc` par une vraie frame fixe (poster plus fidèle), en plus de
  `frameCount`.

---

## AU RÉVEIL (mis à jour au fil des chantiers)
- **Remote GitHub** : `gh` indisponible pendant le run → créer le repo et
  pousser : `gh repo create scospott/tideline --private --source=. --push`
  (depuis `tideline/`).
- **Clé API Anthropic** (à partir du chantier 5) : créer `tideline/.env.local`
  avec `ANTHROPIC_API_KEY=sk-ant-…` pour activer Maël.
- **Frames vidéo héros** (après génération Kling/Luma) : extraire les frames
  WebP (commandes dans `TIDELINE-chantiers-2-7.md`, section shot-list) puis
  renseigner `frameCount` dans `src/lib/heroes.ts` — seul changement de code
  nécessaire.
