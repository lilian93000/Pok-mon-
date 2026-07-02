/* ============================================================
   Walaxy — envoi d'emails (canal RÉEL et légal)
   ------------------------------------------------------------
   Contrairement à l'automatisation LinkedIn, l'envoi d'emails de
   prospection est autorisé s'il respecte les règles anti-spam.
   Ce module les applique :
     · lien de désabonnement en un clic (jeton signé),
     · en-têtes List-Unsubscribe / List-Unsubscribe-Post,
     · liste de suppression consultée AVANT chaque envoi,
     · identité de l'expéditeur et adresse postale physique.

   Client SMTP écrit à la main (TLS implicite, STARTTLS, ou clair
   pour le développement local) — aucune dépendance.

   Sans configuration SMTP, le module bascule en mode « aperçu » :
   les emails sont écrits dans server/data/outbox/ au lieu d'être
   envoyés, pour tout tester sans importuner personne.
   ============================================================ */

const net = require("net");
const tls = require("tls");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("./config");
const auth = require("./authentification");
const { DOSSIER_DONNEES } = require("./magasin");

const DOSSIER_OUTBOX = path.join(DOSSIER_DONNEES, "outbox");
const FICHIER_SUPPRESSION = path.join(DOSSIER_DONNEES, "desabonnements.json");

function modeEnvoi() { return config.SMTP.hote ? "smtp" : "apercu"; }

/* ============================================================
   Liste de suppression (désabonnements) — globale
   ============================================================ */

function lireSuppression() {
  try { return new Set(JSON.parse(fs.readFileSync(FICHIER_SUPPRESSION, "utf8"))); }
  catch (e) { return new Set(); }
}

function ecrireSuppression(ensemble) {
  const tmp = FICHIER_SUPPRESSION + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify([...ensemble], null, 2));
  fs.renameSync(tmp, FICHIER_SUPPRESSION);
}

function normaliser(email) { return String(email || "").trim().toLowerCase(); }

function estDesabonne(email) { return lireSuppression().has(normaliser(email)); }

function desabonner(email) {
  const ensemble = lireSuppression();
  ensemble.add(normaliser(email));
  ecrireSuppression(ensemble);
}

/* ============================================================
   Jetons de désabonnement (email signé, non falsifiable)
   ============================================================ */

function jetonDesabonnement(email) {
  const charge = Buffer.from(normaliser(email)).toString("base64url");
  return charge + "." + auth.signerValeur(charge);
}

function verifierJetonDesabonnement(jeton) {
  if (typeof jeton !== "string") return null;
  const [charge, signature] = jeton.split(".");
  if (!charge || !signature || !auth.verifierValeur(charge, signature)) return null;
  try { return Buffer.from(charge, "base64url").toString("utf8"); }
  catch (e) { return null; }
}

function lienDesabonnement(email) {
  return `${config.URL_PUBLIQUE}/desabonnement?jeton=${encodeURIComponent(jetonDesabonnement(email))}`;
}

/* ============================================================
   Construction du message MIME (multipart text + html)
   ============================================================ */

function echapHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function enteteEncode(valeur) {
  // Encodage RFC 2047 pour les caractères non ASCII (accents dans le sujet/nom)
  if (/^[\x00-\x7F]*$/.test(valeur)) return valeur;
  return "=?UTF-8?B?" + Buffer.from(valeur, "utf8").toString("base64") + "?=";
}

function construireMessage({ de, deNom, a, sujet, texte, html, repondreA, lienDesab }) {
  const frontiere = "walaxy_" + crypto.randomBytes(12).toString("hex");
  const messageId = `<${crypto.randomBytes(16).toString("hex")}@walaxy>`;

  const piedTexte = `\r\n\r\n—\r\nVous recevez cet email dans le cadre d'une prise de contact professionnelle.` +
    `\r\nSe désabonner : ${lienDesab}\r\n${config.EMAIL.adressePostale}`;
  const piedHtml = `<hr style="border:none;border-top:1px solid #e1e0d9;margin:24px 0">` +
    `<p style="font-size:12px;color:#898781;line-height:1.5">` +
    `Vous recevez cet email dans le cadre d'une prise de contact professionnelle.<br>` +
    `<a href="${lienDesab}" style="color:#898781">Se désabonner en un clic</a><br>` +
    `${echapHtml(config.EMAIL.adressePostale)}</p>`;

  const entetes = [
    `From: ${enteteEncode(deNom)} <${de}>`,
    `To: <${a}>`,
    repondreA ? `Reply-To: <${repondreA}>` : null,
    `Subject: ${enteteEncode(sujet)}`,
    `Message-ID: ${messageId}`,
    `Date: ${new Date().toUTCString()}`,
    `MIME-Version: 1.0`,
    // En-têtes de désabonnement standard (attendus par Gmail/Outlook)
    `List-Unsubscribe: <${lienDesab}>`,
    `List-Unsubscribe-Post: List-Unsubscribe=One-Click`,
    `Content-Type: multipart/alternative; boundary="${frontiere}"`
  ].filter(Boolean).join("\r\n");

  const corps = [
    ``,
    `--${frontiere}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    texte + piedTexte,
    ``,
    `--${frontiere}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#0b0b0b;line-height:1.6">${html}${piedHtml}</div>`,
    ``,
    `--${frontiere}--`,
    ``
  ].join("\r\n");

  // Un point en début de ligne doit être doublé (transparence SMTP)
  const message = (entetes + "\r\n" + corps).replace(/\r\n\./g, "\r\n..");
  return { message, messageId };
}

/* ============================================================
   Client SMTP minimal
   ============================================================ */

function dialogueSMTP(socket, message, { de, a, utilisateur, motDePasse }) {
  return new Promise((resolve, reject) => {
    let tampon = "";
    let etape = 0;
    const echec = e => { socket.destroy(); reject(e instanceof Error ? e : new Error(e)); };

    const envoyer = ligne => socket.write(ligne + "\r\n");

    // Séquence de commandes ; chaque entrée attend un code de réponse.
    const auth = utilisateur
      ? [
          { cmd: "AUTH LOGIN", code: 334 },
          { cmd: Buffer.from(utilisateur).toString("base64"), code: 334 },
          { cmd: Buffer.from(motDePasse).toString("base64"), code: 235 }
        ]
      : [];
    const sequence = [
      { attendreSeul: true, code: 220 },                 // bannière du serveur
      { cmd: "EHLO walaxy.local", code: 250 },
      ...auth,
      { cmd: `MAIL FROM:<${de}>`, code: 250 },
      { cmd: `RCPT TO:<${a}>`, code: 250 },
      { cmd: "DATA", code: 354 },
      { cmd: message + "\r\n.", code: 250, brut: true },
      { cmd: "QUIT", code: 221 }
    ];

    function avancer() {
      const courant = sequence[etape];
      if (!courant) return; // en attente d'une réponse
    }

    socket.on("data", morceau => {
      tampon += morceau.toString("utf8");
      // Une réponse SMTP peut être multi-lignes (250-… puis 250 …)
      const lignes = tampon.split("\r\n");
      const derniereComplete = tampon.endsWith("\r\n");
      const aTraiter = derniereComplete ? lignes.slice(0, -1) : lignes.slice(0, -1);
      const finale = aTraiter.reverse().find(l => /^\d{3} /.test(l));
      if (!finale) return; // réponse pas encore terminée
      tampon = "";

      const code = parseInt(finale.slice(0, 3), 10);
      const etapeCourante = sequence[etape];
      if (code !== etapeCourante.code) {
        return echec(`SMTP: réponse ${code} inattendue (attendu ${etapeCourante.code}) — ${finale}`);
      }

      etape++;
      const suivante = sequence[etape];
      if (!suivante) { socket.end(); return resolve(); }
      if (suivante.attendreSeul) return; // on attend juste la prochaine réponse
      envoyer(suivante.cmd);
    });

    socket.on("error", echec);
    socket.on("timeout", () => echec("SMTP: délai dépassé"));
    socket.setTimeout(15000);
  });
}

async function envoyerViaSMTP({ de, a, message }) {
  const { hote, port, securite, utilisateur, motDePasse } = config.SMTP;
  const creds = { de, a, utilisateur, motDePasse };

  if (securite === "tls") {
    const socket = tls.connect({ host: hote, port });
    await new Promise((res, rej) => { socket.once("secureConnect", res); socket.once("error", rej); });
    return dialogueSMTP(socket, message, creds);
  }

  if (securite === "starttls") {
    // Connexion claire, EHLO, STARTTLS, puis reprise chiffrée
    const brut = net.connect({ host: hote, port });
    await negocierStartTLS(brut);
    const secure = tls.connect({ socket: brut, servername: hote });
    await new Promise((res, rej) => { secure.once("secureConnect", res); secure.once("error", rej); });
    return dialogueSMTP(secure, message, creds);
  }

  // "aucune" : SMTP en clair — réservé au développement local
  const socket = net.connect({ host: hote, port });
  return dialogueSMTP(socket, message, creds);
}

function negocierStartTLS(socket) {
  return new Promise((resolve, reject) => {
    let tampon = "";
    let etat = "banniere";
    const envoyer = l => socket.write(l + "\r\n");
    socket.on("data", m => {
      tampon += m.toString();
      if (!/\r\n/.test(tampon)) return;
      const finale = tampon.split("\r\n").reverse().find(l => /^\d{3} /.test(l));
      if (!finale) return;
      tampon = "";
      const code = parseInt(finale.slice(0, 3), 10);
      if (etat === "banniere" && code === 220) { etat = "ehlo"; envoyer("EHLO walaxy.local"); }
      else if (etat === "ehlo" && code === 250) { etat = "starttls"; envoyer("STARTTLS"); }
      else if (etat === "starttls" && code === 220) { socket.removeAllListeners("data"); resolve(); }
      else reject(new Error(`STARTTLS: réponse ${code} inattendue`));
    });
    socket.on("error", reject);
  });
}

/* ============================================================
   Aperçu (pas de SMTP configuré) : écrit l'email sur disque
   ============================================================ */

function ecrireApercu({ a, sujet, message }) {
  if (!fs.existsSync(DOSSIER_OUTBOX)) fs.mkdirSync(DOSSIER_OUTBOX, { recursive: true });
  const nom = Date.now() + "-" + normaliser(a).replace(/[^a-z0-9]+/g, "_") + ".eml";
  fs.writeFileSync(path.join(DOSSIER_OUTBOX, nom), message);
  return nom;
}

/* ============================================================
   Point d'entrée : envoyer un email de séquence
   ============================================================ */

async function envoyer({ destinataire, sujet, texte, html }) {
  const a = normaliser(destinataire);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)) {
    return { ok: false, statut: "invalide", erreur: "Adresse email invalide." };
  }
  // Garde-fou anti-spam : jamais d'envoi à une personne désabonnée
  if (estDesabonne(a)) {
    return { ok: false, statut: "desabonne", erreur: "Destinataire désabonné." };
  }

  const { message, messageId } = construireMessage({
    de: config.EMAIL.expediteurEmail,
    deNom: config.EMAIL.expediteurNom,
    a,
    sujet,
    texte,
    html,
    repondreA: config.EMAIL.repondreA,
    lienDesab: lienDesabonnement(a)
  });

  if (modeEnvoi() === "apercu") {
    const fichier = ecrireApercu({ a, sujet, message });
    return { ok: true, statut: "apercu", messageId, apercu: fichier };
  }

  try {
    await envoyerViaSMTP({ de: config.EMAIL.expediteurEmail, a, message });
    return { ok: true, statut: "envoye", messageId };
  } catch (erreur) {
    return { ok: false, statut: "erreur", erreur: erreur.message };
  }
}

module.exports = {
  envoyer, estDesabonne, desabonner,
  verifierJetonDesabonnement, lienDesabonnement,
  modeEnvoi
};
