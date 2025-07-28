// Configuration des Barjos - FACILE À MAINTENIR !
// Pour ajouter un nouveau Barjo, ajoutez simplement une nouvelle entrée ici

const BARJOS_CONFIG = {
  alain: {
    name: "Alain",
    description: "Le plus costaud de tous les barjos.",
  },
  marvin: {
    name: "Marvin",
    description: "L'enfant de Tchernobyl",
  },
  thomas: {
    name: "Thomas",
    description: "Le roi du caca.",
  },
  guitou: {
    name: "Guitou",
    description: "Rare sont ceux qui l'ont vu sourire!",
  },
  jerem: {
    name: "Jerem",
    description: "Juste un BG.",
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

// Exemple pour ajouter un nouveau Barjo :
/*
"nouveau_barjo": {
    name: "Nom du Barjo",
    description: "Sa description rigolote et unique",
    photo: "URL_de_sa_photo_ou_images/nom_photo.jpg"
},
*/
