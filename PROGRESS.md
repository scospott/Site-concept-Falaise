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
