#!/usr/bin/env node
/* =============================================================
   Regroupe le site en une seule page HTML autonome.

   Usage :  node build-single-file.js [fichier-de-sortie]
   Défaut :  afa-site-complet.html

   Utile pour héberger le site là où l'on ne peut déposer qu'un
   fichier, ou pour l'envoyer par courriel. Le fichier produit
   n'a besoin d'aucun serveur : il s'ouvre directement.
   ============================================================= */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const out = process.argv[2] || path.join(dir, 'afa-site-complet.html');

const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Ordre de chargement des scripts : celui déclaré dans index.html.
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
if (!scripts.length) {
  console.error('Aucun <script src="…"> trouvé dans index.html.');
  process.exit(1);
}

const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');

// Un </script> à l'intérieur d'une chaîne JS fermerait la balise : on le neutralise.
const js = scripts.map(src => {
  const code = fs.readFileSync(path.join(dir, src), 'utf8');
  return `/* ===== ${src} ===== */\n${code.replace(/<\/script>/gi, '<\\/script>')}`;
}).join('\n');

const body = html
  .replace(/[\s\S]*<body>/i, '')
  .replace(/<\/body>[\s\S]*/i, '')
  .replace(/\s*<script src="[^"]+"><\/script>/g, '');

const title = (html.match(/<title>([^<]*)<\/title>/i) || [, 'AFA — entraînement'])[1];

fs.writeFileSync(out, `<title>${title}</title>
<style>
${css}
</style>
${body.trim()}
<script>
${js}
</script>
`);

const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log(`✅ ${out} (${kb} Ko) — ${scripts.length} scripts et la feuille de style regroupés.`);
