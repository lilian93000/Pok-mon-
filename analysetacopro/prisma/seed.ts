import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed de démonstration. À lancer une fois la base configurée :
 *   npm run db:push && npm run db:seed
 */
async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@analysetacopro.fr" },
    update: {},
    create: {
      email: "demo@analysetacopro.fr",
      name: "Client Démo",
      role: "PARTICULIER",
    },
  });

  await prisma.dossier.create({
    data: {
      userId: user.id,
      adresse: "12 rue des Lilas",
      ville: "Lyon",
      codePostal: "69003",
      typeBien: "APPARTEMENT",
      formule: "PREMIUM",
      statut: "RAPPORT_LIVRE",
      prixHT: 249,
      scoreFinal: 8.4,
      rapport: {
        create: {
          statut: "livre",
          scoreFinal: 8.4,
          noteFinances: 8.5,
          noteTravaux: 8,
          noteGestion: 8.8,
          noteContentieux: 9,
          noteImpayes: 7.5,
          noteEnergie: 7.8,
          noteTransparence: 9.2,
          resume:
            "Copropriété saine, bien gérée, finances solides. Travaux énergétiques à anticiper.",
        },
      },
    },
  });

  console.log("✔ Seed terminé pour", user.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
