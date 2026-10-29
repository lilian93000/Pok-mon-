// Envoi des formulaires par email via Web3Forms (site statique, sans serveur).
// Les emails arrivent à l'adresse liée à cette clé sur web3forms.com : contact@analysetacopro.fr.
export const WEB3FORMS_KEY = "00c0ecce-d9cb-402d-b589-1d5c155aae05";

/** Envoie le formulaire ; renvoie true seulement si Web3Forms confirme l'envoi. */
export async function sendWeb3Forms(fd: FormData): Promise<boolean> {
  fd.set("access_key", WEB3FORMS_KEY);
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
    });
    const json = await res.json().catch(() => ({}));
    return res.ok && json.success === true;
  } catch {
    return false;
  }
}
