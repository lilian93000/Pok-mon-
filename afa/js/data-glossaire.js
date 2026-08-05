/* =============================================================
   AFA – Glossaire / flashcards
   Utilisé par le mode "Flashcards" et la recherche.
   ============================================================= */
(function () {
  window.AFA_GLOSSAIRE = [
    // --- Notions générales ---
    { t: "Risque pur", d: "Risque qui ne peut produire qu'une perte (incendie, décès, accident). Seul le risque pur est assurable.", cat: "Général", mod: 'm1' },
    { t: "Risque spéculatif", d: "Risque pouvant produire une perte ou un gain (placement, pari). Non assurable.", cat: "Général", mod: 'm1' },
    { t: "Mutualité", d: "Principe fondateur de l'assurance : une communauté de risques verse des primes ; les sinistrés sont indemnisés par la caisse commune.", cat: "Général", mod: 'm1' },
    { t: "Loi des grands nombres", d: "Plus le nombre de cas observés est élevé, plus le résultat réel se rapproche de la probabilité théorique. Rend le risque calculable.", cat: "Général", mod: 'm1' },
    { t: "Antisélection", d: "Les bons risques quittent un portefeuille mal tarifé, les mauvais restent : la sinistralité se dégrade.", cat: "Général", mod: 'm1' },
    { t: "Cumul", d: "Concentration de risques touchés par un même événement (tempête, tremblement de terre). Obstacle majeur à l'assurabilité.", cat: "Général", mod: 'm1' },

    // --- Technique ---
    { t: "Prime de risque", d: "Fréquence × coût moyen des sinistres. Coût pur du risque, avant chargements.", cat: "Technique", mod: 'm1' },
    { t: "Prime commerciale", d: "Prime de risque + supplément de sécurité + chargements de frais + marge bénéficiaire.", cat: "Technique", mod: 'm1' },
    { t: "Prime encaissée", d: "Prime commerciale + taxes (droit de timbre) et frais accessoires : le montant facturé au client.", cat: "Technique", mod: 'm1' },
    { t: "Droit de timbre", d: "5 % sur les primes de choses et de patrimoine ; 2,5 % sur les assurances-vie à prime unique susceptibles de rachat. Vie périodique, maladie, accidents, chômage, grêle et réassurance exonérés.", cat: "Technique", mod: 'm1' },
    { t: "Combined ratio", d: "(Charge de sinistres + frais) / primes. En dessous de 100 %, l'activité d'assurance est bénéficiaire.", cat: "Technique", mod: 'm1' },
    { t: "Provisions techniques", d: "Engagements envers les assurés au passif du bilan : report de primes, provision pour sinistres, réserve mathématique, provision de fluctuation.", cat: "Technique", mod: 'm1' },
    { t: "Fortune liée", d: "Patrimoine séparé affecté à la couverture des engagements d'assurance ; les assurés y sont privilégiés en cas de faillite.", cat: "Technique", mod: 'm1' },
    { t: "SST", d: "Test suisse de solvabilité : compare le capital porteur de risque au capital cible, en valeurs de marché. Ratio < 100 % = intervention de la FINMA.", cat: "Technique", mod: 'm1' },

    // --- Prévoyance ---
    { t: "1er pilier", d: "AVS / AI / APG + prestations complémentaires. Couvre les besoins vitaux, financé par répartition, obligatoire.", cat: "Prévoyance", mod: 'm1' },
    { t: "2e pilier", d: "Prévoyance professionnelle (LPP) et LAA. Maintien du niveau de vie habituel, financé par capitalisation.", cat: "Prévoyance", mod: 'm1' },
    { t: "3e pilier", d: "Prévoyance individuelle : 3a lié (déductible, retrait restreint) et 3b libre.", cat: "Prévoyance", mod: 'm1' },
    { t: "Déduction de coordination", d: "Montant déduit du salaire AVS pour obtenir le salaire coordonné assuré à la LPP (CHF 26 460.– en 2026).", cat: "Prévoyance", mod: 'm1' },
    { t: "Taux de conversion LPP", d: "6,8 % dans le régime obligatoire : un avoir de CHF 100 000.– donne une rente annuelle de CHF 6 800.–.", cat: "Prévoyance", mod: 'm1' },
    { t: "ATNP", d: "Accidents non professionnels : couverts par la LAA dès 8 heures de travail par semaine chez le même employeur.", cat: "Prévoyance", mod: 'm1' },

    // --- Produits ---
    { t: "Assurance de dommages", d: "Indemnise le dommage effectivement subi. Principe indemnitaire, subrogation possible, pas de cumul.", cat: "Produits", mod: 'm1' },
    { t: "Assurance de sommes", d: "Verse la somme convenue quel que soit le dommage. Cumulable, sans subrogation (assurance-vie, capital invalidité).", cat: "Produits", mod: 'm1' },
    { t: "Casco partielle", d: "Vol, incendie, bris de glace, forces de la nature, collision avec des animaux. Pas la collision dont on est responsable.", cat: "Produits", mod: 'm1' },
    { t: "Casco complète", d: "Casco partielle + dommages de collision causés par le conducteur lui-même.", cat: "Produits", mod: 'm1' },
    { t: "Valeur à neuf", d: "Coût de remplacement par un objet neuf de même type.", cat: "Produits", mod: 'm2' },
    { t: "Valeur actuelle", d: "Valeur à neuf diminuée de la dépréciation due à l'usage et à l'âge.", cat: "Produits", mod: 'm2' },
    { t: "Valeur d'affection", d: "Valeur sentimentale d'un objet : non assurable.", cat: "Produits", mod: 'm2' },

    // --- Acteurs ---
    { t: "FINMA", d: "Autorité fédérale de surveillance des marchés financiers. Établissement de droit public indépendant, financé par les assujettis.", cat: "Acteurs", mod: 'm1' },
    { t: "ASA", d: "Association Suisse d'Assurances : faîtière des assureurs privés.", cat: "Acteurs", mod: 'm1' },
    { t: "AFA / VBV", d: "Association pour la formation professionnelle en assurance : certification des intermédiaires et formation continue.", cat: "Acteurs", mod: 'm1' },
    { t: "Ombudsman", d: "Médiateur de l'assurance privée et de la SUVA. Gratuit, neutre, émet des recommandations sans force obligatoire.", cat: "Acteurs", mod: 'm1' },
    { t: "Intermédiaire lié", d: "Agit pour le compte de l'entreprise d'assurance (agent). Inscription au registre FINMA non obligatoire.", cat: "Acteurs", mod: 'm1' },
    { t: "Intermédiaire non lié", d: "Agit pour le compte du preneur (courtier). Inscription au registre FINMA obligatoire. Cumul des statuts interdit.", cat: "Acteurs", mod: 'm1' },
    { t: "Preneur d'assurance", d: "Cocontractant de l'assureur, débiteur de la prime. Peut être distinct de l'assuré et de l'ayant droit.", cat: "Acteurs", mod: 'm1' },
    { t: "Fonds national de garantie", d: "Indemnise les dommages causés par des véhicules non identifiés ou non assurés.", cat: "Acteurs", mod: 'm2' },
    { t: "MROS", d: "Bureau de communication en matière de blanchiment d'argent : destinataire des communications de soupçon.", cat: "Acteurs", mod: 'm2' },
    { t: "PFPDT", d: "Préposé fédéral à la protection des données et à la transparence : reçoit les annonces de violation de la sécurité des données.", cat: "Acteurs", mod: 'm2' },

    // --- Réassurance ---
    { t: "Quote-part", d: "Réassurance proportionnelle : un pourcentage fixe de chaque risque est cédé.", cat: "Réassurance", mod: 'm1' },
    { t: "Excédent de plein", d: "Réassurance proportionnelle : la cédante garde un plein de conservation et cède le surplus.", cat: "Réassurance", mod: 'm1' },
    { t: "Excess of loss", d: "Réassurance non proportionnelle : le réassureur prend en charge la tranche au-delà d'une priorité, par risque ou par événement.", cat: "Réassurance", mod: 'm1' },
    { t: "Stop loss", d: "Réassurance non proportionnelle portant sur le ratio de sinistralité annuel global de la cédante.", cat: "Réassurance", mod: 'm1' },
    { t: "Rétrocession", d: "Réassurance souscrite par un réassureur : la réassurance de la réassurance.", cat: "Réassurance", mod: 'm1' },
    { t: "Captive", d: "Société d'assurance créée par un groupe industriel pour porter ses propres risques.", cat: "Réassurance", mod: 'm1' },

    // --- Droit / LCA ---
    { t: "Réticence", d: "Omission ou inexactitude sur un fait important lors de la conclusion. Résiliation dans les 4 semaines dès la connaissance ; refus de prestation seulement s'il y a lien de causalité (art. 4-6 LCA).", cat: "LCA", mod: 'm2' },
    { t: "Droit de révocation", d: "14 jours pour révoquer sa proposition ou son acceptation (art. 2a LCA). Exclu pour les couvertures provisoires et les contrats de moins d'un mois.", cat: "LCA", mod: 'm2' },
    { t: "Police", d: "Document constatant le contrat. Moyen de preuve, pas condition de validité. Depuis l'abrogation de l'ancien art. 12 LCA en 2022, le silence du preneur ne vaut plus acceptation d'une police divergente.", cat: "LCA", mod: 'm2' },
    { t: "Sommation (art. 20 LCA)", d: "Mise en demeure de payer la prime dans un délai de 14 jours ; à défaut, la couverture est suspendue.", cat: "LCA", mod: 'm2' },
    { t: "Résiliation ordinaire (art. 35a)", d: "Un contrat de plus de 3 ans peut être résilié pour la fin de la 3e année ou de chaque année suivante, préavis de 3 mois.", cat: "LCA", mod: 'm2' },
    { t: "Faute grave", d: "L'assureur peut réduire sa prestation dans la mesure répondant au degré de la faute (art. 14 al. 2 LCA). Le dessein exclut toute prestation.", cat: "LCA", mod: 'm2' },
    { t: "Prétention frauduleuse", d: "Art. 40 LCA : déclaration mensongère faite dans l'intention de tromper. Perte intégrale du droit aux prestations pour ce sinistre.", cat: "LCA", mod: 'm2' },
    { t: "Prescription LCA", d: "5 ans dès le fait d'où naît l'obligation (art. 46 LCA), depuis la révision de 2022 (2 ans auparavant).", cat: "LCA", mod: 'm2' },
    { t: "Sous-assurance", d: "Somme d'assurance inférieure à la valeur. Règle proportionnelle : Indemnité = Dommage × Somme / Valeur (art. 69 LCA).", cat: "LCA", mod: 'm2' },
    { t: "Surassurance", d: "Somme supérieure à la valeur réelle. On n'est jamais indemnisé au-delà du dommage ; nullité si intention frauduleuse.", cat: "LCA", mod: 'm2' },
    { t: "Double assurance", d: "Même intérêt assuré auprès de plusieurs assureurs. Obligation d'aviser ; responsabilité solidaire des assureurs.", cat: "LCA", mod: 'm2' },
    { t: "Subrogation", d: "L'assureur qui indemnise reprend les droits de l'assuré contre le tiers responsable (art. 95c LCA). Uniquement en assurance de dommages.", cat: "LCA", mod: 'm2' },
    { t: "Art. 33 LCA", d: "L'assureur répond de tous les événements du risque assuré, sauf exclusion précise et non équivoque. Le doute profite à l'assuré.", cat: "LCA", mod: 'm2' },

    // --- Droit général ---
    { t: "Capacité d'exercice", d: "Aptitude à s'obliger par ses propres actes : suppose la majorité et le discernement.", cat: "Droit", mod: 'm2' },
    { t: "Contrat boiteux", d: "Acte d'un mineur capable de discernement conclu sans le consentement de son représentant légal : validité en suspens jusqu'à ratification.", cat: "Droit", mod: 'm2' },
    { t: "Vices du consentement", d: "Erreur essentielle, dol, crainte fondée. Invalidation dans un délai d'un an (art. 31 CO).", cat: "Droit", mod: 'm2' },
    { t: "Responsabilité causale simple", d: "Sans faute, mais avec preuve libératoire : art. 55 CO (employeur), 56 CO (animaux), 333 CC (chef de famille).", cat: "Droit", mod: 'm2' },
    { t: "Responsabilité causale aggravée", d: "Sans faute et sans preuve libératoire : art. 58 LCR (détenteur de véhicule), LRFP, nucléaire, conduites.", cat: "Droit", mod: 'm2' },
    { t: "Action directe", d: "Le lésé peut agir directement contre l'assureur RC du responsable ; les exceptions du contrat ne lui sont pas opposables.", cat: "Droit", mod: 'm2' },
    { t: "Tort moral", d: "Réparation de l'atteinte à la personnalité et de la souffrance (art. 47 et 49 CO), distincte du dommage patrimonial.", cat: "Droit", mod: 'm2' },
    { t: "Prescription délictuelle", d: "3 ans dès la connaissance du dommage et de l'auteur, 10 ans au maximum (20 ans en cas de lésions corporelles ou de mort).", cat: "Droit", mod: 'm2' },
    { t: "nLPD", d: "Nouvelle loi sur la protection des données, en vigueur depuis le 1.9.2023. Ne protège que les personnes physiques.", cat: "Droit", mod: 'm2' },
    { t: "Données sensibles", d: "Santé, opinions religieuses ou politiques, données biométriques, poursuites pénales. Consentement exprès requis.", cat: "Droit", mod: 'm2' },
    { t: "LBA", d: "Loi sur le blanchiment d'argent. S'applique à l'assurance-vie directe, pas à l'assurance dommages. Conservation des pièces : 10 ans.", cat: "Droit", mod: 'm2' }
  ];
})();
