# TIDELINE — Journal de bord du run maître

> 🔑 **2026-07-07 — SECRET TROUVÉ ET NETTOYÉ** : une vraie clé
> `sk-ant-api03-…` traînait dans `.env.example` (fichier NON tracké,
> ignoré par `.env*` — vérifié : la clé n'apparaît dans AUCUN commit de
> l'historique). Clé déplacée vers `.env.local` (gitignoré, chmod 600 —
> Maël est donc actif), template vidé, `!.env.example` ajouté au
> .gitignore pour que le template soit versionné. Aucune rotation de clé
> indispensable puisque jamais publiée, mais elle reste sur ce disque :
> à toi de juger.
> **NB pendant le run** : la clé est RÉAPPARUE une fois dans
> `.env.example` (sauvegarde IDE d'un vieux buffer ?) alors que le
> fichier était devenu tracké — re-neutralisée AVANT tout commit,
> vérifié ensuite avec la clé complète sur `git rev-list --all` :
> l'historique est propre. Si ton IDE a encore l'ancien buffer ouvert,
> ferme l'onglet sans sauvegarder.

> ⚠ **2026-07-07 — chantier « Littoral » terminé** (palette photos,
> footer-rocher, typo XXL — section dédiée plus bas). **Push impossible :
> toujours aucun remote configuré**, les 4 commits `littoral N` sont locaux.

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

## CHANTIER 6 — Réservation : calendrier + parcours 4 étapes ✅ (2026-07-03)

**Statut : terminé.** tsc OK, build vert, parcours joué de bout en bout au
Playwright (`audits/chantier-6/`) : haute saison min 3 nuits vérifié
(tooltip capturé), calcul exact contrôlé programmatiquement
(3 × 1 900 = 5 700 € + ménage 250 € + taxe 2,50 × 3 nuits × 3 adultes =
22,50 € → total 5 972,50 €), erreurs formulaire, confirmation TDL-2026-XXXX,
calendrier mobile 390px + carte récap repliable.

### Livré
- `lib/pricing.ts` : saisons (juin-sept 1 900 €/min 3 nuits/60 % ; oct-mai
  1 100 €/min 2 nuits/25 %), ménage 250 €, taxe 2,50 €/nuit/adulte,
  `isBooked(dateISO)` par hash de chaîne PUR et déterministe (zéro
  Math.random au render), fenêtre demain → +6 mois, `quote()`, formatage
  Intl.NumberFormat fr-FR / en-GB.
- `booking/Calendrier.tsx` (custom, aucune librairie) : 2 mois côte à côte
  desktop / 1 mobile, navigation bornée sur la fenêtre glissante, états
  complets (passé éteint, occupé galet barré diagonale non cliquable,
  disponible sousbois hover filet écume, début/fin écume/nuit, range
  écume/15 rempli en cascade avec délais), tooltip « Minimum X nuits »
  au hover ET au clic invalide, sélection début→fin avec re-clic pour
  recommencer, tarif de la saison affichée + légende.
- `booking/Parcours.tsx` : barre de progression 4 segments (retour possible
  par clic sur les étapes passées, sans perte de données), étapes Dates /
  Voyageurs (steppers 1-10 adultes, 0-8 enfants, total ≤ 10, mention lit
  bébé) / Récapitulatif (lignes + total Bodoni 32px) / Coordonnées
  (validation client, erreurs en bois #8C7355 — pas de rouge criard).
  Desktop : carte récap sticky à droite dès l'étape 1, mise à jour continue,
  ring écume à l'étape 3. Mobile : carte repliable fixée en bas (total
  toujours visible, dégagée de la bulle Maël). Envoi simulé 1 200 ms →
  confirmation avec coche SVG qui se dessine (stroke-dashoffset), numéro
  TDL-2026-XXXX dérivé du timestamp, récap, « sous 24 h », mention démo
  encadrée. AUCUN appel réseau réel.
- Piège hydration neutralisé : le parcours se rend après mount (skeleton
  avant), les bornes de dates dépendant du jour réel.

### Décisions
- Une plage qui traverse une nuit occupée redémarre la sélection sur le
  jour cliqué (UX calendrier standard) ; le minimum de nuits affiche le
  tooltip sans rien sélectionner.
- Adultes par défaut : 2. Transitions d'étape par remontage animé
  (fade + translateY 0.45s) — pas de display:none pendant l'animation.

### Dette
- Aucune.

---

## CHANTIER 7 — Polish i18n + SEO + perf + transitions ✅ (2026-07-03)

**Statut : terminé.** tsc OK, build vert, QA finale
(`audits/chantier-7/` : 8 captures pleine page 2 pages × 2 locales ×
desktop/390 + nav mobile ouverte + widget ouvert + 404).

### i18n
- Audit console automatisé (`scripts/console-audit.mjs`) sur /, /en,
  /reservation, /en/reservation, /styleguide et une 404 : ZÉRO erreur, zéro
  « missing message ». Le switch FR·EN conserve la page courante (usePathname
  i18n + Link locale).

### SEO
- `app/sitemap.ts` : 4 URLs avec alternates hreflang xhtml:link (vérifié) ;
  `app/robots.ts` : /styleguide, /en/styleguide et /api exclus + sitemap.
- Canonical + hreflang (fr/en/x-default) par page via Metadata API —
  vérifiés dans le head rendu. metadataBase déjà en place.
- og:image DÉFINITIVE 1200×630 rendue avec la **vraie Bodoni Moda**
  (TTF Google Fonts + FONTCONFIG_FILE pour sharp/librsvg —
  `scripts/generate-final-assets.mjs`) ; favicon monogramme T Bodoni
  96px + apple-icon 180px, branchés via metadata.icons (aucun fichier
  convention dans app/).
- JSON-LD `LodgingBusiness` minimal marqué fictif (description « site
  concept »), sans adresse ni téléphone.

### Performance
- LCP : fallback hero rendu en `loading="eager"` + `fetchPriority="high"`
  (`priority` est déprécié en Next 16) ; fonts en display swap.
- Cleanup vérifié : tous les listeners scroll/resize retirés au démontage,
  ScrollTriggers révoqués par useGSAP/matchMedia.
- Bundles mesurés sur le réseau (`scripts/bundle-audit.mjs`, non gzip) :
  « / » ≈ 937 kB, « /reservation » ≈ 822 kB (≈ 300/260 kB gzip), dont
  framework Next+React ≈ 446 kB. Hors framework ≈ 490/376 kB bruts —
  au-dessus du seuil indicatif de 200 kB à cause de GSAP
  (+Draggable/Inertia) et next-intl : assumé pour un site d'animation ;
  react-markdown + fenêtre de chat passés en dynamic import (‑112 kB sur
  /reservation, chargement à l'ouverture du widget). `three` absent du JS
  initial (vérifié — précondition chantier 8).

### Finitions
- Transition de page : voile #0D1511 qui balaie + contenu entrant en
  fade/translateY(16px) 0.5s (usePathname AVEC préfixe : le switch de
  langue anime aussi), désactivée en reduced-motion, `clearProps` pour ne
  pas laisser de transform sur main (piège position:fixed des pins).
- 404 stylée : `[locale]/not-found.tsx` + catch-all `[...rest]` —
  « Vous avez quitté le sentier » / « You've wandered off the path »,
  status HTTP 404 vérifié. (La convention `global-not-found` de Next 16
  reste expérimentale — non utilisée.)
- CSS lightbox ajouté (fade+scale 0.3s — les classes existaient sans
  keyframes, oubli du chantier 4 corrigé).
- Passe reduced-motion revalidée : manifeste allumé d'emblée, galerie en
  grille, avis en scroll-snap, heros statiques, étapes sans animation.

### Décisions
- Domaine canonique : https://tideline.scottlab.app (métadonnées + sitemap
  + JSON-LD) — à ajuster si le déploiement diffère.

---

## CHANTIER 8 — Couche signature « Lumière dans la nuit » ✅ (2026-07-03)

**Statut : terminé, les 5 effets actifs.** Un commit par effet, audit visuel
après chacun (`audits/chantier-8/`), vidéo de scroll complet
`scroll-accueil-desktop.webm` (~12 s, 1440p), tsc OK, build vert.
Docs consultées AVANT d'écrire (fallback Context7) : R3F v9 (canvas/hooks/
scaling-performance), drei shaderMaterial (+ source), three r185.
Versions : three 0.185.1, @react-three/fiber 9.6.1, drei 10.7.7.

### Effets livrés (flags dans `src/lib/effects.ts`, tous débrayables)
1. **Titre-condensation** (`effects/HeroTitleReveal.tsx`, GSAP seul) :
   lignes du H1 depuis blur(14px)/alpha 0/letter-spacing +0.04em → net,
   stagger 120 ms, 1.6 s expo.out, une fois au load ; eyebrow/baseline/CTA
   en fade simple. Blur = exception unique assumée. Message du titre
   restructuré en balises `<l>` (2 lignes).
2. **Curseur-lanterne + spotlight** (`effects/CursorLantern.tsx` + CSS,
   zéro WebGL) : pointer fine uniquement, curseur natif conservé ; disque
   écume 8px + halo 240px (opacité 0.1) en lerp 0.12 rAF ;
   `[data-cursor="link"]` → disque 40px filet (boutons, logo) ;
   items galerie → pastille « Voir »/« View » Bodoni. Spotlight :
   images/aplats assombris brightness(0.72), copie claire masquée
   radial-gradient 240px suivant --mx/--my lissées, survol 400 ms → version
   claire entière ; galerie + panneau espaces, PAS la lightbox ; tactile =
   images claires. Piège corrigé : mon CSS non-layered `display:block`
   écrasait le `flex` Tailwind des copies (libellé décentré) → `display:flex`.
3. **NightLayer** (`effects/NightLayer(-Canvas).tsx`, R3F — pièce
   maîtresse) : Canvas transparent absolute z-[5] entre le canvas de frames
   et l'overlay texte des DEUX heros (insertion de markup seule dans
   ScrollHero — mécanique pin/scrub intouchée). Brume : plane clip-space,
   fbm 4 octaves, 2 couches à vitesses différentes, alpha max 0.3 (0.2
   mobile), teinte écru + 7 % écume, uMouse lerp 0.025 (la brume s'écarte à
   peine), uScrollVel branché sur la vélocité Lenis. Lucioles : Points 120
   desktop / 50 mobile, positions déterministes concentrées dans le tiers
   bas, scintillement sin, tailles 1-3px, blending additif. Budget tenu :
   dpr [1,1.5], antialias false, pas de post-processing, frameloop 'never'
   hors viewport (IntersectionObserver), montage +300 ms après first paint
   + fade-in 0.8s, dynamic import ssr:false.
4. **Océan nocturne** (`effects/Ocean*.tsx`) : bande 180px au pied du
   footer — sinus superposés + bruit compressés en perspective, chemin de
   lune central en glints écume seuillés. DPR 1 mobile, pause hors
   viewport. Le footer est la lisière complète (forêt en tête, océan en pied).
5. **Nappes de brume** (upgrade `PageTransition`) : deux nappes #0D1511 puis
   #16241D/60 se retirent avec 60 ms de décalage, contenu entrant
   fade+translateY(16px), 0.6 s ; flag coupé → retour au voile simple.

### Vérifications
- `three` ABSENT du First Load JS — vérifié par signature
  (WebGLRenderer/REVISION) dans le CONTENU des 12 scripts du HTML initial
  (les noms de chunks Turbopack sont hashés, le simple nom ne suffit pas) :
  First Load ≈ 898 kB brut (~ niveau pré-chantier-8), chunk R3F/three
  (~900 kB brut) chargé en lazy 300 ms après le paint.
- Console propre sur les 2 pages avec WebGL actif ; reduced-motion : les 5
  effets NON MONTÉS (retours anticipés avant création du Canvas).
- Correctif connexe : l'augmentation JSX de R3F rendait `never` le typage
  polymorphe de `<Reveal as>` → prop `as` restreint à une union d'éléments
  HTML + createElement.

### Barre de qualité (regard prospect)
- Brume : mouvement lent et organique, texte du hero parfaitement lisible,
  différence nette entre deux captures espacées de 1.8 s (elle vit).
- Aucun effet dégradé ou coupé : les 6 flags sont à `true`.

---

## FINALISATION — revue qualité « prospect » + correctifs ✅ (2026-07-03)

Passe Playwright finale complète (`audits/chantier-final/`), puis revue
multi-agents (3 relecteurs indépendants — desktop, mobile, code — chaque
finding contre-vérifié adversarialement par un agent dédié) : 18 findings
bruts → 7 réfutés (artefacts de capture fullPage type pin-spacer, choix
documentés) → 11 confirmés → 9 corrigés, 2 = travail en attente déjà
documenté (frames vidéo, visuels IA).

### Correctifs appliqués après revue
- Avis : mention discrète « Avis publiés dans leur langue d'origine » /
  « Reviews shown in their original language » sous le bandeau (le choix
  langue d'origine était invisible pour un prospect).
- Carrousel avis mobile : `scroll-pl-6` (la 1re carte snapait collée au
  bord au lieu de la gouttière de 24px).
- Galerie mobile : grille alignée → 2 vraies colonnes en maçonnerie
  (les ratios mixtes portrait/paysage créaient des trous), colonne droite
  décalée.
- Bulle Maël : z-index 61→45 (elle flottait AU-DESSUS de l'overlay de
  navigation mobile, contexte d'empilement du header plafonné à 50) ;
  sur /reservation mobile, remontée à bottom 76px pour ne plus intercepter
  les taps de la barre récap sticky.
- Légende calendrier : pastille « Disponible » lisérée écru/25 (contraste
  1.08:1 mesuré — invisible).
- CTA hero : pile verticale forcée sur mobile (`flex-col sm:flex-row`) —
  les libellés FR passaient en pile, pas les EN (incohérence entre locales).
- Sélecteur FR·EN : cible tactile étendue (p-2/-m-2) + tabIndex retiré dans
  l'overlay mobile fermé (lien focusable dans un conteneur aria-hidden).

### Console (état final)
- Zéro erreur. Deux familles de warnings SANS impact, non corrigeables ici :
  « THREE.Clock deprecated » (interne à @react-three/fiber 9.6.1 avec three
  r185 — à suivre côté upstream) et « GPU stall due to ReadPixels »
  (artefact du screenshot Playwright sur canvas WebGL, pas du site).

---

## PATCH — piscine à débordement ✅ (2026-07-03, post-run)

- `knowledge.ts` : « Piscine à débordement chauffée (mai-septembre),
  terrasse ouest face à l'océan » ajoutée aux équipements de Maël.
- `espaces.ts` : 6e espace « La piscine de l'horizon » / « The horizon
  pool » (placeholder #1E3A33) — la section, le wipe et l'index 06 suivent
  automatiquement (vérifié FR + EN au Playwright, `audits/patch-piscine.png`).
- messages/*.json : AUCUNE clé à ajouter — les textes des espaces vivent
  dans `espaces.ts` (bilingue) par conception (chantier 3) ; audit i18n
  re-passé : zéro clé manquante. Penser au visuel IA de la piscine
  (champ `image`) avec les autres.

---

## PATCH — frames vidéo réelles du hero home ✅ (2026-07-03, post-run)

- 162 frames constatées dans `public/frames/hero-home/` (0001→0162, aucun
  trou, 12 Mo), fallbacks `public/heroes/*.jpg` mis à jour par Scott —
  `home.jpg` quasi identique à la frame 0001 (diff 3,4/255 mesurée) : aucun
  flash poster→canvas possible.
- `heroes.ts` : `frameCount` home 240→**162**, `scrubVh` 260→**300**
  (traversée ~8 s dégustée). Chemins des deux slots vérifiés.
- **Bug d'affichage initial corrigé** (constaté par l'audit pixel : canvas
  transparent à 0 % de scrub) : le probe de la frame 0001 résolvait AVANT le
  montage du canvas conditionnel, son premier dessin partait dans le vide —
  ajout d'un dessin au montage du canvas (`useEffect` sur `mode`). La
  mécanique pin/scrub/chargement est INTACTE.
- Lisibilité sur footage clair : la séquence est golden hour (nettement plus
  claire que l'étalonnage nocturne) — à 0 % le titre écru se perdait dans le
  ciel. Ajout de deux voiles DANS l'overlay de la page (radial derrière le
  texte + dégradé en tête pour la nav), qui s'évanouissent avec l'overlay
  dès 15 % de scrub. Aucune retouche de ScrollHero pour ça.
- Audit `audits/hero-frames/` : 0/33/66/100 % × desktop/mobile — 8 positions
  vérifiées AU PIXEL (canvas couvrant, jamais noir) : cour → porte →
  galerie dorée → séjour ouvert sur l'océan (la piscine à débordement est
  visible en fin de traversée).

---

## PATCH — photos identifiées et branchées (galerie + espaces) ✅ (2026-07-04)

Identification VISUELLE des 11 PNG UUID de public/gallery/ + 5 keyframes de
bible/ (chaque image regardée une à une), optimisation JPEG q82 ≤2000px
(~30 Mo PNG → 3,9 Mo JPEG), sources UUID déplacées vers bible/ (gitignoré).

### Mapping retenu (image → slot)
ESPACES : bible/3.png → verriere.jpg (salon cathédrale, cheminée suspendue,
baie océan) · b8e7c8d5 → bain-nordique.jpg (bain bois fumant sous les pins)
· 1896d19d → suite-falaise.jpg (lit lin face baie couchant) · abf86f57 →
cuisine.jpg (îlot pierre, table pour dix) · 0fe29842 → sentier.jpg (marches
dans la roche vers la crique) · bible/4.png → piscine.jpg (infinity pool
dorée).
GALERIE : bible/2.png → 01-seuil (porte ouverte contre-jour) · a8fbe905 →
02-terrasse (loungers face couchant) · b6804183 → 03-matiere (macro
calcaire/chêne/laiton, carré) · 33d7b7ff → 04-bain (portrait) · 5ce1dae1 →
05-feu (portrait) · b1837c27 → 06-table · 78693f3a → 08-crique ·
063c17c7 → 09-villa-mer.

### Photos manquantes (placeholders conservés)
- **07-pins** (sous-bois de pins doré) et **10-mer** (surface de mer aux
  reflets dorés) : aucune source correcte — les mp4 de bible/ (s1/s2,
  échantillonnés) ne montrent que la traversée cour→séjour. À générer.

### Heroes & og
- `heroes/reservation.jpg` : VÉRIFIÉ à l'œil — c'est bien la piscine/océan
  golden hour (l'échec ffmpeg évoqué avait déjà été réparé, fichier daté du
  même lot que home.jpg). `heroes/home.jpg` : vérifié = cour k0. Aucune
  régénération nécessaire.
- `og.jpg` : régénérée depuis la keyframe cour (bible/k0-cour.png) recadrée
  1200×630 (fit cover). Branchement Metadata API inchangé (chemin /og.jpg).
- Config heroes revérifiée : frameCount 162 = frames réelles, scrubVh 300,
  fallbacks corrects.

### Réalignement golden hour
- `villa.title` : « La lisière, à l'heure dorée » / « The tideline, at
  golden hour ».
- 3 descriptions espaces réalignées (bain nordique « le soir qui descend »,
  suite falaise « la lumière du soir sur le lin », cuisine « chêne clair »)
  + EN adaptées. Parité de clés fr/en vérifiée (script, zéro écart).
- QA `audits/galerie/` : hero 0/33/66/100 % desktop+mobile, espaces
  (verrière/cuisine/piscine survolés), galerie mi-traversée, lightbox,
  mobiles — la bascule placeholder → next/image (avec spotlight) constatée
  sur chaque slot branché.

---

## REFONTE SOLAIRE — du nocturne au méditerranéen ✅ (2026-07-04/05)

**Aucun remote git : commits locaux uniquement (gh absent).**
6 commits internes (tokens → nav/footer/boutons → sections → effets →
textes → QA), architecture et mécaniques INTOUCHÉES. Palette étalonnée sur
les images de bible/ (regardées avant de commencer).

### Tokens
calcaire #F7F3EA (fond) · sable #EFE7D7 (surfaces) · encre #26332B (texte)
· pin #3E5C42 (accent) · soleil #C9903F (accent rare) · filet #DCD3BE ·
abysse #1B2A21 (footer). Tokens de service ajoutés (décision autonome,
mêmes familles) : **creme** #F7F3EA (texte sur vidéo/pin/abysse), **blanc**
#FCFAF4 (cartes avis, jours dispo, récap), **pierre** #E3DAC5 (occupés,
aplats en attente). Migration par sed préfixé + grep résiduel = 0 ;
contrastes AA : encre sur calcaire 12,6:1, sur sable 11,4:1, creme sur pin
6,0:1, sur abysse 13,4:1.

### Décisions notables
- Nav : état « sur hero » limité aux pages à hero (/, /reservation) — sur
  styleguide/404 la nav est TOUJOURS solide (crème sur calcaire serait
  invisible). Menu mobile ouvert = fond opaque SANS backdrop-blur : le
  blur du header en faisait le containing block du panneau fixed inset-0
  (bug constaté en QA, corrigé, re-capturé).
- Hero : ForestLine du bas RETIRÉE des deux heros (elle recouvrait la
  vidéo) ; titres/baseline/nav en crème + text-shadow doux ; les deux
  voiles de lisibilité de l'overlay conservés ; boutons inversés via prop
  `inverse` du Button (ajout de peau, pas de mécanique).
- Manifeste inversé : pierre claire #CBC3AE → encre, mots-clés pin.
- Océan du footer re-shadé « mer au couchant » : teal profond + glints
  dorés (couleurs du fragment shader uniquement).
- NightLayer → couche solaire : enableMist=false (flag, code brume intact),
  particules = poussières dorées #E8C685 (drift ascendant bouclé, twinkle
  discret, 100/40, alpha doux) — le blending additif reste lisible sur la
  vidéo dorée (vérifié en capture).
- Spotlight « rayon de soleil » : repos brightness(0.9), halo suiveur
  brightness(1.08) saturate(1.05), curseur halo doré + pastille Voir
  crème/pin. Nappes de transition en calcaire/sable.
- « La cuisine de nuit » / « The night kitchen » et le vocabulaire de
  réservation (« nuits ») sont éditoriaux → conservés. Seuls résidus
  corrigés : spécimens de la styleguide.
- Aplats en attente (07-pins, 10-mer) re-teintés pierre claire.

### QA (audits/solaire/, 21 captures regardées)
Pages complètes FR/EN × desktop/390, hero 0/50/100 %, espaces ×3, galerie
(bande sable), lightbox (voile calcaire/97), widget Maël, calendrier avec
sélection pin, étape 3 (récap blanc mis en lumière), nav mobile (avant ET
après correctif, y compris ouverte depuis l'état scrollé), footer abysse +
océan doré. tsc + build verts à chaque commit.

---

## CHANTIER LITTORAL — palette photos, footer-rocher, typo XXL ✅ (2026-07-07)

**4 commits (`littoral 1: palette` → `littoral 4: qa`), tsc + build verts à
chaque étape, aucun remote → commits locaux.** Aucune mécanique touchée
(scrub, wipe, galerie, lightbox, carousel, calendrier, stepper, hook Maël),
aucun contenu, aucune image, aucune font. Images de bible/ regardées avant
de commencer (référence chromatique).

### 1. Palette « Littoral » (tokens re-valués, zéro renommage)
- calcaire #EFE6D2 · sable #E6D7B8 · encre #2C3024 · pin #3C5638 (hover CTA
  #2E4429) · soleil #C08A45 · filet #D9CBA8 · abysse #3A362C (granit).
- Tokens de service ajustés en cohérence (décision autonome) : creme
  #F5EEDC, blanc #FAF3E2 (cartes avis/récap/jours dispo), pierre #DFD1B0.
  Cartes avis + récaps : filet spécifique #E2D4B4. Manifeste : départ
  #C6B58C → encre/pin (valeurs GSAP mises à jour). Aplats placeholder
  re-teintés famille Littoral (mer #1E3A31, pin sombre #2E4429, granit
  #3A362C, encre #2C3024, bois doré #8A6B3F, pierres claires
  #E2D4B4/#DFD1B0). Voiles de lisibilité du hero re-dérivés (rgba 20,22,15).
- Contrastes mesurés : encre/calcaire 10,9:1, encre/sable 9,5:1,
  pin/calcaire 6,6:1, pin/sable 5,7:1, creme/pin 7,0:1, creme/abysse
  10,4:1. **soleil/calcaire 2,4:1 → le miel ne porte JAMAIS de texte
  courant** (labels uppercase courts, index, étoiles, décor uniquement).
- Grep final : plus aucune valeur de l'ancienne palette Solaire dans src/.
- Lightbox : `bg-calcaire/97` = voile pierre/97 demandé (aucun changement
  de code nécessaire). Poussières dorées inchangées (#E8C685).

### 2. Footer-rocher + mer dorée
- Nouveau `RockStrata` (SVG, preserveAspectRatio none, props back/front,
  flip) : strate horizontale anguleuse — méplats inclinés, décrochés
  verticaux, zéro pointe de sapin — 2 couches #55503F (arrière) / #3A362C
  (avant). **Silhouette validée à l'œil en preview avant branchement**
  (1er jet trop régulier « créneaux » → méplats irrégularisés, couches
  désynchronisées).
- Remplace ForestLine partout : footer, 404 (tons sable #E0D2AF/#D9CBA8),
  styleguide (bloc démo). **ForestLine supprimée du projet.**
- Footer granit : liens creme/80, légal creme/45, labels colonnes miel,
  filet interne #4A4536, 3 fissures SVG #46412F 1px (quasi subliminales,
  vectorEffect non-scaling) posées en absolu dans le fond.
- Océan « mer au couchant » : eau #1E3A31, ondulations #27473C, glints
  DORÉS #DCA65E. Chemin du soleil décalé central-droit (uv.x 0.62) ;
  1re passe trop uniforme (constat capture) → seuil de glints abaissé DANS
  le chemin (0.80 − 0.10·sun) + densité résiduelle 0.06 ailleurs.
  Mécanique du shader intouchée (couleurs/masque du fragment uniquement).
- Bulle Maël vérifiée sur granit (footer/mer) ET sur pierre : pin + icône
  crème + ombre portée, lisible partout.

### 3. Typo XXL + respiration
- display-xl `clamp(3.2rem,9vw,6.8rem)` lh 1.02 ; display-l
  `clamp(2.4rem,5.5vw,4.2rem)` lh 1.1 ; items espaces
  `clamp(2rem,3.6vw,3.1rem)` ; manifeste `clamp(1.6rem,2.8vw,2.4rem)` ;
  stats +20 % (chiffres clés 26→31px, note avis 56→67px).
  `text-wrap: balance` intégré aux utilities display.
- Sections : py-36 (9rem) mobile / md:py-48 (12rem) desktop. NOTE
  interprétation : la consigne « +45 % → desktop 10-12rem, mobile ~6rem »
  était contradictoire avec l'existant (py-28/py-40 = 7/10rem par côté) —
  retenu : 12rem/côté desktop (= joints simples à 12rem, haut de la
  fourchette demandée), 9rem/côté mobile (l'absolu « 6rem » aurait RÉDUIT
  l'espacement, contraire à l'esprit). Plus d'air eyebrow/titre/contenu
  (mt-6/mt-16), hero aéré (mt-8/mt-12), piste galerie pinnée intouchée.
- **Titre hero /reservation : clamp réduit spécifique**
  `clamp(2.7rem,8.5vw,6.8rem)` (classes explicites, plus de display-xl) —
  à 390/360px la fin de « sur la lisière » passait sous la bulle Maël
  (bottom 76px sur cette page). Règle appliquée : la borne de CE titre,
  pas l'échelle globale.
- Contrôles : zéro scroll horizontal à 1440/390/360 (mesuré au JS), H1
  lisible sur la vidéo (text-shadow conservé), indicateur de scroll
  dégagé, fade-out du titre au scrub intact (hero-0/50/100 vérifiés).

### 4. QA (audits/littoral/)
- 21 captures, TOUTES regardées : pages FR/EN × desktop/390 pleine page,
  hero 0/50/100 %, espaces ×3 survols, galerie en traversée, lightbox,
  Maël ouvert, calendrier avec sélection (récap 5 965 € exact), étape 3,
  nav mobile ouverte, footer complet (strate + granit + mer) + zones
  mobiles en viewport réel (galerie 2 colonnes, avis, footer).
- Seul défaut trouvé → corrigé (titre resa vs bulle, ci-dessus), audit
  re-généré après correctif.
- Console : zéro erreur sur les 6 routes ; seuls les 2 warnings connus
  (THREE.Clock interne R3F, GPU stall ReadPixels = artefact screenshot).
- Artefact connu inchangé : les captures fullPage dédoublent le hero
  pinné (stitching pin-spacer) — déjà réfuté aux QA précédentes.
- Styleguide : hex/usages mis à jour, spécimens re-titrés « Littoral »,
  bloc RockStrata à la place de ForestLine.

---

## CHANTIER LISIBILITÉ + AVIS + RÉSERVATION ✅ (2026-07-07)

**5 commits (hygiène secrets → lisibilité → galerie → avis → réservation
→ qa), tsc + build verts à chaque étape, toujours aucun remote.**
Mécaniques intouchées (scrub, wipe, traversée, lightbox, logique
calendrier/stepper, hook Maël).

### 0. Hygiène secrets
Voir la note 🔑 en tête de fichier. `.env.example` (vide) désormais
versionné, vraie clé dans `.env.local` uniquement.

### 1. Lisibilité — plancher typo relevé
- Plancher : rien d'informatif sous 14px ; 11-13px réservé au décoratif
  pur + tailles 13px explicitement prévues (eyebrows, labels de stats,
  colonnes/légal footer, mentions démo).
- Corps 17px desktop / 16px mobile (media query sur body), lh 1.65.
  Nav : logo 26px, liens 16px, switch 14px. Footer : liens 15px, légal
  13px. Descriptions espaces 17px, légendes galerie 14px, chat 15px,
  boutons 15px (px-8 py-3.5).
- Contraste : l'informatif passe à encre/75 minimum — mesuré 5,3:1 sur
  pierre, 4,9:1 sur sable (AA) ; le /60 (3,6:1) reste décoratif. Liste
  des espaces : items éteints encre/40 → encre/75 (l'état actif garde
  translate + index miel).
- Contrôle : zéro scroll horizontal à 390 et 360px (mesuré au JS).

### 2. Galerie — vraies photos uniquement
- gallery.ts : les 2 slots sans visuel retirés (ex-07-pins, ex-10-mer).
  8 items, tous avec fichier vérifié sur disque ; FIG renumérotées par
  l'index. Traversée vérifiée : translateX final = scrollWidth −
  innerWidth exact (pas de trou en fin de piste).
- Espaces : 6/6 images présentes — rien à signaler. Verrière (LCP
  signalée par Next) : loading eager + fetchPriority high.

### 3. Avis — pattern Airbnb re-skinné Tideline
- En-tête « Coup de cœur » : badge pill, 4,96 Bodoni 64/72px entre deux
  branches de laurier SVG maison (trait miel 1.4, feuilles alternées,
  silhouette validée à l'œil en preview), « L'un des logements préférés
  des voyageurs » 16px encre/75, ligne 87 séjours + langue d'origine.
- Sous-notes par catégorie (`categoriesAvis` dans avis.ts) : 6 colonnes
  à filets verticaux desktop / 2 mobile, barres piste filet / rempli pin.
- Grille d'avis 2 col / 1 col, cartes SANS bordure (séparées par
  l'espace), pastille pin 44px, nom 16px médium, ville · date 14px
  encre/60 (choix explicite du cahier), dates fictives fév→juin 2026.
- Carousel supprimé : Draggable/InertiaPlugin ne sont plus importés par
  Avis (le bundle GSAP les garde pour rien ? NON — ils restent utilisés
  nulle part ailleurs : voir AU RÉVEIL si tu veux purger la dépendance).
- Clés i18n : + avis.loved, − avis.prev/next ; audit i18n zéro manquante.

### 4. Réservation — design relevé (logique intouchée)
- Desktop 2 colonnes : parcours / carte 380px sticky style plateforme
  (blanc chaud #FAF3E2, filet #E2D4B4, radius 16px) : tarif de la saison
  en Bodoni 28px + « / nuit » 15px (suit les dates sélectionnées),
  champs encadrés cliquables Arrivée→Départ et Voyageurs (renvoient à
  l'étape — uniquement vers les étapes déjà atteintes), détail à filets
  fins, Total 20px médium, CTA pleine largeur, mention démo 13px.
- Le « Continuer » du bas d'étape a été SUPPRIMÉ : le CTA vit dans la
  carte (desktop) et dans la barre basse (mobile) ; seul « Retour »
  reste sous le contenu d'étape.
- Mobile : barre basse blanc chaud (total 20px + CTA pin visibles,
  détail au tap) ; bulle Maël remontée 76→92px sur cette page.
- Stepper : labels 15px, actif pin (segment 3px vs 2px), étapes faites
  cochées ✓ pin, retour au clic conservé.
- Calendrier : cases ≥44px (min-h-11), chiffres 16px, mois Bodoni 22px,
  jours de semaine 14px, disponibles blanc chaud + hover pin/10,
  occupés adoucis (pierre 55 % + barré fin encre 18 %), sélection
  pin/crème, range pin/12 (inchangé), tarif 15px + légende 14px.
- Voyageurs : +/− ronds 44px filet (hover pin), compteur 18px médium,
  labels 16px, sous-labels 14px. Erreurs de formulaire en bois #8A6B3F
  14px (le soleil sur blanc était à 2,4:1).
- i18n : + booking.summary.perNight / demoNote.

### 5. QA (audits/lisibilite/, 17 captures regardées)
- Accueil FR pleine page desktop+390, galerie en traversée (aucun
  aplat), avis desktop+mobile (en-tête + grille), parcours COMPLET
  desktop+390 (étape 1 avec sélection + carte, voyageurs, étape 3,
  coordonnées remplies, confirmation).
- Scan programmatique de TOUT texte < 14px sur chaque page/état
  (treewalker sur les nœuds visibles) : après correctif (précision de
  taxe 13→14px), ne restent que les 13px explicitement prévus par le
  cahier. Le scan vit dans scripts/audit-lisibilite.mjs — réutilisable.
- Console : zéro erreur, zéro clé i18n manquante sur les 6 routes.
- Artefact connu : fullPage + section pinnée = hero dédoublé sur les
  captures (pin-spacer, déjà réfuté aux QA précédentes).

---

## CHANTIER LA FALAISE — renommage + footer v2 + hero réservation ✅ (2026-07-07)

**4 commits (`falaise 1..4`), tsc + build verts, toujours aucun remote.**

### 1. Renommage « Tideline » → « La Falaise »
- Nom propre non traduit, partout : nav, footer, metadata (title,
  template « %s — La Falaise », siteName, og alt), JSON-LD, knowledge
  (Maël se présente comme l'hôte de La Falaise), FAL-2026, styleguide,
  README réécrit (c'était encore le template create-next-app).
- Tagline officielle « Là où la mer rencontre la forêt » / « Where the
  sea meets the forest » : baseline footer + metadata title.
- H1 hero FR dédié « Là où la mer *rencontre* la forêt » (les locales
  divergent désormais — l'EN garde « Where the sea *meets* the
  forest ») ; vérifié 1440/360, le clamp absorbe la ligne, mécanique
  titre-condensation intouchée.
- Lexical RELU (pas de sed aveugle) : lisière→falaise, tideline/
  treeline→cliff ; descriptions metadata reformulées (« au sommet de la
  falaise »/« clifftop », « crique privée »/« private cove ») pour
  éviter « falaise…falaise privée ». Manifeste inchangé (il ne
  contenait ni lisière ni tideline — « une ligne »).
- Domaine plausible passé à https://la-falaise.scottlab.app
  (metadataBase, sitemap, robots, JSON-LD) — à ajuster au déploiement.
- og.jpg régénéré : fond bible/k0-cour + « LA FALAISE » + tagline
  Bodoni italique, rendu par Chromium (plus de dépendance fontconfig —
  l'ancien script d'assets nocturne a été SUPPRIMÉ). favicon +
  apple-icon : monogramme « F » Bodoni #F3ECDB sur granit #37322A.
- Greps finaux (src, messages, public, README) : zéro Tideline/lisière/
  tideline/treeline. PROGRESS/audits gardent leurs mentions historiques.

### 2. Footer-falaise v2
- RockStrata : TROIS plans (#6E6349 lointain « pris dans la lumière »,
  #4C4534 moyen, #37322A proche fusionnant avec le fond), décrochés
  verticaux francs. Rim light du couchant sur les arêtes moyen/proche :
  gradient #D9A85E→#E9BC6C, opacité 0 (gauche) → 0.8 (droite), traits
  1.6-1.8px vectorEffect non-scaling. API : far/mid/near/rim (la 404
  passe 3 tons sable, rim off).
- Tokens : abysse #37322A, creme #F3ECDB (glissements ~1 % assumés
  partout où creme sert). Facette diagonale #3D372D côté droit du bloc,
  fissures #443E31, légal creme/50.
- Océan v2 (fragment seul, Canvas/uniforms/frameloop inchangés) :
  houle en PERSPECTIVE (rangées 14/(1.06−y) — fines près de l'horizon,
  larges en bas, dérive lente), cône du soleil ancré à x=0.78
  s'élargissant vers le bas (glints #E9BC6C, éclats #F5D9A2 au cœur,
  scintillement à phase individuelle, densité 0.06 hors cône), 2 patchs
  organiques #22423A/#1A342C. Les sinusoïdes parallèles ont disparu.
- Couche statique SVG au-dessus du canvas : ligne d'écume crème
  irrégulière au contact roche/eau + 2 écueils anguleux (#2B2620,
  flanc droit éclairé #4A4031, écume de base, reflet sombre) à gauche
  et centre-gauche — hors du cône. (1er jet « bouées » corrigé après
  capture : masses élargies et irrégularisées.)
- reduced-motion : le canvas se monte et se FIGE sur une frame propre.
  PIÈGE R3F découvert : avec frameloop="never", invalidate() est ignoré
  ET aucune frame initiale n'est rendue — il faut state.advance(0)
  (constaté en capture : écueils flottant sur du granit, sans eau).

### 3. Hero réservation
- 121 frames webp (12 Mo) déposées par Scott PENDANT le run dans
  public/frames/hero-reservation/ (embarquées au commit falaise 1) :
  vérifiées sans trou 0001→0121, frameCount 121, scrubVh 200.
- Fallback reservation.jpg ≈ frame 0001 (diff pixel 1,86/255) — aucun
  flash poster→canvas. Traversée vérifiée : océan → bassin → façade.

### 4. QA (audits/falaise/, 12 captures regardées)
- Heros FR/EN 0/50/100 (nouveaux titres, fade-out au scrub intact),
  hero réservation 0/50/100 (frames réelles), footer desktop+390
  (strates, rim light, écueils, cône), page FR 390 pleine page.
- reduced-motion contrôlé en plus (frame figée — voir piège advance).
- À 390 les écueils se compriment (preserveAspectRatio none) : plus
  abrupts, assumé — raccord avec « falaise ».
- Artefact fullPage pin-spacer inchangé (connu, réfuté).
- ⚠ La clé API est réapparue dans .env.example pendant CE run aussi
  (3e fois — buffer IDE). Re-neutralisée avant chaque commit, vérifiée
  par garde-fou à chaque `git add`. FERME L'ONGLET .env.example.

---

## AU RÉVEIL (mis à jour au fil des chantiers)
- **La Falaise — à valider à l'œil** : le rim light du couchant (assez
  subliminal ?), le cône du soleil en mouvement réel, les écueils à
  390px (compression assumée), et le titre FR au scrub sur machine
  réelle. Rejouer le QA Maël : il doit se présenter comme l'hôte de
  **La Falaise** (knowledge mis à jour, jamais re-testé avec la clé).
- **Domaine** : tout pointe sur https://la-falaise.scottlab.app —
  ajuster si le déploiement retient un autre nom (le REPO s'appelle
  toujours tideline/, non renommé par choix).
- **Lisibilité — à valider à l'œil** : le corps 17px et les nouveaux
  contrastes /75 sur écran réel ; la grille d'avis (respire-t-elle assez
  sans bordures ?) ; le calendrier adouci (les occupés se lisent-ils
  encore comme indisponibles ?).
- **GSAP Draggable/InertiaPlugin** : plus importés depuis la refonte du
  bloc avis (le carousel a disparu). Ils ne pèsent que s'ils sont
  importés — rien à faire, mais si un futur chantier veut du drag, ils
  sont toujours dans node_modules.
- **Clé API** : `.env.local` en place (chmod 600) → Maël actif. Rejouer
  le QA conversationnel des 4 questions (couchages / prix→redirection /
  restaurant étoilé→aveu / question EN) — non refait pendant ce run.
- **Littoral — à vérifier à l'œil sur machine réelle** : le chemin du
  soleil de l'océan du footer (scintillement en mouvement), les fissures
  du granit (doivent rester subliminales), la strate rocheuse en entrée
  de footer au scroll réel, et l'échelle XXL au trackpad (rythme magazine).
- **ForestLine n'existe plus** → `RockStrata` (props back/front/flip). Si
  un vieux script/preview y fait référence, c'est du legacy.
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
- **Frames vidéo héros** : ~~home~~ ✅ branché (162 frames, scrubVh 300).
  Reste le slot **reservation** : extraire vers
  `public/frames/hero-reservation/` puis renseigner `frameCount` exact
  (provisoire : 168) dans `src/lib/heroes.ts`. En attendant, son fallback
  `reservation.jpg` (mis à jour) s'affiche proprement.
  NOTE étalonnage : la séquence home est golden hour, plus chaude/claire que
  l'étalonnage « blue hour » de la shot-list — des voiles de lisibilité ont
  été ajoutés à l'overlay ; si tu régénères en nocturne un jour, ils
  pourront s'alléger (page.tsx, deux div aria-hidden dans le hero).
- **Visuels IA espaces + galerie** : ✅ branchés (14 slots sur 16). Il ne
  manque que **07-pins** (sous-bois doré) et **10-mer** (surface de mer,
  reflets dorés) — générer, exporter JPEG q82 ≤2000px dans public/gallery/,
  renseigner `image` dans `src/lib/gallery.ts`.
- **Effets (post-refonte Solaire)** : `enableMist=false` (choix DA — le code
  brume reste derrière son flag si tu veux la rallumer un soir d'hiver) ;
  poussières dorées, spotlight soleil, océan doré et nappes calcaire actifs.
  À valider à l'œil sur machine réelle (fluidité) ; re-tourner une vidéo de
  scroll si besoin : `node scripts/audit-c8-video.mjs` (l'ancienne
  `audits/chantier-8/scroll-accueil-desktop.webm` montre la DA nocturne).
- **Refonte Solaire — à vérifier à l'œil** : lisibilité crème sur la vidéo
  en vraies conditions (luminosité écran), poussières dorées (assez/trop
  visibles ?), glints dorés de l'océan du footer, et le hover soleil dans
  le footer abysse.
- **À vérifier à l'œil** (au-delà des captures) : scrub des heros au
  trackpad ET à la molette (sortie de pin sans saut), drag inertiel du
  carrousel d'avis, parcours de réservation complet au doigt sur téléphone.
- **Warnings console connus** (sans impact) : « THREE.Clock deprecated »
  (interne R3F/three r185) — disparaîtra avec une future version de
  @react-three/fiber.
- **Domaine** : les métadonnées/sitemap/JSON-LD pointent sur
  https://tideline.scottlab.app — ajuster `metadataBase` dans
  `src/app/[locale]/layout.tsx` + les constantes de `src/app/sitemap.ts` et
  `robots.ts` si le déploiement diffère.
- **Audits visuels** : toutes les captures et la vidéo sont dans `audits/`
  (par chantier + `chantier-final/`), versionnées dans le repo.
