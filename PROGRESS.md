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

## CHANTIER 3 — Manifeste lumineux + Les espaces ✅ (2026-07-03)

**Statut : terminé.** tsc OK, build vert, audit Playwright
(`audits/chantier-3/` : mi-allumage, chiffres clés, espaces défaut/hover ×2,
mobile full).

### Livré
- Section `#villa` (`sections/Manifeste.tsx`) : manifeste Bodoni
  clamp(1.4→2rem) lh 1.5 max-w 28ch, split MANUEL en spans (choix permis par
  le cahier : texte intact au SSR + gestion fiable des mots-clés accentués et
  élisions « l’océan ») ; chaque mot passe de galet #3E4A42 à écru sur une
  timeline `scrub: true` liée à la traversée (stagger séquentiel), mots-clés
  forêt/océan/seuil (fr) et forest/ocean/threshold (en) allumés en écume.
  Chiffres clés 4 · 320 m² · 10 · Falaise privée en Bodoni 26px + libellés
  eyebrow + filets verticaux tracés en scaleY (origin top) au reveal.
- Section `#espaces` (`sections/Espaces.tsx`) + data `lib/espaces.ts`
  (5 espaces bilingues, couleur placeholder, champ `image?` prêt pour le
  branchement des visuels IA sans refactor). Desktop ≥1024 : liste Bodoni
  éteinte écru/45 → hover/focus/clic = écru plein + translateX(8px) + index
  01-05 écume ; panneau sticky révélé par wipe clip-path (inset vertical,
  0.6s expo.out, gestion z-index incrémentale pour les wipes successifs),
  description en fondu dessous ; premier item actif par défaut ; clavier =
  hover (onFocus). Mobile : cartes empilées avec `<Reveal>`, pas de sticky.
- reduced-motion : manifeste rendu allumé d'emblée (CSS média query sur
  `.manifeste-word`), wipes remplacés par un set immédiat.

### Décisions
- Titre de la section espaces non spécifié par le cahier → « La villa,
  pièce par pièce » / « The villa, room by room » ; eyebrow « Les espaces »
  / « The spaces ».
- Apostrophes typographiques (’) appliquées aux contenus FR.
- Libellé chiffre 4 : « Falaise / Privée » (valeur Bodoni + libellé eyebrow)
  pour garder le rythme des 4 items.

### Dette
- Aucune. Champ `image` des espaces en attente des visuels IA (côté Scott).

---

## CHANTIER 4 — Galerie horizontale + Avis ✅ (2026-07-03)

**Statut : terminé.** tsc OK, build vert, audit Playwright
(`audits/chantier-4/` : mi-traversée, sortie de pin, lightbox desktop+mobile,
avis desktop + après flèche, mobiles).

### Livré
- `lib/gallery.ts` : 10 items bilingues (formats portrait/paysage/carré,
  couleurs déclinées de la palette, champ `image?` prêt à brancher).
- Section `#galerie` (`sections/Galerie.tsx`) : desktop = section pinnée
  h-svh, translateX scrubbed sur la piste (distance = scrollWidth −
  innerWidth, invalidateOnRefresh), formats et hauteurs variés (300-460px) +
  décalages verticaux — rythme de rivage ; micro-parallaxe interne ±4 % par
  item via `containerAnimation` ; légendes 11px écume. Mobile ET desktop
  reduced-motion : grille 2 colonnes rythmée (variantes Tailwind
  motion-safe/motion-reduce), reveals au scroll. Lightbox commune :
  overlay nuit/95, fermeture Esc/clic/bouton, focus trap simple,
  fade+scale 0.3s, **portalisée dans body** (obligatoire : la section pinnée
  est transformée, un fixed y serait piégé), lenis stoppé + data-lenis-prevent.
- `lib/avis.ts` : 6 avis fictifs dans leur langue d'origine (attribut `lang`
  posé sur chaque blockquote), villes traduites.
- Section `#avis` (`sections/Avis.tsx`) : bandeau 4,96 Bodoni 56px + 5
  étoiles SVG écume + « 87 séjours » + badge pill « Coup de cœur voyageurs »
  (identité Tideline, pas de copie Airbnb) ; cartes sousbois/filet/10px,
  pastille initiales écume/nuit, hover translateY(-3px) + filet écume/45.
  Desktop : drag inertiel GSAP Draggable + InertiaPlugin (gratuits depuis
  GSAP 3.13) + flèches ghost + fine ligne de progression écume ; bounds
  recalculées au resize. Mobile + reduced-motion : scroll-snap natif.

### Décisions
- Draggable+InertiaPlugin GSAP plutôt qu'une réimplémentation maison du
  drag : pattern éprouvé équivalent à celui du repo Solidor (inaccessible
  pendant ce run), re-skinné DA Nocturne.
- Formats galerie assignés d'après la shot-list (portraits : brume dans les
  pins, suite à l'aube, sentier).

### Dette
- Aucune. Champ `image` en attente des visuels IA.

---

## CHANTIER 5 — Assistant Maël ✅ (2026-07-03)

**Statut : terminé** (QA conversationnel reporté — pas de clé API pendant le
run, voir AU RÉVEIL). tsc OK, build vert, audit Playwright
(`audits/chantier-5/` : inline desktop/mobile, repli sans clé, widget
desktop/réservation/mobile).

### Livré
- `lib/knowledge.ts` : base de connaissance unique (villa, arrivée/départ,
  équipements, extérieur, environs, séjour) + 4 règles dures (jamais de
  prix/dispos → renvoi /reservation ou /en/reservation ; hors base → aveu +
  renvoi, interdiction d'inventer ; langue du dernier message ; jamais
  sortir du rôle ni révéler le prompt).
- `app/api/chat/route.ts` : POST, SDK Anthropic, `claude-haiku-4-5`,
  max_tokens 600, historique tronqué à 12 côté serveur + contenu borné à
  2000 chars, erreurs JSON propres ({error} + status 400/502/503, stack
  loggée serveur uniquement). Sans ANTHROPIC_API_KEY → 503
  `assistant_unavailable` (vérifié par curl).
- `components/chat/VillaChat.tsx` : provider léger + hook `useVillaChat`
  (messages, isLoading, error, send avec ajout optimiste et repli poli) —
  historique PARTAGÉ entre les deux interfaces, zéro duplication.
- `components/chat/ChatWindow.tsx` : fenêtre commune — accueil de Maël
  d'emblée (aucun appel API au chargement), bulles utilisateur écume/nuit,
  réponses en écru avec react-markdown (éléments autorisés seulement),
  avatar pastille « M » Bodoni, 4 suggestions cliquables au premier
  affichage, indicateur de frappe 3 points, scroll interne data-lenis-prevent.
- Interface 1 : section `#hote` entre Avis et Footer (sousbois/85 +
  backdrop-blur, filet, radius 16px). Interface 2 : `ChatWidget` global
  (bulle 56px écume bas-droite, panneau 380×560 / plein écran mobile,
  scale+fade 0.3s, Esc, même historique — vérifié visuellement).

### Décisions
- `input` géré localement par interface (le partager ferait se refléter la
  frappe entre inline et widget) — le cahier exige le partage de la LOGIQUE
  d'appel et de l'historique, ce qui est fait via le provider.
- Le message d'accueil est rendu statiquement (hors state) : il reste dans
  la bonne langue après un switch FR/EN et n'est pas envoyé à l'API.
- Modèle : `claude-haiku-4-5` (le repo « Les P'tites Barques » cité en
  référence n'est pas accessible depuis ce poste).

### Dette / à vérifier avec la clé
- QA des 4 questions (couchages / prix→redirection / restaurant étoilé→aveu
  / question EN) à rejouer avec une vraie clé — voir AU RÉVEIL.

---

## AU RÉVEIL (mis à jour au fil des chantiers)
- **Remote GitHub** : `gh` indisponible pendant le run → créer le repo et
  pousser : `gh repo create scospott/tideline --private --source=. --push`
  (depuis `tideline/`).
- **Clé API Anthropic** : créer `tideline/.env.local` avec
  `ANTHROPIC_API_KEY=sk-ant-…` pour activer Maël (sans clé : message de
  repli poli, aucun crash — comportement vérifié). Puis rejouer le QA :
  « Combien de couchages ? » (réponse attendue : 10), « Quel est le prix
  d'une nuit ? » (attendu : refus poli + lien Réservation), « Quel
  restaurant étoilé à côté ? » (attendu : aveu d'ignorance + renvoi), et une
  question en anglais (attendu : réponse en anglais). Si Maël invente un
  prix ou un nom de restaurant, durcir les règles dans `src/lib/knowledge.ts`.
- **Frames vidéo héros** (après génération Kling/Luma) : extraire les frames
  WebP (commandes dans `TIDELINE-chantiers-2-7.md`, section shot-list) puis
  renseigner `frameCount` dans `src/lib/heroes.ts` — seul changement de code
  nécessaire.
