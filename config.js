// Configuration des Barjos

const BARJOS_CONFIG = {
  alain: {
    name: "Alain",
    description:
      "Le barjo le plus costaud, lui aussi il est tombé dans a la potion.",
    rarity: "common",
  },
  alex: {
    name: "Alex",
    description:
      "Certainement le barjo le plus lourd, si tu as vu un mec vider une bouteille de Get dans la bouche d'un autre, c'est certainement lui!",
    rarity: "uncommon",
  },
  axelle: {
    name: "Axelle",
    description:
      "Barjo legéndaire de type agoraphobe. Si vous la croisé, restez calme, sinon vous la ferez fuir!",
  rarity: "rare",
  },
  cecilia: {
    name: "Cecilia",
    description:
      "Si elle ne t'a pas encore enguelé, c'est que tu ne lui as pas encore parlé.",
  rarity: "common",      
  },
  david: {
    name: "David",
    description: "Mateu pour les intimes, la calotte de tes morts mon copain.",
    rarity: "uncommon",
  },
  elodie: {
    name: "Elo",
    description: "La barjo la plus à l'ouest, au sens propre comme au sens figuré.",
    rarity: "common",
  },
  eva: {
    name: "Eva",
    description: "Notre barjo la plus peace. Attention: fume des clopes après quelques verres.",
    rarity: "uncommon",
  },
  fefe: {
    name: "Fefe",
    description:
      "Le seul barjo gardois que l'on tolère. Si vous avez une envie de footing nocturne, n'hésitez pas.",
    rarity: "legendary",
  },
  florian: {
    name: "flo",
    description:
      "Le barjo le plus fou sans aucun doute, ses enfants l'ont bien calmés. Il a aussi des cuisses à la place des biceps.",
    rarity: "uncommon",
  },
  gael: {
    name: "Gael",
    description:
      "Si vous ne l'avez pas entendu râler c'est que vous ne lui avez pas encore parlé!",
    rarity: "legendary",
  },
  guitou: {
    name: "Guitou",
    description:
      "Rare sont ceux qui l'ont vu sourire, souvent en déplacement pour éteindre les incendies avec son énorme lance.",
    rarity: "common",
  },
  jeje: {
    name: "Jeje",
    description: "Toujours de bons conseils en matière de mécanique.",
    rarity: "common",
  },
  jerem: {
    name: "Jerem",
    description: "Juste un BG.",
    rarity: "common",
  },
  jr: {
    name: "JR",
    description:
      "Celui-ci les aimes mures alors mettez vos daronnes à l'abris.",
    rarity: "legendary",
  },
  marvin: {
    name: "Marvin",
    description:
      "L'enfant de Tchernobyl, pas d'inquiétude si tu le croise entrain d'imiter le penseur.",
    rarity: "common",
  },
  melodie: {
    name: "Mélodie",
    description:
      "La blonde originelle, 'Tu vas à Marrakech?! Mais tu devais aller au Maroc!'",
    rarity: "rare",
  },
  meras: {
    name: "Meras",
    description:
      "Ne le laissez jamais rentrer avant vous, il risque de vous laisser poiroter un moment...",
    rarity: "uncommon",
  },
  ophelie: {
    name: "Ophélie",
    description: "Les gens à l'ouest disent d'elle qu'elle est à l'ouest.",
    rarity: "common",
  },
  sandra: {
    name: "Sandra",
    description: "Pas vue sur Sète depuis des années, n'est-ce pas si mal?",
    rarity: "legendary",
  },
  tarrius: {
    name: "Tarrius",
    description: "",
    rarity: "uncommon",
  },
  thomas: {
    name: "Thomas",
    description:
      "Il a pris pour habitude de poser sa pêche un peu partout, et non il n'est pas maraicher.",
    rarity: "common",
  },
};

// Extensions d'images supportées (dans l'ordre de priorité)
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

// Fonction pour générer automatiquement le chemin de la photo
function getBarjoPhotoUrl(barjoId) {
  // Retourne le premier format d'image trouvé
  // Si aucune image n'est trouvée, l'attribut onerror du HTML prendra le relais
  for (let ext of IMAGE_EXTENSIONS) {
    const photoUrl = `images/${barjoId}.${ext}`;
    return photoUrl; // On retourne la première tentative, le navigateur essaiera automatiquement
  }
  return `images/${barjoId}.jpg`; // Fallback par défaut
}
