// Variables globales
let collectedBarjos = JSON.parse(
  localStorage.getItem("collected-barjos") || "[]"
);
let currentView = "current";

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", function () {
  updateStats();
  renderCollection();
  updateAllRewards();

  // Vérifier si on arrive via QR code
  const urlParams = new URLSearchParams(window.location.search);
  const barjoId = urlParams.get("barjo");

  if (barjoId && BARJOS_CONFIG[barjoId]) {
    collectBarjo(barjoId);
  }
});

// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.submit-btn');
      const feedbackDiv = document.getElementById('formFeedback');

      // Désactiver le bouton pendant l'envoi
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';

      // Effacer les messages précédents
      feedbackDiv.innerHTML = '';

      try {
        // Préparer les données pour l'envoi
        const emailData = {
          to: 'barjodex.contact@gmail.com',
          subject: 'Nouveau message depuis le Barjodex',
          from: formData.get('email'),
          name: formData.get('nom'),
          message: formData.get('message')
        };

        await sendEmail(emailData);

        // Succès
        feedbackDiv.innerHTML = '<div class="form-success">✅ Votre message a été envoyé avec succès ! Nous vous répondrons rapidement.</div>';

        // Réinitialiser le formulaire
        contactForm.reset();

      } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        feedbackDiv.innerHTML = '<div class="form-error">❌ Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer.</div>';
      } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer le message';
      }
    });
  }
});

// Fonction d'envoi d'email (à adapter selon votre service)
async function sendEmail(emailData) {
  // Option 1: Avec EmailJS (recommandé pour le frontend)
  return emailjs.send('service_0qkqauo', 'template_pcuk4bk', {
    to_email: emailData.to,
    from_name: emailData.name,
    from_email: emailData.from,
    subject: emailData.subject,
    message: emailData.message
  });
}

// Fonction principale pour collecter un Barjo
function collectBarjo(barjoId) {
  const barjo = BARJOS_CONFIG[barjoId];
  if (!barjo) return;

  const isNewCollection = !collectedBarjos.includes(barjoId);

  if (isNewCollection) {
    collectedBarjos.push(barjoId);
    localStorage.setItem("collected-barjos", JSON.stringify(collectedBarjos));
    showSuccessMessage();
  }

  displayCurrentBarjo(barjoId, isNewCollection);
  updateStats();
  renderCollection();
  updateAllRewards();
}

// Afficher le Barjo actuellement scanné
function displayCurrentBarjo(barjoId, isNew = false) {
  const barjo = BARJOS_CONFIG[barjoId];
  const currentBarjoElement = document.getElementById("current-barjo");
  const photoUrl = getBarjoPhotoUrl(barjoId);

  let rarityTrad = "Légendaire";
  if(barjo.rarity == "common")
  {
    rarityTrad = "Commun";
  }
  else if(barjo.rarity == "uncommon")
  {
    rarityTrad = "Peu commun";
  }
  if(barjo.rarity == "rare")
  {
    rarityTrad = "Rare";
  }

  currentBarjoElement.innerHTML = `
        <div class="barjo-photo rarity-${barjo.rarity}" onclick="openPhotoModal('${photoUrl}', '${barjo.name}', '${barjo.rarity}')">
            <img src="${photoUrl}" alt="${barjo.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='🤪';">
        </div>
        <div class="barjo-info">
            <div class="barjo-name">${barjo.name} (${rarityTrad})</div>
            <div class="barjo-description">${barjo.description}</div>
        </div>
    `;

  if (isNew) {
    currentBarjoElement.classList.add("new");
    setTimeout(() => currentBarjoElement.classList.remove("new"), 2000);
  }
}

// Afficher le message de succès
function showSuccessMessage() {
  const message = document.getElementById("success-message");
  message.classList.remove("hidden");
  setTimeout(() => message.classList.add("hidden"), 3000);
}

// Mettre à jour les statistiques
function updateStats() {
  const totalCount = Object.keys(BARJOS_CONFIG).length;
  const collectedCount = collectedBarjos.length;
  const completionRate =
    totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;

  document.getElementById("collected-count").textContent = collectedCount;
  document.getElementById("total-count").textContent = totalCount;
  document.getElementById("completion-rate").textContent = completionRate + "%";
}

// Afficher la grille de collection
function renderCollection() {
  const grid = document.getElementById("collection-grid");
  grid.innerHTML = "";

  Object.keys(BARJOS_CONFIG).forEach((barjoId) => {
    const barjo = BARJOS_CONFIG[barjoId];
    const isCollected = collectedBarjos.includes(barjoId);
    const photoUrl = getBarjoPhotoUrl(barjoId);

    const miniBarjo = document.createElement("div");

    // CORRECTION: La classe de rareté est bien ajoutée
    miniBarjo.className = `mini-barjo ${isCollected ? "collected" : "missing"} rarity-${barjo.rarity}`;
    miniBarjo.innerHTML = `<img src="${photoUrl}" alt="${barjo.name}" style="width:100%;height:100%;border-radius:8px;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='✅';">`;

    if (isCollected) {
      miniBarjo.title = barjo.name;
      miniBarjo.onclick = (event) => {
        // Si on clique sur l'image, ouvrir la modale
        if (event.target.tagName === "IMG") {
          openPhotoModal(photoUrl, barjo.name, barjo.rarity, barjo.description);
        } else {
          // Sinon, afficher le Barjo
          displayCurrentBarjo(barjoId);
          showView("current");
        }
      };
    } else {
      miniBarjo.title = `Barjo manquant (${barjo.rarity})`;
    }

    grid.appendChild(miniBarjo);
  });
}

// Changer de vue (Actuel / Collection)
function showView(view) {
  // Update navigation
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));

  // CORRECTION: Utiliser le bon sélecteur pour les boutons
  const clickedBtn = event?.target || document.querySelector(`[onclick="showView('${view}')"]`);
  if (clickedBtn) {
    clickedBtn.classList.add("active");
  }

  // Show/hide views
  document
    .getElementById("current-view")
    .classList.toggle("hidden", view !== "current");
  document
    .getElementById("collection-view")
    .classList.toggle("hidden", view !== "collection");
  document
    .getElementById("rewards-view")
    .classList.toggle("hidden", view !== "rewards");

  currentView = view;
}

// ===============================
// FONCTIONS Popup
// ===============================
// Popup
let currentPage = 1;
const totalPages = 4;

// Affichage pop-up
const showPopup = (popupname) => {
  document.querySelectorAll('.overlay-popup').forEach(p =>
    p.classList.remove('active-popup')
  );
  document.getElementById(popupname).classList.add('active-popup');
  // Reset à la première page quand on ouvre
  goToPage(1);
};

const closePopup = (popupname) => {
  document.getElementById(popupname).classList.remove('active-popup');
};

// Fonctions de pagination
function changePage(direction) {
  const newPage = currentPage + direction;
  if (newPage >= 1 && newPage <= totalPages) {
    goToPage(newPage);
  }
}

function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages) return;

  // Masquer toutes les pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Afficher la page sélectionnée
  document.querySelector(`[data-page="${pageNumber}"]`).classList.add('active');

  // Mettre à jour les indicateurs
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index + 1 === pageNumber);
  });

  // Gérer les boutons précédent/suivant
  document.getElementById('prevBtn').disabled = pageNumber === 1;
  document.getElementById('nextBtn').disabled = pageNumber === totalPages;

  currentPage = pageNumber;
}

// Navigation au clavier
document.addEventListener('keydown', function (e) {
  if (document.querySelector('.overlay-popup.active-popup')) {
    if (e.key === 'ArrowLeft') {
      changePage(-1);
    } else if (e.key === 'ArrowRight') {
      changePage(1);
    } else if (e.key === 'Escape') {
      closePopup('instructions');
    }
  }
});

// Fermer en cliquant à l'extérieur
document.getElementById('instructions').addEventListener('click', function (e) {
  if (e.target === this) {
    closePopup('instructions');
  }
});

// ===============================
// FONCTIONS MODALE PHOTO
// ===============================
function openPhotoModal(photoUrl, barjoName, barjoRarity, barjoDescription) {
  // Créer la modale si elle n'existe pas
  let modal = document.getElementById("photo-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "photo-modal";
    modal.className = "photo-modal";
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="closePhotoModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closePhotoModal()">✕</button>
                <img class="modal-image" src="" alt="">
                <div class="modal-title"></div>
                <div class="modal-description"></div>
            </div>
        `;
    document.body.appendChild(modal);
  }

  // Mettre à jour le contenu
  const modalImg = modal.querySelector(".modal-image");
  const modalTitle = modal.querySelector(".modal-title");
  const modalDescr = modal.querySelector(".modal-description");

  modalImg.src = photoUrl;
  modalImg.alt = barjoName;
  modalDescr.textContent = barjoDescription;
  modalImg.className = `modal-image rarity-${barjoRarity}`; // CORRECTION: Ajouter la classe de rareté
  modalTitle.textContent = barjoName;

  // Afficher la modale
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Empêcher le scroll
}

function closePhotoModal() {
  const modal = document.getElementById("photo-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Rétablir le scroll
  }
}

// Fermer avec Echap
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePhotoModal();
  }
});

// Fonction pour compter les Barjos collectés par rareté
function getCollectedByRarity() {
  const counts = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0
  };

  collectedBarjos.forEach(barjoId => {
    const barjo = BARJOS_CONFIG[barjoId];
    if (barjo && barjo.rarity) {
      counts[barjo.rarity]++;
    }
  });

  return counts;
}

// Fonction pour mettre à jour toutes les récompenses
function updateAllRewards() {
  const counts = getCollectedByRarity();

  // Récompense communes (7 barjos communs)
  const commonReward = document.querySelector('.reward-item[data-type="common"]');
  if (commonReward) {
    updateRewardProgress(commonReward, counts.common, 7);
  }

  // Récompense peu communes (4 barjos peu communs) 
  const uncommonReward = document.querySelector('.reward-item[data-type="uncommon"]');
  if (uncommonReward) {
    updateRewardProgress(uncommonReward, counts.uncommon, 4);
  }

  // Récompense rare (1 barjo rare)
  const rareReward = document.querySelector('.reward-item[data-type="rare"]');
  if (rareReward) {
    updateRewardProgress(rareReward, counts.rare, 1);
  }

  // Récompense légendaire (1 barjo légendaire)
  const legendaryReward = document.querySelector('.reward-item[data-type="legendary"]');
  if (legendaryReward) {
    updateRewardProgress(legendaryReward, counts.legendary, 1);
  }
}

// Fonction pour mettre à jour la progression d'une récompense (existante, améliorée)
function updateRewardProgress(rewardElement, current, target) {
  const progressFill = rewardElement.querySelector('.progress-fill');
  const progressText = rewardElement.querySelector('.progress-text');
  const descriptionText = rewardElement.querySelector('.reward-description');
  const rewardCounter = rewardElement.querySelector('.reward-counter');

  const percentage = Math.min((current / target) * 100, 100);
  const angle = (percentage / 100) * 360;

  progressFill.style.setProperty('--progress-angle', `${angle}deg`);
  progressText.textContent = `${current}/${target}`;

  // Mettre à jour les attributs data pour garder trace
  rewardElement.setAttribute('data-current', current);

  if (current >= target) {
    rewardElement.classList.add('unlocked');
    descriptionText.textContent = '';
    progressText.textContent = '';
    rewardCounter.textContent = 'DÉBLOQUÉ ! 🎉 Viens chercher ta prime';
    rewardCounter.style.color = '#ffd700';
  } else {
    rewardElement.classList.remove('unlocked');
    rewardCounter.textContent = `Progression: ${Math.round(percentage)}%`;
    rewardCounter.style.color = '#ffd700';
  }
}

// Fonction pour afficher les statistiques de rareté (utile pour debug)
function showRarityStats() {
  const counts = getCollectedByRarity();
  console.log('📊 Statistiques de collection par rareté:');
  console.log(`🔸 Communs: ${counts.common}`);
  console.log(`🔹 Peu communs: ${counts.uncommon}`);
  console.log(`🔷 Rares: ${counts.rare}`);
  console.log(`👑 Légendaires: ${counts.legendary}`);
  return counts;
}

// Pour ajouter facilement des Barjos
function addBarjo(id, name, description, photoUrl) {
  console.log(`Pour ajouter ${name}, ajoutez ceci dans BARJOS_CONFIG:`);
  console.log(`"${id}": {
        name: "${name}",
        description: "${description}",
        photo: "${photoUrl}"
    },`);
  console.log(
    `QR Code URL: ${window.location.origin}${window.location.pathname}?barjo=${id}`
  );
}

// Fonction pour générer les URLs des QR codes
function generateQRUrls() {
  console.log("URLs pour les QR codes:");
  Object.keys(BARJOS_CONFIG).forEach((barjoId) => {
    console.log(
      `${BARJOS_CONFIG[barjoId].name}: ${window.location.origin}${window.location.pathname}?barjo=${barjoId}`
    );
  });
}

// Commandes utiles pour la console
console.log("🎮 Commandes disponibles:");
console.log("- generateQRUrls(): Affiche toutes les URLs pour les QR codes");
console.log(
  "- addBarjo(id, name, description, photoUrl): Aide à ajouter un nouveau Barjo"
);
console.log("- localStorage.clear(): Reset la collection (pour les tests)");

// Affichage automatique des instructions à la première visite
const checkFirstVisit = () => {
  const hasVisited = localStorage.getItem('barjos-first-visit');

  if (!hasVisited) {
    // Marquer comme visité
    localStorage.setItem('barjos-first-visit', 'true');

    // Afficher les instructions après un court délai
    setTimeout(() => {
      showPopup('instructions');
    }, 500);
  }
};

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', checkFirstVisit);