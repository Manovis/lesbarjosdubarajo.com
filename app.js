// Variables globales
let collectedBarjos = JSON.parse(
  localStorage.getItem("collected-barjos") || "[]"
);
let currentView = "current";

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", function () {
  updateStats();
  renderCollection();

  // Vérifier si on arrive via QR code
  const urlParams = new URLSearchParams(window.location.search);
  const barjoId = urlParams.get("barjo");

  if (barjoId && BARJOS_CONFIG[barjoId]) {
    collectBarjo(barjoId);
  }
});

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
}

// Afficher le Barjo actuellement scanné
function displayCurrentBarjo(barjoId, isNew = false) {
  const barjo = BARJOS_CONFIG[barjoId];
  const currentBarjoElement = document.getElementById("current-barjo");
  const photoUrl = getBarjoPhotoUrl(barjoId);

  currentBarjoElement.innerHTML = `
        <div class="barjo-photo rarity-${barjo.rarity}" onclick="openPhotoModal('${photoUrl}', '${barjo.name}', '${barjo.rarity}')">
            <img src="${photoUrl}" alt="${barjo.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='🤪';">
        </div>
        <div class="barjo-info">
            <div class="barjo-name">${barjo.name}</div>
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
document.addEventListener('keydown', function(e) {
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
document.getElementById('instructions').addEventListener('click', function(e) {
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