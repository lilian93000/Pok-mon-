# 🎬 Remotion — vidéos de Monstrobattle

Projet [Remotion](https://www.remotion.dev) (vidéos écrites en React) pour créer les
vidéos du jeu.

## Installation

```bash
cd remotion
npm install
```

## Utilisation

| Commande          | Effet                                                   |
|-------------------|---------------------------------------------------------|
| `npm run dev`     | Ouvre Remotion Studio (aperçu interactif dans le navigateur) |
| `npm run render`  | Rend la composition `Intro` en `out/intro.mp4`          |
| `npm run still`   | Exporte une image fixe (frame 60) en `out/intro.png`    |
| `npm run upgrade` | Met à jour Remotion                                     |

## Structure

| Fichier              | Rôle                                         |
|----------------------|----------------------------------------------|
| `src/index.ts`       | Point d'entrée (`registerRoot`).             |
| `src/Root.tsx`       | Déclare les compositions (durée, fps, taille). |
| `src/Intro.tsx`      | Animation d'intro (Polkaball + titre).       |
| `remotion.config.ts` | Configuration du rendu.                      |

Pour ajouter une vidéo : crée un composant dans `src/` et déclare une nouvelle
`<Composition>` dans `src/Root.tsx`.

> Licence : Remotion est gratuit pour les particuliers et les petites équipes ;
> une licence entreprise est requise au-delà (voir remotion.dev/license).
