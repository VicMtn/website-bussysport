/**
 * Forme & Santé — notes du comité.
 * Rien ici n'est un avis de professionnel de santé : uniquement des habitudes
 * que les membres du comité se transmettent autour des séances.
 */
export const disclaimer = {
  title: "Expérience du comité, pas un avis de professionnel",
  text: "Ces pages décrivent ce que les membres du comité pratiquent eux-mêmes. Aucun d'entre nous n'est professionnel de santé, diététicien ou préparateur. Ce n'est ni un conseil médical, ni un programme nutritionnel, ni une méthode de rééducation. En cas de douleur, de pathologie ou de doute, adressez-vous à un médecin ou à un professionnel qualifié.",
  short:
    "Écrit par le comité, à partir de notre pratique. Aucun de nous n'est professionnel de santé.",
};

export const topics = [
  {
    slug: "nutrition",
    path: "/forme-sante/nutrition",
    label: "Nutrition",
    title: "Nutrition",
    icon: "fa-utensils",
    blurb:
      "Ce qu'on mange et ce qu'on boit avant, pendant et après une séance. Nos habitudes, pas un plan alimentaire.",
    lead: "On n'a pas de régime ni de menu type. Voici ce qu'on a remarqué en s'entraînant ensemble à Bussigny, et ce qu'on se dit entre membres du comité quand quelqu'un demande « vous mangez quoi avant de courir ? ».",
    description:
      "Habitudes alimentaires des membres du comité BussySport autour des séances. Retour d'expérience : aucun de nous n'est professionnel de santé.",
    sections: [
      {
        title: "Avant de bouger",
        intro:
          "Le timing change selon l'heure de la séance et selon chacun. On ne se copie pas à la lettre.",
        items: [
          {
            title: "Un repas simple, pas un repas lourd",
            text: "Quand on a le temps, on mange deux à trois heures avant : pain, riz, pâtes, un fruit, un yaourt. On évite le plat copieux juste avant une sortie ou une séance de cross.",
          },
          {
            title: "Séance tôt le matin",
            text: "Certains partent après une banane ou une tartine, d'autres pour une sortie courte sans avoir mangé. On s'écoute. Si on a l'estomac qui tire ou la tête vide, on rentre au pas et on mange.",
          },
        ],
      },
      {
        title: "Boire",
        intro: "C'est le point sur lequel on est le plus constant.",
        items: [
          {
            title: "Une gourde au rendez-vous",
            text: "On part avec de l'eau. En été, ou quand la sortie s'allonge, on la remplit avant de quitter le point de rendez-vous.",
          },
          {
            title: "Après l'effort",
            text: "On boit avant de se quitter, surtout quand il a fait chaud. On ne se force pas à finir une grande bouteille d'un coup.",
          },
        ],
      },
      {
        title: "Le repas d'après",
        intro:
          "On a faim, et on mange un repas normal. Le comité ne demande à personne de se restreindre après l'effort.",
        items: [
          {
            title: "Une assiette ordinaire",
            text: "Chez nous, ça ressemble souvent à des féculents, quelque chose de salé qui tient au corps — œufs, fromage, légumineuses, viande, poisson ou tofu — et des légumes quand on en a à la maison.",
          },
          {
            title: "Pas de commentaire sur l'assiette",
            text: "On ne pèse personne et on ne juge pas ce que les autres mangent. Le sport du comité reste un moment ensemble, pas un contrôle.",
          },
        ],
      },
      {
        title: "Ce qu'on ne recommande pas",
        intro:
          "Comme aucun de nous n'est professionnel, on s'interdit quelques sujets.",
        items: [
          {
            title: "Pas de compléments, pas de poudre, pas de régime",
            text: "On ne conseille ni poudres, ni gélules, ni menu « spécial sport », ni objectif de poids. Si quelqu'un veut un suivi, on l'oriente vers un professionnel, pas vers l'avis d'un membre du comité.",
          },
        ],
      },
    ],
  },
  {
    slug: "exercices",
    path: "/forme-sante/exercices",
    label: "Exercices",
    title: "Exercices",
    icon: "fa-dumbbell",
    blurb:
      "Les mouvements au poids du corps qu'on reprend souvent entre nous, et la façon dont on les adapte.",
    lead: "Quand on n'est pas en sortie running ou sur les barres, on revient à quelques mouvements qu'on connaît assez pour les montrer à un nouveau membre. Ce n'est pas un programme : c'est le petit circuit qu'on fait sur l'herbe, après s'être échauffés.",
    description:
      "Mouvements au poids du corps pratiqués par le comité BussySport. Description de notre façon de faire, pas un programme d'entraîneur.",
    sections: [
      {
        title: "Avant de commencer",
        intro:
          "On ne démarre pas à froid. Voici l'échauffement qu'on fait vraiment.",
        items: [
          {
            title: "Deux ou trois minutes tranquilles",
            text: "Marche rapide ou petit jogging très léger, le temps de sentir qu'on est arrivés.",
          },
          {
            title: "Quelques mouvements lents",
            text: "Cercles d'épaules, montées de genoux sur place, puis quelques squats sans chercher à descendre bas. On parle encore en le faisant.",
          },
        ],
      },
      {
        title: "Les mouvements qu'on reprend",
        ordered: true,
        intro:
          "On les fait dans cet ordre. Entre chaque mouvement, on marche quelques pas. Si la forme se dégrade, on s'arrête : finir la série n'est pas le but.",
        items: [
          {
            title: "Squat",
            text: "Pieds à peu près largeur des épaules, on descend comme pour s'asseoir, genoux dans l'axe des pieds. On garde le dos aussi long qu'on peut. Si les genoux tirent, on réduit l'amplitude et on ne descend pas « quand même ». Chez nous, une série tient souvent entre huit et douze répétitions, puis on souffle.",
          },
          {
            title: "Fente",
            text: "Un grand pas, le genou arrière descend vers le sol sans le taper. Plusieurs d'entre nous ont commencé en se tenant à une chaise, un arbre ou un poteau. L'équilibre vient après, pas l'inverse.",
          },
          {
            title: "Pompe",
            text: "Mains sous les épaules. La version qu'on propose en premier, c'est les genoux au sol. On s'arrête dès que le bas du dos se creuse. Mieux vaut moins de répétitions propres qu'une longue série avachie.",
          },
          {
            title: "Gainage",
            text: "Appui sur les avant-bras et les pieds, ou sur les genoux. On serre le ventre et on continue de respirer, sans bloquer l'air. On tient le temps qu'on tient bien — souvent autour de vingt secondes — puis on pose.",
          },
          {
            title: "Montées de genoux",
            text: "Sur place, à un rythme où on peut encore dire une phrase. Une trentaine de secondes, puis on marche. C'est notre façon de remettre un peu de souffle dans le circuit, sans en faire une course.",
          },
        ],
      },
      {
        title: "Comment on s'organise",
        intro: "Rien n'est chronométré au sifflet.",
        items: [
          {
            title: "Deux ou trois tours",
            text: "On enchaîne en général deux ou trois passages, avec une marche entre les tours. Quelqu'un d'essoufflé marche. Quelqu'un qui débute reste sur les versions les plus simples. On ne « rattrape » pas les autres.",
          },
          {
            title: "On montre, on ne corrige pas comme un coach",
            text: "Un membre du comité peut montrer comment il place ses pieds. On ne pose pas de diagnostic et on n'insiste pas si la personne préfère s'arrêter.",
          },
        ],
      },
    ],
  },
  {
    slug: "etirements",
    path: "/forme-sante/etirements",
    label: "Étirements",
    title: "Étirements",
    icon: "fa-person",
    blurb:
      "Les étirements qu'on fait en fin de sortie, le temps de se quitter sans repartir raides.",
    lead: "En fin de sortie running ou de cross, on prend quelques minutes avant de se dire au revoir. On étire ce qu'on a senti travailler. On ne cherche pas à aller loin : une tension douce, jamais une douleur.",
    description:
      "Étirements que les membres du comité BussySport font en fin de séance. Pratique partagée, pas un protocole de rééducation.",
    sections: [
      {
        title: "Quand on les fait",
        intro: "Après l'effort, une fois le souffle revenu.",
        items: [
          {
            title: "D'abord marcher",
            text: "On revient au calme en marchant ou en respirant tranquillement. On n'étire pas en arrivant encore essoufflés au point de rendez-vous.",
          },
          {
            title: "Quelques minutes, pas une séance à part",
            text: "Ça tient dans le temps qu'on passe encore ensemble. On ne transforme pas la fin de sortie en atelier.",
          },
        ],
      },
      {
        title: "Ce qu'on se rappelle",
        intro:
          "Trois réflexes qu'on se répète, surtout quand un nouveau est là.",
        items: [
          {
            title: "Environ vingt secondes",
            text: "On tient la position le temps de quelques respirations, souvent autour de vingt secondes, sans à-coups et sans rebond.",
          },
          {
            title: "On relâche si ça pique",
            text: "Une gêne forte, une piqûre ou une articulation qui tire : on relâche tout de suite. On ne « pousse pas un peu plus » pour faire comme le voisin.",
          },
          {
            title: "Pas de comparaison",
            text: "La souplesse n'est pas un classement. On ne commente pas qui descend plus bas.",
          },
        ],
      },
      {
        title: "Les positions qu'on connaît",
        ordered: true,
        intro:
          "Celles qu'un membre du comité peut montrer sans hésiter, dans l'ordre où on les enchaîne en fin de sortie. On les fait des deux côtés.",
        items: [
          {
            title: "Mollet",
            text: "Face à un mur, un arbre ou un poteau, mains en appui. La jambe arrière reste tendue, le talon au sol, le pied avant un peu fléchi. On sent l'arrière de la jambe, on ne cherche pas à coller le bassin au support.",
          },
          {
            title: "Avant de la cuisse",
            text: "Debout, on ramène un pied vers la fesse en tenant la cheville, l'autre main sur un support ou sur quelqu'un. Les genoux restent proches l'un de l'autre. Si l'équilibre manque, on garde la main sur l'appui : c'est comme ça que la plupart d'entre nous ont commencé.",
          },
          {
            title: "Arrière de la cuisse",
            text: "Un pied posé sur un banc bas ou un muret, la jambe presque tendue. Le dos reste long, on se penche depuis les hanches plutôt qu'en arrondissant le dos. On s'arrête dès que ça tire derrière le genou.",
          },
          {
            title: "Hanche",
            text: "Assis, une cheville posée sur le genou opposé, le dos redressé. On avance un peu le buste si on sent la fesse, sans s'écrouler sur la jambe. Après une sortie avec du dénivelé, c'est souvent celle qu'on garde.",
          },
          {
            title: "Poitrine et épaules",
            text: "Après les pompes ou le street workout, on ouvre la poitrine : mains croisées dans le dos, ou un avant-bras posé contre un mur, le buste qui tourne doucement. On respire. On ne force pas l'épaule vers l'arrière.",
          },
        ],
      },
    ],
  },
];

export function getTopic(slug) {
  return topics.find((topic) => topic.slug === slug);
}

export function getOtherTopics(slug) {
  return topics.filter((topic) => topic.slug !== slug);
}
