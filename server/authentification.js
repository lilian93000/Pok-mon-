/* ============================================================
   Walaxy — authentification
   ------------------------------------------------------------
   - Mots de passe hachés avec scrypt (sel aléatoire par compte)
   - Jetons de session signés HMAC-SHA256, avec expiration
   - Le secret de signature est généré au premier démarrage et
     persisté dans server/data/secret.key
   ============================================================ */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { DOSSIER_DONNEES } = require("./magasin");

const FICHIER_SECRET = path.join(DOSSIER_DONNEES, "secret.key");

function chargerSecret() {
  try { return fs.readFileSync(FICHIER_SECRET, "utf8").trim(); }
  catch (e) {
    const secret = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(FICHIER_SECRET, secret, { mode: 0o600 });
    return secret;
  }
}

const SECRET = chargerSecret();

/* ---------- Mots de passe ---------- */

function hacherMotDePasse(motDePasse) {
  const sel = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(motDePasse, sel, 64).toString("hex");
  return sel + ":" + hash;
}

function verifierMotDePasse(motDePasse, stocke) {
  const [sel, hash] = String(stocke).split(":");
  if (!sel || !hash) return false;
  const calcule = crypto.scryptSync(motDePasse, sel, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(calcule, "hex"));
}

/* ---------- Jetons de session ---------- */

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

function signer(donnees) {
  return crypto.createHmac("sha256", SECRET).update(donnees).digest("base64url");
}

function creerToken(uid) {
  const charge = b64url(JSON.stringify({ uid, exp: Date.now() + config.TOKEN_TTL_MS }));
  return charge + "." + signer(charge);
}

/* Retourne l'uid si le jeton est valide et non expiré, sinon null */
function verifierToken(token) {
  if (typeof token !== "string") return null;
  const [charge, signature] = token.split(".");
  if (!charge || !signature) return null;
  const attendu = signer(charge);
  const a = Buffer.from(signature);
  const b = Buffer.from(attendu);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const donnees = JSON.parse(Buffer.from(charge, "base64url").toString("utf8"));
    if (!donnees.uid || Date.now() > donnees.exp) return null;
    return donnees.uid;
  } catch (e) { return null; }
}

module.exports = { hacherMotDePasse, verifierMotDePasse, creerToken, verifierToken };
