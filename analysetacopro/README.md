# AnalyseTaCopro

> Comprenez. Anticipez. Décidez en confiance.

Plateforme web du cabinet d'analyse indépendante de copropriété avant achat
immobilier. Un client envoie les documents d'une copropriété ; nous produisons
un rapport clair avec une note de risque sur 10 — le **AnalyseTaCopro Score**.

## Stack technique

- **Frontend** : Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes / Server Actions
- **ORM** : Prisma _(Phase 4)_
- **Base de données** : PostgreSQL _(Phase 4)_
- **Auth** : NextAuth — Google + email/mot de passe _(Phase 5)_
- **Paiement** : Stripe _(Phase 8)_
- **Stockage** : Supabase Storage _(Phase 7)_
- **Emails** : Resend _(Phase 9)_
- **Hébergement** : Vercel

## Démarrer

```bash
cd analysetacopro
npm install
cp .env.example .env.local   # remplir les clés au fur et à mesure des phases
npm run dev                  # http://localhost:3000
```

## Avancement

| Phase | Description | État |
|---|---|---|
| 1 | Fondations (design system, `ScoreGauge`, `calculateScore`) | ✅ Fait |
| 2 | Page d'accueil | ✅ Fait |
| 3 | Pages publiques (avant achat, agences, tarifs, à propos, contact, FAQ) | ✅ Fait |
| 4 | Base de données (Prisma + PostgreSQL) | ⏳ À venir |
| 5 | Authentification (NextAuth) | ⏳ À venir |
| 6 | Espace client (dashboard) | ⏳ À venir |
| 7 | Création de dossier (6 étapes + upload) | ⏳ À venir |
| 8 | Paiement Stripe | ⏳ À venir |
| 9 | Emails automatiques (Resend) | ⏳ À venir |
| 10 | Espace admin | ⏳ À venir |
| 11 | Espace agences (B2B) | ⏳ À venir |
| 12 | Blog SEO | ⏳ À venir |

## Le AnalyseTaCopro Score

Note sur 10 calculée à partir de 7 critères pondérés
(`lib/score.ts`, composant `components/ScoreGauge.tsx`) :

| Critère | Poids |
|---|---|
| Finances | 25% |
| Travaux | 20% |
| Gestion | 15% |
| Contentieux | 15% |
| Impayés | 10% |
| Énergie | 10% |
| Transparence | 5% |

## Structure

```
analysetacopro/
├── app/                    # Pages (App Router) + API routes
│   ├── page.tsx            # Accueil
│   ├── analyse-avant-achat/
│   ├── agences/  tarifs/  a-propos/  faq/  contact/
│   └── api/contact/        # Formulaire de contact (Resend)
├── components/
│   ├── ScoreGauge.tsx      # Jauge circulaire animée (signature)
│   ├── Header / Footer / Logo / Reveal
│   ├── sections/           # Blocs de page réutilisables
│   └── ui/                 # Primitives (button, badge, section…)
└── lib/
    ├── score.ts            # calculateScore() + critères + niveaux de risque
    ├── pricing.ts          # Offres B2C / B2B
    └── utils.ts            # cn()
```

## Avertissement

Service d'analyse documentaire. Ne constitue pas un conseil juridique, fiscal
ou notarial. TVA non applicable, art. 293 B du CGI.
