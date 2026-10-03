/* Glossaire et questions supplémentaires pour le quiz final. */
"use strict";

const GLOSSARY = [
  ["elec", "Ampère (A)", "Unité de courant électrique : 1 coulomb de charge qui passe chaque seconde."],
  ["elec", "Volt (V)", "Unité de tension : l'énergie fournie à chaque coulomb de charge (1 V = 1 J/C)."],
  ["elec", "Ohm (Ω)", "Unité de résistance électrique. 1 Ω laisse passer 1 A sous 1 V."],
  ["elec", "Watt (W)", "Unité de puissance : 1 joule par seconde."],
  ["elec", "Kilowattheure (kWh)", "Unité d'énergie : 1 000 W pendant une heure, soit 3,6 millions de joules."],
  ["elec", "Loi d'Ohm", "U = R × I. Relie tension, résistance et courant dans un conducteur."],
  ["elec", "Effet Joule", "Échauffement d'un conducteur traversé par un courant. Puissance perdue : R × I²."],
  ["elec", "Courant alternatif", "Courant qui change de sens périodiquement (50 fois par seconde en Europe)."],
  ["elec", "Courant continu", "Courant qui circule toujours dans le même sens (piles, batteries, panneaux solaires)."],
  ["elec", "Fréquence", "Nombre de cycles par seconde d'un courant alternatif, en hertz (Hz). 50 Hz en Europe."],
  ["elec", "Induction", "Apparition d'une tension dans un circuit soumis à un champ magnétique variable (Faraday)."],
  ["elec", "Alternateur", "Machine qui transforme une rotation en courant alternatif grâce à l'induction."],
  ["elec", "Transformateur", "Appareil qui élève ou abaisse une tension alternative avec deux bobines sur un noyau de fer."],
  ["elec", "Semi-conducteur", "Matériau (silicium) dont la conductivité est intermédiaire et contrôlable. Base de l'électronique."],
  ["elec", "Disjoncteur différentiel", "Protection qui coupe le courant si une fuite (souvent 30 mA) est détectée."],
  ["elec", "Délestage", "Coupure volontaire de consommateurs pour sauver l'équilibre du réseau."],
  ["elec", "Pilotable", "Se dit d'une source dont on peut décider la production (nucléaire, hydraulique, gaz…)."],
  ["nuc", "Nucléon", "Particule du noyau : proton ou neutron."],
  ["nuc", "Isotope", "Atomes d'un même élément (même Z) avec un nombre de neutrons différent."],
  ["nuc", "Interaction forte", "Force qui lie les nucléons entre eux, très intense mais de très courte portée."],
  ["nuc", "Radioactivité", "Transformation spontanée d'un noyau instable avec émission de rayonnement."],
  ["nuc", "Becquerel (Bq)", "Unité d'activité : une désintégration par seconde."],
  ["nuc", "Sievert (Sv)", "Unité de dose efficace : mesure l'effet biologique des rayonnements."],
  ["nuc", "Demi-vie", "Temps au bout duquel la moitié des noyaux radioactifs d'un échantillon s'est désintégrée."],
  ["nuc", "Défaut de masse", "Différence entre la masse des nucléons séparés et celle du noyau. Correspond à l'énergie de liaison."],
  ["nuc", "Fission", "Cassure d'un noyau lourd en deux noyaux plus légers, avec libération d'énergie et de neutrons."],
  ["nuc", "Fusion", "Réunion de deux noyaux légers en un noyau plus lourd, avec libération d'énergie."],
  ["nuc", "Fissile", "Se dit d'un noyau qui peut fissionner avec des neutrons lents (U-235, Pu-239)."],
  ["nuc", "Criticité", "État d'un réacteur où chaque fission en provoque exactement une autre (k = 1)."],
  ["nuc", "Modérateur", "Matériau qui ralentit les neutrons (eau, graphite) pour favoriser la fission."],
  ["nuc", "Barres de commande", "Crayons absorbant les neutrons, insérés dans le cœur pour contrôler ou stopper la réaction."],
  ["nuc", "Enrichissement", "Augmentation de la proportion d'U-235 dans l'uranium (de 0,7 % à 3–5 % pour les REP)."],
  ["nuc", "REP", "Réacteur à eau pressurisée. Le type de tous les réacteurs en service en France."],
  ["nuc", "Chaleur résiduelle", "Chaleur que continue de dégager le combustible après l'arrêt de la réaction."],
  ["nuc", "MOX", "Combustible mélangeant oxyde de plutonium et d'uranium appauvri."],
  ["nuc", "Échelle INES", "Échelle internationale de 0 à 7 qui classe la gravité des événements nucléaires."],
  ["nuc", "Plasma", "État de la matière très chaude où les électrons sont séparés des noyaux."],
  ["nuc", "Tokamak", "Chambre en forme d'anneau où un champ magnétique confine un plasma de fusion."]
];

const EXTRA_QUIZ = [
  { q: "Quelle est la tension efficace d'une prise en France ?", a: ["110 V", "230 V", "400 V", "12 V"], c: 1, why: "230 V en monophasé, 400 V entre phases en triphasé." },
  { q: "Quelle part de l'électricité française vient du nucléaire (2024) ?", a: ["Environ 25 %", "Environ 45 %", "Environ 67 %", "Environ 90 %"], c: 2, why: "Autour de deux tiers de la production." },
  { q: "Que contient le noyau d'hélium-4 ?", a: ["4 protons", "2 protons et 2 neutrons", "4 neutrons", "1 proton et 3 neutrons"], c: 1, why: "Z = 2, A = 4 : 2 protons et 2 neutrons. C'est aussi la particule α." },
  { q: "Quel est le rendement typique d'une centrale nucléaire ?", a: ["≈ 10 %", "≈ 33 %", "≈ 70 %", "≈ 99 %"], c: 1, why: "Environ un tiers de la chaleur devient de l'électricité, comme dans toute centrale à vapeur." },
  { q: "Qui a découvert l'induction électromagnétique ?", a: ["Edison", "Faraday", "Einstein", "Curie"], c: 1, why: "Michael Faraday, en 1831." },
  { q: "Quel combustible sera utilisé dans ITER ?", a: ["Uranium et plutonium", "Deutérium et tritium", "Charbon", "Hélium"], c: 1, why: "Deux isotopes de l'hydrogène : deutérium et tritium." }
];
