# JUSTICIA — Web (NextJS)

Interfaces « Web » de **JUSTICIA**, système de gestion de la chaîne pénale
(interpellation → garde à vue → identification → parquet → instruction →
jugement → exécution des peines → casier judiciaire). Cahier des charges
complet : [docs/cahier-des-charges.md](docs/cahier-des-charges.md).

Consomme l'API [JUSTICIA-BACKEND](https://github.com/Yamoon224/JUSTICIA-BACKEND)
(Laravel) — jamais directement, toujours via ce frontend agissant en BFF
(Backend For Frontend) : le jeton d'accès n'est jamais exposé au navigateur.

## Pile technique

NextJS 16 (App Router) · TypeScript strict · Tailwind CSS v4 · lucide-react · Zod.

Système de design « registre & sceau » (voir `src/app/globals.css`) : fond
papier chaud, encre presque noire, accent lie-de-vin (Fraunces en titrage,
Public Sans en corps de texte, IBM Plex Mono pour les codes/identifiants) —
un vocabulaire tiré du sujet plutôt qu'une palette SaaS générique. Primitives
partagées dans `src/components/ui.tsx`, shell applicatif responsive
(sidebar desktop / tiroir mobile) dans `src/components/app-shell.tsx`.

## État d'avancement

- ✅ **Phase 2 — Socle technique** : authentification (cookie httpOnly via
  BFF), garde de routes, tableau de bord filtré par permissions.
- ✅ **Phase 3 — Enquête & garde à vue** (§6.1-6.4) : personnes (recherche,
  création, consultation motivée, fusion), affaires (ouverture, PV,
  scellés, transmission parquet), garde à vue (placement, droits,
  prolongation, clôture) — voir
  `src/features/{garde-a-vue,identification,affaires}`.
- ✅ **Phase 4 — Parquet & instruction** (§6.5-6.6) :
  - Parquet : bureau des arrivées, affectation à un magistrat,
    orientation des poursuites, réquisitions — `src/features/parquet`.
  - Instruction : cabinet, mise en examen, mesures de sûreté (contrôle
    judiciaire, détention provisoire), mandats, actes, ordonnance de
    règlement — `src/features/instruction`.
- ⏳ Phases 5 à 9 : à venir.

## Démarrage

```bash
npm install
cp .env.local.example .env.local
npm run dev   # http://localhost:3000
```

Nécessite [JUSTICIA-BACKEND](https://github.com/Yamoon224/JUSTICIA-BACKEND)
démarré sur l'URL renseignée dans `BACKEND_URL` (voir `.env.local.example`).

## Conventions (§10.2 du cahier des charges)

- Un dossier `src/features/<domaine>` par module métier (§6), à
  responsabilité unique.
- **Aucune règle juridique côté client** : le frontend affiche ce que l'API
  calcule et autorise, il ne décide jamais.
- Le jeton d'accès Sanctum ne transite jamais côté navigateur — voir
  `src/lib/auth/session.ts` et `src/app/api/auth/*`.
- Garde de routes via `src/proxy.ts` (convention NextJS 16, ex-`middleware.ts`).
- TypeScript strict, ESLint bloquant avant tout commit.
