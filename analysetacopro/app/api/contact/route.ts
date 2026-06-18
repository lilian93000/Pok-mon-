import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { name, email, message, phone, subject } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nom, email et message sont requis." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Adresse email invalide." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  // Si Resend n'est pas configuré (ex. en développement), on log et on
  // répond OK pour ne pas bloquer le parcours. Brancher les clés en Phase 9.
  if (!apiKey || !to || !from) {
    console.info("[contact] Resend non configuré — message reçu :", {
      name,
      email,
      subject,
    });
    return NextResponse.json({ ok: true, simulated: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Contact] ${subject || "Nouveau message"} — ${name}`,
        text: `Nom : ${name}\nEmail : ${email}\nTéléphone : ${
          phone || "—"
        }\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[contact] Resend error:", detail);
      return NextResponse.json(
        { error: "L'envoi a échoué. Réessayez plus tard." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json(
      { error: "Erreur serveur. Réessayez plus tard." },
      { status: 500 }
    );
  }
}
