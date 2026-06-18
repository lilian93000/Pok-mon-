# AnalyseTaCopro

Service d'**analyse indépendante de copropriété avant achat immobilier**.
Le client envoie les documents d'une copropriété ; nous produisons un rapport
clair avec une note de risque sur 10 — le **AnalyseTaCopro Score** — pour
l'aider à décider d'acheter ou non.

> Comprenez. Anticipez. Décidez en confiance.

## Stack technique

- **Frontend** : Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, base shadcn/ui
- **Backend** : Next.js API Routes / Server Actions
- **ORM / BDD** : Prisma + PostgreSQL _(Phase 4)_
- **Auth** : NextAuth — Google + Email/mot de passe _(Phase 5)_
- **Paiement** : Stripe _(Phase 8)_
- **Stockage** : Supabase Storage _(Phase 7)_
- **Emails** : Resend _(Phases 3 & 9)_
- **Hébergement** : Vercel

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner les clés
npm run dev                  # http://localhost:3000
```

## Le AnalyseTaCopro Score

Note sur 10 calculée à partir de 7 critères pondérés
(`src/lib/score.ts`, fonction `calculateScore`) :

| Critère | Poids |
|---|---|
| Finances | 25 % |
| Travaux | 20 % |
| Gestion | 15 % |
| Contentieux | 15 % |
| Impayés | 10 % |
| Énergie | 10 % |
| Transparence | 5 % |

Le composant réutilisable `<ScoreGauge />` (`src/components/score-gauge.tsx`)
affiche la jauge circulaire animée et le détail des critères.

## Avancement par phases

- [x] **Phase 1 — Fondations** : Next.js + TS + Tailwind, design system,
      `calculateScore()`, `<ScoreGauge />`, `.env.example`
- [ ] Phase 2 — Page d'accueil
- [ ] Phase 3 — Pages publiques + contact (Resend)
- [ ] Phase 4 — Base de données (Prisma + PostgreSQL)
- [ ] Phase 5 — Authentification (NextAuth)
- [ ] Phase 6 — Espace client (dashboard)
- [ ] Phase 7 — Création de dossier (6 étapes, upload Supabase)
- [ ] Phase 8 — Paiement Stripe
- [ ] Phase 9 — Emails automatiques
- [ ] Phase 10 — Espace admin
- [ ] Phase 11 — Espace agences (B2B)
- [ ] Phase 12 — Blog SEO

## Mentions

Service d'analyse documentaire — ne constitue pas un conseil juridique,
fiscal ou notarial.
