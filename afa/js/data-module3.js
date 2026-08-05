/* =============================================================
   AFA – Module 3 : Assurances non-vie (profil Non-Vie)
   Choses, patrimoine, véhicules, entreprise.
   Périmètre du profil Non-Vie : hors assurance-vie et hors
   assurance-maladie complémentaire (profils distincts).
   ============================================================= */
(function () {
  const M = {
    id: 'm3',
    code: 'Module 3',
    title: 'Assurances non-vie',
    subtitle: "Ménage, bâtiment, véhicules, responsabilité civile, entreprise et sinistres",
    icon: '🏠',
    color: 'green',
    chapters: [],
    questions: []
  };

  M.chapters = [
    {
      id: 'c1',
      title: "L'assurance ménage",
      resume: "Inventaire du ménage : couvertures, somme d'assurance, exclusions et règlement des sinistres.",
      sections: [
        {
          h: "Objet de la couverture",
          html: `<p>L'assurance <b>inventaire du ménage</b> couvre l'ensemble des biens mobiliers appartenant aux personnes vivant en ménage commun&nbsp;: meubles, vêtements, appareils, provisions, objets de valeur dans certaines limites.</p>
          <p>Les couvertures se combinent&nbsp;:</p>
          <table class="tbl">
            <tr><th>Couverture</th><th>Contenu typique</th></tr>
            <tr><td><b>Incendie</b></td><td>Feu, fumée, foudre, explosion, chute d'aéronefs&nbsp;; s'y ajoutent les <b>dommages naturels</b> (tempête, grêle, inondation, avalanche, glissement de terrain).</td></tr>
            <tr><td><b>Dégâts d'eau</b></td><td>Sortie d'eau de conduites, appareils, aquariums&nbsp;; refoulement de canalisations. Souvent exclus&nbsp;: infiltration par les eaux de pluie sans dommage à la toiture.</td></tr>
            <tr><td><b>Vol</b></td><td><b>Vol par effraction</b> et brigandage au domicile&nbsp;; <b>vol simple à l'extérieur</b> en option, avec un plafond distinct.</td></tr>
            <tr><td><b>Bris de glace</b></td><td>Vitrages du mobilier et, selon le contrat, du bâtiment (vitrocéramique, plans de travail).</td></tr>
          </table>`
        },
        {
          h: "Somme d'assurance et sous-assurance",
          html: `<p>La somme d'assurance doit correspondre à la <b>valeur de remplacement à neuf</b> de la totalité de l'inventaire. Les assureurs proposent des <b>barèmes indicatifs</b> selon la taille du logement et le nombre de personnes.</p>
          <p class="formula">Indemnité = Dommage × (Somme d'assurance ÷ Valeur d'assurance)</p>
          <p>Une somme trop basse déclenche la <b>règle proportionnelle</b> sur <b>chaque</b> sinistre, même partiel. D'où l'importance d'un inventaire actualisé et, souvent, d'une <b>clause d'indexation</b>. Certains contrats prévoient une <b>garantie contre la sous-assurance</b> lorsque la somme suit le barème de l'assureur.</p>`
        },
        {
          h: "Points de vigilance à la vente",
          html: `<ul>
            <li><b>Objets de valeur</b> (bijoux, montres, œuvres)&nbsp;: sous-limites fréquentes&nbsp;; au-delà, il faut une couverture séparée avec liste et estimation.</li>
            <li><b>Objets à l'extérieur du domicile</b>&nbsp;: vélos, bagages, effets personnels — sous-limites et exigences de diligence (cadenas, surveillance).</li>
            <li><b>Étudiants et enfants majeurs</b> logeant ailleurs&nbsp;: extension à vérifier.</li>
            <li><b>Déménagement</b>&nbsp;: annoncer le changement d'adresse (aggravation ou diminution du risque, adaptation de la prime).</li>
            <li><b>Négligence grave</b>&nbsp;: porte non verrouillée, clés sous le paillasson — réduction possible, sauf clause de renonciation.</li>
          </ul>`
        }
      ],
      keypoints: [
        "Le ménage couvre l'inventaire mobilier : incendie, dégâts d'eau, vol, bris de glace.",
        "La somme d'assurance vise la valeur à neuf de tout l'inventaire.",
        "Sous-assurance = règle proportionnelle sur chaque sinistre, même partiel.",
        "Le vol simple à l'extérieur est une extension avec sous-limite.",
        "Objets de valeur : vérifier les sous-limites et prévoir une couverture séparée."
      ]
    },

    {
      id: 'c2',
      title: 'Bâtiment et dommages naturels',
      resume: "Assurance du bâtiment, monopole cantonal, dommages naturels et couvertures complémentaires.",
      sections: [
        {
          h: "Qui assure le bâtiment ?",
          html: `<p>Dans <b>19 cantons</b>, l'assurance <b>incendie et dommages naturels</b> du bâtiment relève d'un <b>établissement cantonal d'assurance (ECA)</b> disposant d'un <b>monopole</b>&nbsp;: l'affiliation est obligatoire et la prime est fixée par l'établissement.</p>
          <p>Dans les cantons dits <b>GUSTAVO</b> — <b>GE, UR, SZ, TI, AI, VS, OW</b> — le marché est ouvert aux <b>assureurs privés</b>. L'intermédiaire non-vie doit savoir immédiatement dans quel régime se trouve son client.</p>`
        },
        {
          h: "Ce que couvre l'assurance du bâtiment",
          html: `<ul>
            <li><b>Incendie</b>&nbsp;: feu, fumée, foudre, explosion.</li>
            <li><b>Dommages naturels</b>&nbsp;: hautes eaux et inondation, tempête (dès une certaine vitesse de vent), grêle, avalanche, pression de la neige, éboulement, chute de pierres, glissement de terrain.</li>
            <li><b>Exclusions usuelles</b>&nbsp;: <b>tremblement de terre</b>, affaissement de terrain dû à la construction, usure et défaut d'entretien, dommages de guerre.</li>
          </ul>
          <p>Le <b>tremblement de terre</b> n'est donc pas couvert par le régime ordinaire&nbsp;: il exige une couverture spécifique ou un pool.</p>`
        },
        {
          h: "Les compléments indispensables",
          html: `<ul>
            <li><b>Dégâts d'eau du bâtiment</b>&nbsp;: conduites, chauffage, refoulement — généralement <b>hors monopole</b>, à souscrire auprès d'un assureur privé.</li>
            <li><b>Bris de glace du bâtiment</b>&nbsp;: fenêtres, vitrages fixes, vitrocéramique.</li>
            <li><b>RC du propriétaire d'immeuble</b>&nbsp;: responsabilité de l'art. 58 CO pour défaut de construction ou d'entretien.</li>
            <li><b>Installations techniques</b>&nbsp;: pompes à chaleur, panneaux solaires, ascenseurs.</li>
            <li><b>Frais supplémentaires</b>&nbsp;: déblaiement, perte de loyer, relogement.</li>
          </ul>
          <p class="tip">Question d'examen fréquente&nbsp;: «&nbsp;dans un canton à monopole, que reste-t-il à vendre&nbsp;?&nbsp;» — les dégâts d'eau, le bris de glace, la RC immeuble, le contenu et les installations.</p>`
        }
      ],
      keypoints: [
        "19 cantons ont un ECA monopolistique ; GUSTAVO (GE, UR, SZ, TI, AI, VS, OW) = marché privé.",
        "Le monopole couvre incendie et dommages naturels du bâtiment.",
        "Le tremblement de terre est exclu du régime ordinaire.",
        "Dégâts d'eau, bris de glace et RC immeuble restent au marché privé.",
        "Prévoir déblaiement, perte de loyer et relogement."
      ]
    },

    {
      id: 'c3',
      title: 'Véhicules à moteur',
      resume: "RC obligatoire, casco partielle et complète, LCR, bonus-malus et gestion du sinistre.",
      sections: [
        {
          h: "La RC véhicule, seule assurance obligatoire",
          html: `<p>La <b>LCR</b> impose au <b>détenteur</b> une assurance RC. Sans attestation, pas de permis de circulation ni de plaques.</p>
          <ul>
            <li>Le <b>détenteur</b> répond de manière <b>causale aggravée</b> (art. 58 LCR)&nbsp;: pas de preuve libératoire, seules la force majeure ou la faute grave du lésé ou d'un tiers peuvent exonérer.</li>
            <li>Le lésé dispose d'une <b>action directe</b> contre l'assureur.</li>
            <li>Les <b>exceptions du contrat ne sont pas opposables au lésé</b>&nbsp;: l'assureur indemnise, puis exerce un <b>recours</b> contre son assuré (ivresse, permis retiré, prime impayée, conduite non autorisée).</li>
            <li><b>Fonds national de garantie</b>&nbsp;: véhicules non identifiés ou non assurés. <b>Bureau national d'assurance</b>&nbsp;: véhicules étrangers.</li>
          </ul>`
        },
        {
          h: "Casco partielle et casco complète",
          html: `<table class="tbl">
            <tr><th>Risque</th><th>Casco partielle</th><th>Casco complète</th></tr>
            <tr><td>Vol</td><td>oui</td><td>oui</td></tr>
            <tr><td>Incendie</td><td>oui</td><td>oui</td></tr>
            <tr><td>Bris de glace</td><td>oui</td><td>oui</td></tr>
            <tr><td>Forces de la nature</td><td>oui</td><td>oui</td></tr>
            <tr><td>Collision avec un animal</td><td>oui</td><td>oui</td></tr>
            <tr><td><b>Collision dont le conducteur est responsable</b></td><td><b>non</b></td><td><b>oui</b></td></tr>
            <tr><td>Vandalisme</td><td>selon conditions</td><td>oui</td></tr>
          </table>
          <p>La casco complète comprend donc toujours la casco partielle. Elle est en pratique exigée en cas de <b>leasing</b> ou de financement.</p>`
        },
        {
          h: "Indemnisation et compléments",
          html: `<ul>
            <li><b>Base de calcul</b>&nbsp;: <b>valeur vénale</b>, souvent améliorée par une <b>clause de valeur à neuf</b> ou un barème dégressif pendant les premières années.</li>
            <li><b>Franchise</b>&nbsp;: fixe par sinistre, généralement plus élevée en casco complète&nbsp;; réduite ou supprimée pour le bris de glace réparé.</li>
            <li><b>Bonus-malus</b>&nbsp;: le degré évolue selon la sinistralité&nbsp;; certains contrats offrent une <b>protection du bonus</b>.</li>
            <li><b>Compléments</b>&nbsp;: dommages aux effets personnels, assistance/dépannage, protection juridique circulation, RC pour dommages au véhicule loué, indemnité en cas de perte totale.</li>
          </ul>`
        }
      ],
      keypoints: [
        "Seule la RC est obligatoire ; le détenteur répond causalement (art. 58 LCR).",
        "Action directe du lésé ; exceptions inopposables, puis recours contre l'assuré.",
        "Casco partielle = risques subis ; casco complète = + collision propre.",
        "Indemnisation à la valeur vénale, sauf clause de valeur à neuf.",
        "Fonds national de garantie = non assurés / non identifiés ; Bureau national = véhicules étrangers."
      ]
    },

    {
      id: 'c4',
      title: 'Responsabilité civile privée',
      resume: "Ce que couvre la RC privée, qui est assuré, et les exclusions qui font les litiges.",
      sections: [
        {
          h: "Fonction et cercle des assurés",
          html: `<p>La <b>RC privée</b> intervient lorsque l'assuré cause un dommage à un <b>tiers</b> dans le cadre de sa vie privée. Elle remplit deux fonctions&nbsp;:</p>
          <ul>
            <li><b>Active</b>&nbsp;: payer les prétentions justifiées&nbsp;;</li>
            <li><b>Passive</b>&nbsp;: <b>repousser</b> les prétentions injustifiées, en assumant la défense juridique.</li>
          </ul>
          <p>Sont en général assurés le preneur, les personnes vivant en ménage commun, les enfants mineurs, et le personnel de maison dans l'exercice de ses tâches.</p>`
        },
        {
          h: "Situations typiques couvertes",
          html: `<ul>
            <li>Dommages causés à des tiers dans la vie quotidienne (sport, loisirs, invités)&nbsp;;</li>
            <li><b>Dommages à la chose louée</b>&nbsp;: appartement, souvent avec une sous-limite&nbsp;;</li>
            <li>Responsabilité du <b>détenteur d'animaux</b> domestiques (art. 56 CO)&nbsp;;</li>
            <li>Responsabilité de <b>propriétaire d'immeuble</b> pour un logement occupé soi-même (art. 58 CO), selon les conditions&nbsp;;</li>
            <li>Dommages causés par les <b>enfants</b>, y compris lorsqu'ils sont incapables de discernement (couverture dite d'équité).</li>
          </ul>`
        },
        {
          h: "Les exclusions qui font les litiges",
          html: `<ul>
            <li><b>Dommages à ses propres biens</b> et à ceux des personnes du ménage commun&nbsp;;</li>
            <li>Dommages causés <b>intentionnellement</b>&nbsp;;</li>
            <li>Dommages liés à l'usage d'un <b>véhicule à moteur</b> (relèvent de la RC véhicule) ou d'un <b>bateau</b> soumis à assurance obligatoire&nbsp;;</li>
            <li>Dommages découlant d'une <b>activité professionnelle</b> ou lucrative&nbsp;;</li>
            <li>Amendes et sanctions pénales&nbsp;;</li>
            <li>Prétentions purement <b>contractuelles</b> (garantie, mauvaise exécution d'un contrat).</li>
          </ul>
          <p class="tip">Réflexe de conseil&nbsp;: dès qu'il y a activité professionnelle indépendante, la RC privée ne suffit plus&nbsp;— il faut une <b>RC d'entreprise ou professionnelle</b>.</p>`
        }
      ],
      keypoints: [
        "La RC privée paie le justifié et repousse l'injustifié (fonction passive).",
        "Assurés : preneur, ménage commun, enfants, personnel de maison.",
        "Dommages à la chose louée couverts, souvent avec sous-limite.",
        "Exclus : biens propres, intention, véhicules à moteur, activité professionnelle, amendes.",
        "Les enfants sans discernement peuvent être couverts par une clause d'équité."
      ]
    },

    {
      id: 'c5',
      title: "Responsabilité civile d'entreprise",
      resume: "RC exploitation, RC produits, RC professionnelle et responsabilité des organes.",
      sections: [
        {
          h: "RC exploitation et RC produits",
          html: `<ul>
            <li><b>RC exploitation</b>&nbsp;: dommages causés à des tiers du fait de l'activité, des locaux, des installations et du personnel (art. 55 CO pour les auxiliaires, art. 58 CO pour l'ouvrage).</li>
            <li><b>RC produits</b>&nbsp;: dommages causés par un produit défectueux après sa mise en circulation. La <b>LRFP</b> instaure une responsabilité <b>causale aggravée</b> du producteur, sans preuve de faute.</li>
            <li><b>Frais de retrait et de rappel</b> (recall)&nbsp;: extension importante, souvent limitée, qui finance le retrait du marché plutôt que le dommage lui-même.</li>
          </ul>`
        },
        {
          h: "RC professionnelle et D&O",
          html: `<ul>
            <li><b>RC professionnelle</b>&nbsp;: fautes de conseil ou d'exécution des professions de service (fiduciaires, architectes, médecins, <b>intermédiaires d'assurance non liés</b>, avocats). Elle couvre le <b>dommage purement patrimonial</b>, que la RC exploitation exclut en principe.</li>
            <li><b>D&amp;O</b>&nbsp;: responsabilité personnelle des administrateurs et directeurs pour leurs décisions de gestion.</li>
          </ul>
          <p>Rappel&nbsp;: la RC professionnelle est une <b>condition d'inscription au registre</b> pour l'intermédiaire non lié.</p>`
        },
        {
          h: "Notions techniques du contrat RC",
          html: `<ul>
            <li><b>Somme de garantie</b>&nbsp;: plafond par sinistre et par année d'assurance&nbsp;; <b>sous-limites</b> pour certains risques.</li>
            <li><b>Base de déclenchement</b>&nbsp;: en Suisse, la survenance du dommage (<i>loss occurrence</i>) est usuelle&nbsp;; les couvertures internationales recourent au <i>claims made</i>, où c'est la <b>réclamation</b> pendant la période d'assurance qui compte.</li>
            <li><b>Couverture subséquente</b>&nbsp;: prolongation du délai de déclaration après la fin du contrat.</li>
            <li><b>Territorialité</b>&nbsp;: attention aux marchés à forte exposition, notamment les États-Unis et le Canada, souvent exclus ou surtarifés.</li>
          </ul>`
        }
      ],
      keypoints: [
        "RC exploitation : dommages liés à l'activité, aux locaux et aux auxiliaires.",
        "RC produits : LRFP, responsabilité causale aggravée du producteur.",
        "RC professionnelle : couvre le dommage purement patrimonial ; obligatoire pour le courtier.",
        "Loss occurrence (survenance) vs claims made (réclamation).",
        "Vérifier somme de garantie, sous-limites, territorialité et couverture subséquente."
      ]
    },

    {
      id: 'c6',
      title: 'Assurances de choses des entreprises',
      resume: "Incendie et vol commerciaux, bris de machines, montage, transport et perte d'exploitation.",
      sections: [
        {
          h: "Choses et technique",
          html: `<ul>
            <li><b>Incendie / dommages naturels / vol / dégâts d'eau</b> sur bâtiments, marchandises, machines et aménagements.</li>
            <li><b>Bris de machines</b>&nbsp;: dommages soudains et imprévus à une machine, y compris erreur de manipulation, court-circuit, corps étranger — là où l'assurance incendie ne joue pas.</li>
            <li><b>Travaux de construction et montage</b>&nbsp;: protection de l'ouvrage pendant sa réalisation.</li>
            <li><b>Informatique / électronique</b>&nbsp;: matériel, données, frais de reconstitution.</li>
            <li><b>Transport</b>&nbsp;: marchandises en cours d'acheminement, quel que soit le responsable.</li>
          </ul>`
        },
        {
          h: "La perte d'exploitation",
          html: `<p>Elle indemnise, à la suite d'un <b>dommage matériel couvert</b>, la <b>marge brute</b> perdue et les <b>frais fixes</b> qui continuent de courir, pendant la <b>période d'indemnisation</b> convenue (souvent 12 à 24&nbsp;mois).</p>
          <ul>
            <li>Elle suppose un <b>sinistre matériel préalable</b> assuré&nbsp;: sans dommage à la chose, pas de prestation.</li>
            <li>La <b>somme d'assurance</b> se calcule sur la marge brute annuelle&nbsp;; une sous-estimation entraîne une réduction proportionnelle.</li>
            <li>Extensions utiles&nbsp;: <b>carence fournisseur</b>, <b>carence client</b>, interdiction d'accès par les autorités, panne d'énergie.</li>
          </ul>`
        },
        {
          h: "Analyse des besoins d'une PME",
          html: `<ol>
            <li>Inventorier les <b>valeurs</b>&nbsp;: bâtiment, contenu, machines, marchandises, données.</li>
            <li>Identifier le <b>sinistre maximal possible</b> et le temps de remise en marche.</li>
            <li>Vérifier les <b>responsabilités</b>&nbsp;: exploitation, produits, professionnelle, organes.</li>
            <li>Traiter les <b>pertes financières</b>&nbsp;: exploitation, carences, cyber.</li>
            <li>Contrôler les <b>obligations légales</b>&nbsp;: LAA, LPP, RC véhicules d'entreprise.</li>
            <li><b>Documenter</b> l'analyse et la recommandation.</li>
          </ol>`
        }
      ],
      keypoints: [
        "Bris de machines couvre le dommage soudain et imprévu, hors incendie.",
        "La perte d'exploitation exige un dommage matériel couvert au préalable.",
        "Somme = marge brute annuelle ; période d'indemnisation à convenir.",
        "Extensions : carence fournisseur et client, interdiction d'accès, panne d'énergie.",
        "L'analyse PME couvre valeurs, responsabilités, pertes financières et obligations légales."
      ]
    },

    {
      id: 'c7',
      title: 'Protection juridique, cyber et cautionnement',
      resume: "Les couvertures de patrimoine qui complètent le portefeuille non-vie.",
      sections: [
        {
          h: "Protection juridique",
          html: `<ul>
            <li><b>Circulation</b>&nbsp;: litiges liés à la conduite, au véhicule, aux sanctions administratives.</li>
            <li><b>Privée</b>&nbsp;: bail, travail, consommation, voisinage, assurances sociales, contrats.</li>
            <li><b>Entreprise</b>&nbsp;: droit du travail, contrats, recouvrement.</li>
          </ul>
          <p>Points sensibles&nbsp;: <b>délai de carence</b> à la conclusion, exclusion des litiges <b>préexistants</b>, <b>plafond de prise en charge</b> par cas, <b>libre choix de l'avocat</b> dans les cas prévus, et exigence que la démarche ne soit pas <b>dépourvue de chances de succès</b>.</p>`
        },
        {
          h: "Cyber",
          html: `<p>Couverture <b>hybride</b> qui combine&nbsp;:</p>
          <ul>
            <li><b>Frais propres</b>&nbsp;: analyse forensique, restauration des systèmes et des données, communication de crise, <b>perte d'exploitation d'origine cyber</b>, parfois rançon selon les conditions et le droit applicable&nbsp;;</li>
            <li><b>Responsabilité envers les tiers</b>&nbsp;: violation de données personnelles, prétentions de clients&nbsp;;</li>
            <li><b>Prestations d'assistance</b> et de prévention.</li>
          </ul>
          <p>La souscription exige un <b>questionnaire de sécurité</b> (sauvegardes, authentification à plusieurs facteurs, mises à jour)&nbsp;: le niveau de protection conditionne l'acceptation du risque.</p>`
        },
        {
          h: "Crédit, caution et voyage",
          html: `<ul>
            <li><b>Assurance-crédit</b>&nbsp;: insolvabilité des débiteurs commerciaux.</li>
            <li><b>Cautionnement / garantie</b>&nbsp;: l'assureur garantit l'exécution d'un engagement (garantie de soumission, de bonne exécution).</li>
            <li><b>Voyage</b>&nbsp;: frais d'annulation, assistance, rapatriement, bagages.</li>
            <li><b>Objets de valeur et œuvres d'art</b>&nbsp;: couverture tous risques sur liste estimée.</li>
          </ul>`
        }
      ],
      keypoints: [
        "Protection juridique : délai de carence, litiges préexistants exclus, plafond par cas.",
        "Le libre choix de l'avocat vaut dans les cas prévus par le contrat et la loi.",
        "Cyber : couverture hybride, frais propres + responsabilité envers les tiers.",
        "La souscription cyber dépend du niveau de sécurité informatique du client.",
        "Crédit et cautionnement protègent le patrimoine commercial."
      ]
    },

    {
      id: 'c8',
      title: 'Souscription et gestion des sinistres',
      resume: "Le métier au quotidien : analyse du risque, tarification et traitement d'un cas non-vie.",
      sections: [
        {
          h: "Souscrire un risque non-vie",
          html: `<ol>
            <li><b>Analyse des besoins</b> et relevé des valeurs.</li>
            <li><b>Appréciation du risque</b>&nbsp;: nature de l'activité, construction, protections, sinistralité passée.</li>
            <li><b>Décision</b>&nbsp;: acceptation, refus, ou acceptation <b>avec réserves</b> (surprime, franchise majorée, exclusion, obligation de prévention).</li>
            <li><b>Proposition</b>, puis <b>police</b>&nbsp;; information précontractuelle et documentation du conseil.</li>
          </ol>
          <p>Le tarif repose sur des <b>critères objectifs</b>&nbsp;: somme d'assurance, type de bâtiment, région, activité, franchise choisie, mesures de protection.</p>`
        },
        {
          h: "Traiter un sinistre : la trame",
          html: `<ol>
            <li><b>Le contrat était-il en vigueur&nbsp;?</b> Couverture non suspendue, prime payée.</li>
            <li><b>Le risque est-il couvert&nbsp;?</b> Événement conforme au risque assuré, absence d'exclusion précise et non équivoque (art. 33 LCA).</li>
            <li><b>Les obligations ont-elles été respectées&nbsp;?</b> Annonce, réduction du dommage, prévention.</li>
            <li><b>Y a-t-il une faute&nbsp;?</b> Faute grave&nbsp;: réduction possible&nbsp;; dessein&nbsp;: aucune prestation.</li>
            <li><b>Quel est le montant&nbsp;?</b> Base d'indemnisation, sous-assurance, franchise, sous-limites.</li>
            <li><b>Un recours est-il possible&nbsp;?</b> Subrogation contre le tiers responsable.</li>
          </ol>
          <p class="tip">C'est exactement la logique attendue dans le <b>traitement de cas guidé</b> de l'épreuve écrite non-vie&nbsp;: couverture, obligations, faute, calcul, recours.</p>`
        },
        {
          h: "Le profil Non-Vie de l'AFA",
          html: `<p>Le profil <b>Non-Vie</b> habilite à proposer et conclure des contrats <b>exclusivement dans le domaine non-vie</b>, à l'<b>exclusion de l'assurance-maladie complémentaire</b>, qui relève d'un profil distinct.</p>
          <p>L'examen écrit en ligne comporte&nbsp;: <b>30&nbsp;minutes</b> pour les compétences générales et l'assurance-maladie complémentaire, et <b>60&nbsp;minutes</b> pour la partie non-vie, qui combine un <b>traitement de cas guidé</b> et des questions de connaissance et de compréhension. La <b>recertification</b> intervient tous les <b>six ans</b>.</p>`
        }
      ],
      keypoints: [
        "Souscrire : analyser, apprécier, décider (accepter, refuser, ou avec réserves).",
        "Trame du sinistre : couverture → obligations → faute → montant → recours.",
        "Faute grave = réduction ; dessein = aucune prestation.",
        "Le profil Non-Vie exclut l'assurance-maladie complémentaire.",
        "Épreuve non-vie : 60 minutes, avec traitement de cas guidé ; recertification tous les 6 ans."
      ]
    }
  ];

  const SRC_VBV = { t: "AFA/VBV — Profil professionnel Intermédiaire d'assurance AFA", u: "https://www.vbv.ch/fr/qualifications/intermediaire-dassurance-afa" };
  const SRC_REG = { t: "AFA/VBV — Règlement d'examen sur les normes minimales (formation initiale et continue)", u: "https://www.vbv.ch/fileadmin/vbv/Dokumente/Mindeststands/Reglement_d_examen_normes_minimales_formation_initiale_et_formation_continue_intermediaires_d_assurance.pdf" };

  M.questions = [
    /* ---------- c1 : ménage ---------- */
    { id: 'm3c1q01', chap: 'c1', type: 'single',
      q: "Que couvre l'assurance inventaire du ménage ?",
      choices: ["Le bâtiment lui-même", "Les biens mobiliers des personnes vivant en ménage commun", "Uniquement les objets de valeur", "La responsabilité civile du propriétaire d'immeuble"],
      answer: [1],
      explain: "L'inventaire du ménage vise le mobilier au sens large : meubles, vêtements, appareils, provisions. Le bâtiment fait l'objet d'un contrat distinct." },

    { id: 'm3c1q02', chap: 'c1', type: 'multi',
      q: "Quelles couvertures composent typiquement une assurance ménage complète ?",
      choices: ["Incendie et dommages naturels", "Dégâts d'eau", "Vol par effraction", "Bris de glace", "Casco du véhicule"],
      answer: [0, 1, 2, 3],
      explain: "Le véhicule relève d'un contrat séparé. Le « paquet ménage » ajoute en outre le plus souvent la RC privée." },

    { id: 'm3c1q03', chap: 'c1', type: 'single',
      q: "Sur quelle base la somme d'assurance du ménage doit-elle être fixée ?",
      choices: ["Sur le prix d'achat historique des biens", "Sur la valeur de remplacement à neuf de la totalité de l'inventaire", "Sur la valeur vénale", "Sur le montant du loyer annuel"],
      answer: [1],
      explain: "C'est la valeur à neuf de l'ensemble qui compte : une somme inférieure déclenche la règle proportionnelle sur chaque sinistre." },

    { id: 'm3c1q04', chap: 'c1', type: 'single',
      q: "Un sac est dérobé dans un restaurant. Quelle couverture est concernée ?",
      choices: ["Le vol par effraction", "Le vol simple à l'extérieur", "Les dégâts d'eau", "La RC privée"],
      answer: [1],
      explain: "Hors du domicile et sans effraction, il s'agit du vol simple à l'extérieur : une extension facultative assortie d'une sous-limite propre." },

    { id: 'm3c1q05', chap: 'c1', type: 'single',
      q: "Inventaire valant CHF 120 000.–, assuré pour CHF 90 000.–. Dommage de CHF 12 000.–. Quelle indemnité avant franchise ?",
      choices: ["CHF 12 000.–", "CHF 9 000.–", "CHF 10 000.–", "CHF 6 000.–"],
      answer: [1],
      explain: "12 000 × (90 000 / 120 000) = CHF 9 000.–. La sous-assurance s'applique aussi aux sinistres partiels, ce qui surprend souvent les clients." },

    { id: 'm3c1q06', chap: 'c1', type: 'single',
      q: "À quoi sert une clause d'indexation en assurance ménage ?",
      choices: ["À réduire la prime chaque année", "À adapter la somme d'assurance au renchérissement pour éviter la sous-assurance", "À supprimer la franchise", "À couvrir la valeur d'affection"],
      answer: [1],
      explain: "Sans indexation, l'inflation crée insidieusement une sous-assurance : la somme convenue il y a dix ans ne suffit plus à remplacer l'inventaire." },

    { id: 'm3c1q07', chap: 'c1', type: 'single',
      q: "Un assuré laisse sa porte d'entrée non verrouillée et subit un vol. Quelle est la conséquence probable ?",
      choices: ["Aucune, le vol est couvert intégralement", "Une réduction pour faute grave, sauf clause de renonciation", "La nullité du contrat", "Une prétention frauduleuse"],
      answer: [1],
      explain: "Négliger une précaution élémentaire caractérise la faute grave : l'assureur peut réduire selon le degré de la faute, à moins d'avoir renoncé contractuellement à cette réduction." },

    { id: 'm3c1q08', chap: 'c1', type: 'multi',
      q: "Quels éléments méritent une attention particulière lors du conseil en assurance ménage ?",
      choices: ["Les sous-limites applicables aux objets de valeur", "L'actualisation de la somme après des achats importants", "L'annonce d'un changement d'adresse", "La couverture des enfants étudiant hors du domicile", "Le taux de conversion LPP"],
      answer: [0, 1, 2, 3],
      explain: "Le taux de conversion relève de la prévoyance professionnelle et n'a rien à voir avec l'assurance ménage." },

    { id: 'm3c1q09', chap: 'c1', type: 'single',
      q: "Un dégât d'eau provient d'une conduite d'eau rompue dans le mur. Quelle couverture intervient pour le mobilier abîmé ?",
      choices: ["L'assurance dégâts d'eau du ménage", "L'assurance incendie", "La RC privée du voisin", "Le bris de glace"],
      answer: [0],
      explain: "Le mobilier relève du contrat ménage ; les dégâts au bâtiment lui-même relèvent de l'assurance dégâts d'eau du bâtiment, souvent souscrite séparément." },

    { id: 'm3c1q10', chap: 'c1', type: 'single',
      q: "La garantie contre la sous-assurance proposée par certains assureurs signifie que :",
      choices: ["La somme d'assurance est illimitée", "L'assureur renonce à la règle proportionnelle si la somme suit son barème", "La franchise est supprimée", "Les objets de valeur sont couverts sans limite"],
      answer: [1],
      explain: "En contrepartie du respect de son barème d'estimation, l'assureur renonce à opposer la sous-assurance : une sécurité appréciable pour le client." },

    /* ---------- c2 : bâtiment ---------- */
    { id: 'm3c2q01', chap: 'c2', type: 'single',
      q: "Dans un canton doté d'un établissement cantonal d'assurance, qui assure l'incendie du bâtiment ?",
      choices: ["N'importe quel assureur privé", "L'établissement cantonal, en situation de monopole", "La Confédération", "La commune"],
      answer: [1],
      explain: "Dans 19 cantons, l'affiliation à l'ECA est obligatoire pour l'incendie et les dommages naturels du bâtiment." },

    { id: 'm3c2q02', chap: 'c2', type: 'single',
      q: "Que désigne l'acronyme GUSTAVO ?",
      choices: ["Les cantons dotés d'un monopole cantonal", "Les cantons où l'assurance du bâtiment relève des assureurs privés", "Un pool de réassurance", "Une norme de construction"],
      answer: [1],
      explain: "GE, UR, SZ, TI, AI, VS et OW n'ont pas d'établissement cantonal : le marché de l'assurance du bâtiment y est ouvert aux assureurs privés." },

    { id: 'm3c2q03', chap: 'c2', type: 'multi',
      q: "Quels événements relèvent des dommages naturels au sens de l'assurance du bâtiment ?",
      choices: ["Tempête et grêle", "Inondation et hautes eaux", "Avalanche et pression de la neige", "Glissement de terrain et chute de pierres", "Tremblement de terre"],
      answer: [0, 1, 2, 3],
      explain: "Le tremblement de terre est précisément l'exclusion classique : il exige une couverture spécifique ou l'intervention d'un pool." },

    { id: 'm3c2q04', chap: 'c2', type: 'multi',
      q: "Dans un canton à monopole, quelles couvertures un assureur privé peut-il encore proposer au propriétaire ?",
      choices: ["Les dégâts d'eau du bâtiment", "Le bris de glace du bâtiment", "La RC du propriétaire d'immeuble", "L'incendie du bâtiment", "Les installations techniques"],
      answer: [0, 1, 2, 4],
      explain: "Seuls l'incendie et les dommages naturels du bâtiment sont réservés à l'établissement cantonal ; tout le reste demeure au marché privé." },

    { id: 'm3c2q05', chap: 'c2', type: 'single',
      q: "Sur quelle base juridique la responsabilité du propriétaire d'immeuble repose-t-elle ?",
      choices: ["Art. 41 CO", "Art. 55 CO", "Art. 58 CO", "Art. 58 LCR"],
      answer: [2],
      explain: "L'art. 58 CO institue la responsabilité du propriétaire d'ouvrage pour les défauts de construction ou d'entretien, indépendamment de toute faute personnelle." },

    { id: 'm3c2q06', chap: 'c2', type: 'multi',
      q: "Quels frais supplémentaires convient-il de prévoir dans une assurance bâtiment ?",
      choices: ["Frais de déblaiement", "Perte de loyer", "Frais de relogement", "Amendes administratives", "Frais de démolition"],
      answer: [0, 1, 2, 4],
      explain: "Les amendes ne sont jamais assurables. Les autres postes peuvent représenter une part importante du coût total d'un sinistre." },

    { id: 'm3c2q07', chap: 'c2', type: 'single',
      q: "Un défaut d'entretien provoque des infiltrations progressives dans une toiture. Le dommage est-il couvert ?",
      choices: ["Oui, par l'assurance dommages naturels", "Non, l'usure et le défaut d'entretien sont exclus", "Oui, par l'assurance incendie", "Oui, par la RC privée"],
      answer: [1],
      explain: "L'assurance couvre des événements soudains et imprévus, non la dégradation prévisible résultant d'un entretien insuffisant : l'aléa fait défaut." },

    { id: 'm3c2q08', chap: 'c2', type: 'single',
      q: "Les panneaux solaires installés sur un toit sont assurés :",
      choices: ["Automatiquement dans toutes les polices", "Selon les conditions, comme installation technique du bâtiment, à annoncer", "Uniquement par l'assurance ménage", "Jamais"],
      answer: [1],
      explain: "Il s'agit d'une valeur significative ajoutée au bâtiment : elle doit être annoncée et intégrée à la somme d'assurance pour éviter la sous-assurance." },

    /* ---------- c3 : véhicules ---------- */
    { id: 'm3c3q01', chap: 'c3', type: 'single',
      q: "Quelle assurance est légalement obligatoire pour immatriculer un véhicule ?",
      choices: ["La casco complète", "La casco partielle", "La responsabilité civile du détenteur", "La protection juridique circulation"],
      answer: [2],
      explain: "Sans attestation d'assurance RC, ni permis de circulation ni plaques ne sont délivrés. Les couvertures casco restent facultatives." },

    { id: 'm3c3q02', chap: 'c3', type: 'single',
      q: "Un conducteur ivre cause un accident. L'assureur RC doit-il indemniser le lésé ?",
      choices: ["Non, la faute grave le libère", "Oui intégralement, puis il exerce un recours contre son assuré", "Oui, à hauteur de 50 %", "Non, c'est le Fonds national de garantie qui paie"],
      answer: [1],
      explain: "Les exceptions tirées du contrat ne sont pas opposables au lésé : la protection de la victime prime, et la sanction se règle ensuite par le recours." },

    { id: 'm3c3q03', chap: 'c3', type: 'multi',
      q: "Quels risques sont couverts par la casco partielle ?",
      choices: ["Vol du véhicule", "Incendie", "Bris de glace", "Collision avec un animal sauvage", "Collision dont le conducteur est responsable"],
      answer: [0, 1, 2, 3],
      explain: "La collision fautive n'est couverte que par la casco complète : c'est la distinction la plus testée de tout le domaine véhicules." },

    { id: 'm3c3q04', chap: 'c3', type: 'single',
      q: "Pourquoi la casco complète est-elle exigée en cas de leasing ?",
      choices: ["Parce que la loi l'impose", "Parce que le bailleur de leasing veut protéger la valeur du véhicule dont il reste propriétaire", "Parce que la RC ne couvre pas les tiers", "Pour réduire le droit de timbre"],
      answer: [1],
      explain: "Le véhicule garantit le financement : le donneur de leasing exige contractuellement une couverture des dommages au véhicule lui-même." },

    { id: 'm3c3q05', chap: 'c3', type: 'single',
      q: "Un véhicule de huit ans est détruit. Sur quelle base l'indemnité casco est-elle calculée en principe ?",
      choices: ["Valeur à neuf", "Valeur vénale", "Prix d'achat initial", "Somme assurée en RC"],
      answer: [1],
      explain: "La valeur vénale correspond au prix du marché de l'occasion. Les clauses de valeur à neuf ne s'appliquent généralement qu'aux premières années." },

    { id: 'm3c3q06', chap: 'c3', type: 'single',
      q: "Un véhicule non identifié endommage une voiture en stationnement et prend la fuite. Qui intervient si le détenteur lésé n'a pas de casco ?",
      choices: ["Le Bureau national d'assurance", "Le Fonds national de garantie", "La FINMA", "L'Ombudsman"],
      answer: [1],
      explain: "Le Fonds national de garantie couvre les dommages causés par des véhicules non identifiés ou non assurés ; le Bureau national traite les véhicules étrangers." },

    { id: 'm3c3q07', chap: 'c3', type: 'single',
      q: "Le système bonus-malus a pour effet :",
      choices: ["De modifier la prime selon la sinistralité du détenteur", "De supprimer la franchise après trois ans", "De garantir la valeur à neuf", "D'augmenter la somme de garantie RC"],
      answer: [0],
      explain: "Il individualise la prime en fonction du comportement effectif, ce qui limite l'aléa moral et récompense les conducteurs sans sinistre." },

    { id: 'm3c3q08', chap: 'c3', type: 'multi',
      q: "Quelles couvertures complémentaires peut-on proposer avec un contrat véhicule ?",
      choices: ["Assistance et dépannage", "Protection juridique circulation", "Effets personnels transportés", "Dommages au véhicule de location", "Assurance-vie du conducteur"],
      answer: [0, 1, 2, 3],
      explain: "L'assurance-vie relève d'un tout autre domaine et d'un autre profil de certification : elle ne fait pas partie des compléments d'un contrat véhicule." },

    { id: 'm3c3q09', chap: 'c3', type: 'single',
      q: "La responsabilité du détenteur au sens de l'art. 58 LCR est :",
      choices: ["Une responsabilité pour faute", "Une responsabilité causale simple avec preuve libératoire", "Une responsabilité causale aggravée", "Inexistante si le conducteur n'est pas le détenteur"],
      answer: [2],
      explain: "Aucune preuve libératoire n'est admise : seules la force majeure ou la faute grave du lésé ou d'un tiers peuvent rompre le lien de causalité." },

    { id: 'm3c3q10', chap: 'c3', type: 'single',
      q: "Un grêlon cabosse la carrosserie d'un véhicule. Quelle couverture intervient ?",
      choices: ["La RC véhicule", "La casco partielle", "Uniquement la casco complète", "Aucune"],
      answer: [1],
      explain: "La grêle fait partie des forces de la nature couvertes par la casco partielle, donc aussi par la casco complète qui l'englobe." },

    /* ---------- c4 : RC privée ---------- */
    { id: 'm3c4q01', chap: 'c4', type: 'single',
      q: "Quelle est la fonction dite passive de l'assurance RC privée ?",
      choices: ["Payer rapidement toutes les prétentions", "Repousser les prétentions injustifiées et assumer la défense juridique", "Réduire la prime en l'absence de sinistre", "Couvrir les dommages aux biens propres"],
      answer: [1],
      explain: "Cette protection juridique intégrée a une valeur économique considérable : elle évite à l'assuré de financer lui-même sa défense contre une réclamation infondée." },

    { id: 'm3c4q02', chap: 'c4', type: 'multi',
      q: "Qui est en principe assuré par une RC privée familiale ?",
      choices: ["Le preneur d'assurance", "Les personnes vivant en ménage commun", "Les enfants mineurs", "Le personnel de maison dans ses tâches", "Les collègues de travail du preneur"],
      answer: [0, 1, 2, 3],
      explain: "Le cercle des assurés suit le ménage, non les relations professionnelles ou amicales." },

    { id: 'm3c4q03', chap: 'c4', type: 'single',
      q: "Un locataire abîme le parquet de son appartement. Quelle couverture intervient ?",
      choices: ["L'assurance ménage", "La RC privée, couverture des dommages à la chose louée", "L'assurance bâtiment du propriétaire sans recours", "Aucune"],
      answer: [1],
      explain: "Les dommages à la chose louée constituent une garantie centrale de la RC privée, généralement assortie d'une sous-limite qu'il faut vérifier." },

    { id: 'm3c4q04', chap: 'c4', type: 'multi',
      q: "Quels dommages la RC privée exclut-elle ?",
      choices: ["Les dommages aux biens propres de l'assuré", "Les dommages causés intentionnellement", "Les dommages liés à l'usage d'un véhicule à moteur", "Les dommages découlant d'une activité professionnelle", "Les dommages causés à un ami en jouant au football"],
      answer: [0, 1, 2, 3],
      explain: "Un dommage causé à un tiers pendant une activité de loisir est au contraire le cas d'école de la RC privée." },

    { id: 'm3c4q05', chap: 'c4', type: 'single',
      q: "Un enfant de 4 ans, incapable de discernement, casse la vitrine d'un magasin. Que prévoit généralement la RC privée ?",
      choices: ["Rien, l'enfant n'est pas responsable", "Une prise en charge au titre d'une clause d'équité", "Une couverture uniquement si les parents ont commis une faute de surveillance", "Le renvoi vers la protection juridique"],
      answer: [1],
      explain: "Juridiquement l'enfant sans discernement n'est pas responsable, mais les contrats prévoient couramment une prise en charge par équité, ce qui évite des situations socialement inacceptables." },

    { id: 'm3c4q06', chap: 'c4', type: 'single',
      q: "Un assuré exerce une activité indépendante de conseil à domicile. Sa RC privée le couvre-t-elle ?",
      choices: ["Oui, puisqu'il travaille chez lui", "Non, l'activité professionnelle est exclue : il lui faut une RC professionnelle", "Oui, jusqu'à CHF 50 000.–", "Oui, s'il l'annonce après le sinistre"],
      answer: [1],
      explain: "C'est un réflexe de conseil essentiel : dès qu'une activité lucrative existe, la RC privée cesse de suffire, quel que soit le lieu d'exercice." },

    { id: 'm3c4q07', chap: 'c4', type: 'single',
      q: "Le chien de l'assuré mord un passant. Quelle base juridique fonde la responsabilité, et quelle couverture intervient ?",
      choices: ["Art. 41 CO, couvert par la protection juridique", "Art. 56 CO, couvert par la RC privée", "Art. 58 LCR, couvert par la RC véhicule", "Aucune responsabilité"],
      answer: [1],
      explain: "L'art. 56 CO institue une responsabilité causale simple du détenteur d'animaux ; la RC privée prend en charge les prétentions du lésé." },

    /* ---------- c5 : RC entreprise ---------- */
    { id: 'm3c5q01', chap: 'c5', type: 'single',
      q: "Que couvre la RC exploitation d'une entreprise ?",
      choices: ["Les dommages aux machines de l'entreprise", "Les dommages causés à des tiers du fait de l'activité, des locaux et du personnel", "Le manque à gagner de l'entreprise", "Les amendes administratives"],
      answer: [1],
      explain: "Les biens propres relèvent de l'assurance de choses et le manque à gagner de la perte d'exploitation ; les amendes ne sont jamais assurables." },

    { id: 'm3c5q02', chap: 'c5', type: 'single',
      q: "Sur quelle base repose la responsabilité du fait des produits ?",
      choices: ["Une responsabilité pour faute selon l'art. 41 CO", "La LRFP, responsabilité causale aggravée du producteur", "L'art. 55 CO", "Un simple engagement contractuel"],
      answer: [1],
      explain: "La LRFP protège le consommateur sans exiger la preuve d'une faute : il suffit d'établir le défaut, le dommage et le lien de causalité." },

    { id: 'm3c5q03', chap: 'c5', type: 'single',
      q: "Quelle couverture finance le retrait du marché d'un lot défectueux, avant tout dommage à des tiers ?",
      choices: ["La RC exploitation de base", "L'extension frais de retrait et de rappel", "La perte d'exploitation", "La protection juridique"],
      answer: [1],
      explain: "Le rappel est un coût propre à l'entreprise, distinct du dommage causé à des tiers : il exige une extension spécifique, généralement plafonnée." },

    { id: 'm3c5q04', chap: 'c5', type: 'single',
      q: "Quelle particularité distingue la RC professionnelle de la RC exploitation ?",
      choices: ["Elle ne couvre que les dommages corporels", "Elle couvre le dommage purement patrimonial, que la RC exploitation exclut en principe", "Elle est obligatoire pour toutes les entreprises", "Elle exclut les fautes de conseil"],
      answer: [1],
      explain: "Une erreur de conseil ne détruit ni bien ni personne : elle appauvrit le client. Seule la RC professionnelle répond de ce dommage purement financier." },

    { id: 'm3c5q05', chap: 'c5', type: 'single',
      q: "Que signifie une couverture RC en base « claims made » ?",
      choices: ["C'est la survenance du dommage qui déclenche la couverture", "C'est la réclamation formulée pendant la période d'assurance qui déclenche la couverture", "La couverture est illimitée dans le temps", "Le sinistre est réglé par un expert unique"],
      answer: [1],
      explain: "Cette base, courante à l'international, rend cruciale la couverture subséquente : sans elle, une réclamation tardive après la fin du contrat resterait sans protection." },

    { id: 'm3c5q06', chap: 'c5', type: 'multi',
      q: "Quels éléments faut-il vérifier dans un contrat RC d'entreprise ?",
      choices: ["La somme de garantie par sinistre et par année", "Les sous-limites applicables à certains risques", "La territorialité, notamment USA et Canada", "La couverture subséquente en base claims made", "Le taux de conversion LPP"],
      answer: [0, 1, 2, 3],
      explain: "Le taux de conversion relève de la prévoyance professionnelle : il n'a aucune incidence sur un contrat de responsabilité civile." },

    { id: 'm3c5q07', chap: 'c5', type: 'single',
      q: "Une assurance D&O protège :",
      choices: ["L'entreprise contre ses clients", "Les administrateurs et directeurs contre les prétentions liées à leurs décisions de gestion", "Les employés contre le licenciement", "Les actionnaires contre la baisse du cours"],
      answer: [1],
      explain: "La responsabilité des organes est personnelle et peut porter sur des montants considérables : la D&O couvre ce risque spécifique." },

    /* ---------- c6 : choses entreprises ---------- */
    { id: 'm3c6q01', chap: 'c6', type: 'single',
      q: "Que couvre l'assurance bris de machines ?",
      choices: ["Uniquement l'incendie des machines", "Les dommages soudains et imprévus à une machine, y compris erreur de manipulation et court-circuit", "L'usure normale", "La perte de production uniquement"],
      answer: [1],
      explain: "Elle intervient précisément là où l'assurance incendie ne joue pas : maladresse, court-circuit, corps étranger, défaut de matériau." },

    { id: 'm3c6q02', chap: 'c6', type: 'single',
      q: "Quelle condition est indispensable pour que l'assurance perte d'exploitation intervienne ?",
      choices: ["Une baisse du chiffre d'affaires, quelle qu'en soit la cause", "Un dommage matériel couvert ayant provoqué l'interruption", "Une décision de l'autorité", "Une faute d'un tiers"],
      answer: [1],
      explain: "C'est la règle centrale : sans dommage matériel assuré au préalable, la perte d'exploitation classique ne verse rien, même si l'activité s'est effectivement arrêtée." },

    { id: 'm3c6q03', chap: 'c6', type: 'single',
      q: "Sur quelle base la somme d'assurance de la perte d'exploitation se calcule-t-elle ?",
      choices: ["Sur le chiffre d'affaires net", "Sur la marge brute annuelle, augmentée des frais fixes", "Sur le bénéfice net", "Sur la valeur des machines"],
      answer: [1],
      explain: "Il s'agit de reconstituer ce que l'entreprise aurait dégagé : la marge brute couvre le bénéfice et les frais qui continuent de courir malgré l'arrêt." },

    { id: 'm3c6q04', chap: 'c6', type: 'multi',
      q: "Quelles extensions peuvent utilement compléter une perte d'exploitation ?",
      choices: ["Carence fournisseur", "Carence client", "Interdiction d'accès ordonnée par l'autorité", "Panne d'énergie", "Amendes fiscales"],
      answer: [0, 1, 2, 3],
      explain: "Ces extensions couvrent des interruptions dont la cause matérielle se situe hors de l'entreprise. Les amendes ne sont jamais assurables." },

    { id: 'm3c6q05', chap: 'c6', type: 'single',
      q: "L'assurance travaux de construction couvre principalement :",
      choices: ["Les retards de chantier", "Les dommages matériels survenant à l'ouvrage pendant sa réalisation", "La RC du maître d'ouvrage envers les voisins", "Les défauts de conception exclusivement"],
      answer: [1],
      explain: "Elle protège l'ouvrage en cours ; la responsabilité envers les voisins et les tiers fait l'objet d'une couverture RC distincte, souvent souscrite en parallèle." },

    { id: 'm3c6q06', chap: 'c6', type: 'single',
      q: "Une entreprise expédie des marchandises par la route. Quelle assurance protège la marchandise elle-même ?",
      choices: ["La RC du transporteur", "L'assurance transport de marchandises", "La perte d'exploitation", "L'assurance bris de machines"],
      answer: [1],
      explain: "L'assurance transport couvre la marchandise indépendamment de la responsabilité du transporteur, dont la RC est souvent plafonnée par le droit du transport." },

    { id: 'm3c6q07', chap: 'c6', type: 'multi',
      q: "Quelles étapes structurent l'analyse des besoins d'une PME ?",
      choices: ["Inventorier les valeurs", "Estimer le sinistre maximal possible et le temps de remise en marche", "Vérifier les responsabilités encourues", "Traiter les pertes financières", "Fixer le taux de commission du courtier"],
      answer: [0, 1, 2, 3],
      explain: "La rémunération de l'intermédiaire n'est pas une étape de l'analyse des besoins du client, même si elle doit lui être rendue transparente." },

    /* ---------- c7 : protection juridique, cyber ---------- */
    { id: 'm3c7q01', chap: 'c7', type: 'multi',
      q: "Quelles limites usuelles s'appliquent à une assurance protection juridique ?",
      choices: ["Un délai de carence après la conclusion", "L'exclusion des litiges déjà nés ou prévisibles", "Un plafond de prise en charge par cas", "L'exigence que la démarche ne soit pas dépourvue de chances de succès", "L'interdiction absolue de choisir son avocat"],
      answer: [0, 1, 2, 3],
      explain: "Le libre choix de l'avocat est au contraire garanti dans les cas prévus, notamment en cas de conflit d'intérêts ou de procédure judiciaire." },

    { id: 'm3c7q02', chap: 'c7', type: 'single',
      q: "Un client souscrit une protection juridique alors qu'un litige est déjà né avec son bailleur. Que se passe-t-il ?",
      choices: ["Le litige est couvert dès la signature", "Le litige préexistant est exclu", "Le litige est couvert après paiement de la première prime", "Le contrat est nul"],
      answer: [1],
      explain: "Assurer un litige déjà survenu supprimerait l'aléa : d'où l'exclusion des cas préexistants et le délai de carence à la conclusion." },

    { id: 'm3c7q03', chap: 'c7', type: 'multi',
      q: "Que comprend typiquement une assurance cyber pour PME ?",
      choices: ["Les frais d'analyse forensique et de restauration des données", "La perte d'exploitation d'origine cyber", "La responsabilité envers les tiers en cas de violation de données", "Les prestations d'assistance de crise", "Le remboursement des impôts"],
      answer: [0, 1, 2, 3],
      explain: "La cyber est une couverture hybride : elle finance à la fois les frais propres de l'entreprise et sa responsabilité envers les personnes lésées." },

    { id: 'm3c7q04', chap: 'c7', type: 'single',
      q: "Pourquoi un questionnaire de sécurité informatique est-il exigé avant de souscrire une couverture cyber ?",
      choices: ["Pour calculer le droit de timbre", "Parce que le niveau de protection conditionne l'appréciation et l'acceptation du risque", "Pour satisfaire la LBA", "Pour déterminer la valeur vénale"],
      answer: [1],
      explain: "Sauvegardes, authentification à plusieurs facteurs et mises à jour changent radicalement la probabilité de sinistre : c'est de la souscription au sens strict." },

    { id: 'm3c7q05', chap: 'c7', type: 'single',
      q: "L'assurance-crédit commerciale couvre :",
      choices: ["Le risque de non-paiement lié à l'insolvabilité des débiteurs", "Les intérêts hypothécaires du preneur", "Le vol d'espèces en caisse", "La perte d'un moyen de paiement"],
      answer: [0],
      explain: "Elle sécurise le poste clients, souvent l'un des actifs les plus importants et les plus fragiles du bilan d'une entreprise." },

    { id: 'm3c7q06', chap: 'c7', type: 'single',
      q: "Dans un cautionnement d'assurance, quel est le rôle de l'assureur ?",
      choices: ["Il indemnise son propre client", "Il garantit à un tiers l'exécution d'un engagement pris par son client", "Il rachète la créance", "Il remplace la banque du client"],
      answer: [1],
      explain: "Garantie de soumission ou de bonne exécution : l'assureur se porte garant envers le maître d'ouvrage, puis se retourne contre son client s'il doit payer." },

    /* ---------- c8 : souscription et sinistres ---------- */
    { id: 'm3c8q01', chap: 'c8', type: 'multi',
      q: "Quelles décisions un souscripteur peut-il prendre face à un risque proposé ?",
      choices: ["Accepter aux conditions normales", "Refuser le risque", "Accepter avec surprime ou franchise majorée", "Accepter en excluant un risque déterminé", "Modifier rétroactivement les sinistres passés"],
      answer: [0, 1, 2, 3],
      explain: "La souscription agit sur l'avenir du contrat : elle ne permet évidemment pas de revenir sur des sinistres déjà survenus." },

    { id: 'm3c8q02', chap: 'c8', type: 'single',
      q: "Quelle est la première question à se poser lors du traitement d'un sinistre ?",
      choices: ["Quel est le montant du dommage ?", "Le contrat était-il en vigueur et la couverture non suspendue ?", "Y a-t-il un recours possible ?", "Le client est-il satisfait ?"],
      answer: [1],
      explain: "Inutile de chiffrer un dommage si la couverture était suspendue pour non-paiement : la trame va de la validité du contrat au calcul, puis au recours." },

    { id: 'm3c8q03', chap: 'c8', type: 'single',
      q: "Dans quel ordre applique-t-on la règle proportionnelle et la franchise ?",
      choices: ["La franchise d'abord, puis la proportionnelle", "La proportionnelle d'abord, puis la franchise", "Les deux simultanément, au choix", "La franchise s'applique deux fois"],
      answer: [1],
      explain: "On réduit d'abord le dommage dans le rapport somme/valeur, puis on déduit la franchise du montant obtenu. L'ordre inverse avantagerait indûment l'assuré." },

    { id: 'm3c8q04', chap: 'c8', type: 'single',
      q: "Un assuré a violé une obligation contractuelle, mais sans aucune faute de sa part. Quelle sanction ?",
      choices: ["Réduction de moitié", "Aucune sanction (art. 45 LCA)", "Perte totale du droit", "Résiliation immédiate"],
      answer: [1],
      explain: "L'art. 45 LCA exclut la sanction lorsque la violation est sans faute ou n'a eu aucune influence sur la survenance ou l'étendue du sinistre." },

    { id: 'm3c8q05', chap: 'c8', type: 'multi',
      q: "Quels critères objectifs entrent dans la tarification d'un risque non-vie ?",
      choices: ["La somme d'assurance", "Le mode de construction et la situation géographique", "La nature de l'activité", "La franchise choisie et les mesures de protection", "La sympathie du client"],
      answer: [0, 1, 2, 3],
      explain: "La tarification doit reposer sur des critères objectifs et mesurables, faute de quoi elle expose l'assureur à l'antisélection." },

    { id: 'm3c8q06', chap: 'c8', type: 'single', lvl: 'src', src: SRC_VBV,
      q: "Le profil Non-Vie de l'AFA habilite l'intermédiaire à conclure des contrats :",
      choices: ["Dans toutes les branches, y compris l'assurance-vie", "Exclusivement dans le domaine non-vie, à l'exclusion de l'assurance-maladie complémentaire", "Uniquement en assurance de choses", "Uniquement pour les entreprises"],
      answer: [1],
      explain: "L'assurance-maladie complémentaire et l'assurance-vie relèvent de profils distincts ; le profil « toutes branches » réunit l'ensemble." },

    { id: 'm3c8q07', chap: 'c8', type: 'single', lvl: 'src', src: SRC_REG,
      q: "Combien de temps dure l'épreuve écrite en ligne consacrée à la partie non-vie ?",
      choices: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
      answer: [1],
      explain: "60 minutes pour la partie non-vie, contre 30 minutes pour les compétences générales et l'assurance-maladie complémentaire." },

    { id: 'm3c8q08', chap: 'c8', type: 'single', lvl: 'src', src: SRC_REG,
      q: "Que comporte l'épreuve écrite non-vie, outre les questions de connaissance ?",
      choices: ["Une dissertation", "Un traitement de cas guidé", "Un exposé oral enregistré", "Un travail de groupe"],
      answer: [1],
      explain: "Le traitement de cas guidé évalue la démarche complète : identifier la couverture, contrôler les obligations, apprécier la faute, calculer et envisager le recours." },

    { id: 'm3c8q09', chap: 'c8', type: 'single', lvl: 'src', src: SRC_REG,
      q: "Tous les combien la recertification de l'intermédiaire intervient-elle ?",
      choices: ["Tous les 2 ans", "Tous les 4 ans", "Tous les 6 ans", "Jamais"],
      answer: [2],
      explain: "La recertification a lieu tous les six ans, en complément de l'obligation continue de formation attestée par une plateforme reconnue." },

    { id: 'm3c8q10', chap: 'c8', type: 'single',
      q: "Un client déclare un sinistre couvert, mais l'expertise révèle que la somme d'assurance ne représente que 60 % de la valeur réelle. Quel est le premier réflexe ?",
      choices: ["Refuser toute prestation", "Appliquer la règle proportionnelle, puis la franchise", "Résilier le contrat", "Verser la somme d'assurance complète"],
      answer: [1],
      explain: "La sous-assurance n'exclut pas la prestation : elle la réduit dans le rapport entre la somme assurée et la valeur, avant déduction de la franchise." }
  ];

  window.AFA_MODULES = window.AFA_MODULES || [];
  window.AFA_MODULES.push(M);
})();
