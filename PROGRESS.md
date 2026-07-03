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
  WebP (commandes dans `TIDELINE-chantiers-2-7.md`, section shot-list) vers
  `public/frames/hero-home/` et `public/frames/hero-reservation/`, puis
  renseigner `frameCount` exact dans `src/lib/heroes.ts` (provisoires :
  240/168) — seul changement de code nécessaire. Bonus conseillé : remplacer
  aussi `fallbackSrc` (public/heroes/*.jpg) par une vraie frame fixe.
- **Visuels IA espaces + galerie** : exporter JPEG q82 ≤2000px vers
  `public/espaces/` et `public/gallery/`, puis renseigner le champ `image`
  dans `src/lib/espaces.ts` et `src/lib/gallery.ts` — les composants (y
  compris le spotlight lanterne) basculent sur next/image sans refactor.
- **Effets chantier 8** : les 6 flags de `src/lib/effects.ts` sont actifs,
  aucun effet dégradé ni coupé. À valider à l'œil sur machine réelle
  (l'audit headless ne juge pas la fluidité) : brume + lucioles des heros,
  océan du footer, curseur-lanterne, nappes de transition. La vidéo
  `audits/chantier-8/scroll-accueil-desktop.webm` donne un aperçu.
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
