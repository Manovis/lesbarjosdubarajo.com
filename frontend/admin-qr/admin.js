// ===============================
// SYSTÈME D'AUTHENTIFICATION
// ===============================

// Hash SHA-256 sécurisé des identifiants
const CREDENTIALS_HASH = {
  username: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  password: "52eb52ea45b7ca58d5fceffe52d7ce0ff74a3c00c22406d71cfa61e8d1967dad",
};

// Fonction de hashage SHA-256
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Vérification de l'authentification
async function checkAuth(username, password) {
  const usernameHash = await sha256(username);
  const passwordHash = await sha256(password);

  return (
    usernameHash === CREDENTIALS_HASH.username &&
    passwordHash === CREDENTIALS_HASH.password
  );
}

// Afficher le contenu administrateur
function showAdminContent() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("admin-content").style.display = "block";
  document.getElementById("logout-btn").style.display = "block";

  // Initialiser le contenu admin
  const baseUrl = document.getElementById("base-url").value;
  if (baseUrl && baseUrl !== "https://lesbarjosdubarajo.com/admin-qr/") {
    generateQRCodes();
  }
  loadCustomUrls();
}

// Déconnexion
function logout() {
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    sessionStorage.removeItem("barjos-admin-authenticated");
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("admin-content").style.display = "none";
    document.getElementById("logout-btn").style.display = "none";

    // Réinitialiser le formulaire
    document.getElementById("login-form").reset();
    document.getElementById("error-message").style.display = "none";
  }
}

// Add event listener to logout button
document.getElementById("logout-btn").addEventListener("click", logout);

// ===============================
// GESTION DES QR CODES (CODE ORIGINAL)
// ===============================

// Variables globales
let customUrls = JSON.parse(localStorage.getItem("barjos-custom-urls") || "{}");
let qrHistory = JSON.parse(localStorage.getItem("barjos-qr-history") || "{}");

// Fonction pour adapter les chemins d'images pour l'admin
function getAdminBarjoPhotoUrl(barjoId) {
  // Pour l'admin, on référence les images du dossier parent
  for (let ext of IMAGE_EXTENSIONS) {
    const photoUrl = `../images/${barjoId}.${ext}`;
    return photoUrl;
  }
  return `../images/${barjoId}.jpg`; // Fallback par défaut
}

// Initialisation
window.onload = function () {
  // Vérifier l'authentification au chargement
  if (sessionStorage.getItem("barjos-admin-authenticated") === "true") {
    showAdminContent();
  } else {
    // Gestion du formulaire de login
    document
      .getElementById("login-form")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");
        const loginBtn = document.getElementById("login-btn");

        // Désactiver le bouton pendant la vérification
        loginBtn.disabled = true;
        loginBtn.textContent = "Vérification...";
        errorMessage.style.display = "none";

        try {
          const isValid = await checkAuth(username, password);

          if (isValid) {
            // Connexion réussie
            sessionStorage.setItem("barjos-admin-authenticated", "true");
            showAdminContent();
          } else {
            // Identifiants incorrects
            errorMessage.style.display = "block";
            document.getElementById("password").value = "";
          }
        } catch (error) {
          console.error("Erreur lors de l'authentification:", error);
          errorMessage.textContent = "❌ Erreur de connexion";
          errorMessage.style.display = "block";
        }

        // Réactiver le bouton
        loginBtn.disabled = false;
        loginBtn.textContent = "Se connecter";
      });
  }
};

function generateQRCodes() {
  const baseUrl = document.getElementById("base-url").value;
  const container = document.getElementById("qr-container");

  if (!baseUrl) {
    alert("Veuillez entrer l'URL de votre site !");
    return;
  }

  container.innerHTML = "";

  Object.keys(BARJOS_CONFIG).forEach((barjoId) => {
    const barjo = BARJOS_CONFIG[barjoId];
    const defaultUrl = `${baseUrl}?barjo=${barjoId}`;
    const currentUrl = customUrls[barjoId] || defaultUrl;

    // Vérifier si on a déjà généré ce QR code
    const isExistingQR =
      qrHistory[barjoId] && qrHistory[barjoId].url === currentUrl;
    let qrUrl;

    if (isExistingQR) {
      // Réutiliser l'URL du QR code existant
      qrUrl = qrHistory[barjoId].qrUrl;
      console.log(`♻️ QR code réutilisé pour ${barjo.name}`);
    } else {
      // Générer un nouveau QR code
      qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        currentUrl
      )}`;

      // Sauvegarder dans l'historique
      qrHistory[barjoId] = {
        url: currentUrl,
        qrUrl: qrUrl,
        generated: new Date().toISOString(),
      };
      localStorage.setItem("barjos-qr-history", JSON.stringify(qrHistory));
      console.log(`🆕 Nouveau QR code généré pour ${barjo.name}`);
    }

    const card = document.createElement("div");
    card.className = "qr-card";
    card.innerHTML = `
            <div class="status-badge ${
              customUrls[barjoId] ? "modified" : ""
            }" id="status-${barjoId}">
                ${customUrls[barjoId] ? "MODIFIÉ" : "DÉFAUT"}
            </div>
            <div class="barjo-name">${barjo.name}</div>
            <div class="qr-code">
                <img src="${qrUrl}" alt="QR Code ${
      barjo.name
    }" style="width: 200px; height: 200px;" id="qr-${barjoId}">
                <div class="photo-preview" onclick="openPhotoModal('${getAdminBarjoPhotoUrl(
                  barjoId
                )}', '${barjo.name}')">
                    <img src="${getAdminBarjoPhotoUrl(barjoId)}" alt="${
      barjo.name
    }" onerror="this.style.display='none';">
                    <div class="preview-overlay">👁️ Voir photo</div>
                </div>
            </div>
            <div class="edit-controls no-print">
                <button class="edit-btn" onclick="editUrl('${barjoId}')">✏️ Modifier URL</button>
                <button class="reset-btn" onclick="resetUrl('${barjoId}')">🔄 Reset</button>
            </div>
            <div 
                class="barjo-url ${customUrls[barjoId] ? "modified" : ""}" 
                contenteditable="true" 
                id="url-${barjoId}"
                onblur="updateUrl('${barjoId}')"
                onkeypress="handleEnterKey(event, '${barjoId}')"
            >${currentUrl}</div>
            <div style="font-size: 12px; color: #888; margin-top: 10px;">
                ${barjo.description}
            </div>
            <div style="font-size: 10px; color: #aaa; margin-top: 5px;">
                QR généré: ${
                  qrHistory[barjoId]
                    ? new Date(qrHistory[barjoId].generated).toLocaleString(
                        "fr-FR"
                      )
                    : "Maintenant"
                }
            </div>
        `;

    container.appendChild(card);
  });

  // Afficher un résumé dans la console
  console.log("🎯 État des QR codes:");
  Object.keys(BARJOS_CONFIG).forEach((barjoId) => {
    const barjo = BARJOS_CONFIG[barjoId];
    const currentUrl = customUrls[barjoId] || `${baseUrl}?barjo=${barjoId}`;
    const status = customUrls[barjoId] ? " (MODIFIÉE)" : "";
    const cached = qrHistory[barjoId] ? " [CACHE]" : " [NOUVEAU]";
    console.log(`${barjo.name}: ${currentUrl}${status}${cached}`);
  });
}

function editUrl(barjoId) {
  const urlElement = document.getElementById(`url-${barjoId}`);
  urlElement.focus();

  // Sélectionner tout le texte pour faciliter l'édition
  if (window.getSelection && document.createRange) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(urlElement);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function handleEnterKey(event, barjoId) {
  if (event.key === "Enter") {
    event.preventDefault();
    updateUrl(barjoId);
    document.getElementById(`url-${barjoId}`).blur();
  }
}

function updateUrl(barjoId) {
  const urlElement = document.getElementById(`url-${barjoId}`);
  const newUrl = urlElement.textContent.trim();
  const baseUrl = document.getElementById("base-url").value;
  const defaultUrl = `${baseUrl}?barjo=${barjoId}`;

  if (newUrl && newUrl !== defaultUrl) {
    customUrls[barjoId] = newUrl;
    urlElement.classList.add("modified");

    // Mettre à jour le badge de statut
    const statusBadge = document.getElementById(`status-${barjoId}`);
    statusBadge.textContent = "MODIFIÉ";
    statusBadge.classList.add("modified");

    // Régénérer le QR code avec la nouvelle URL
    const qrImg = document.getElementById(`qr-${barjoId}`);
    const newQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      newUrl
    )}`;
    qrImg.src = newQrUrl;

    // Mettre à jour l'historique
    qrHistory[barjoId] = {
      url: newUrl,
      qrUrl: newQrUrl,
      generated: new Date().toISOString(),
    };

    // Sauvegarder
    saveCustomUrls();
    localStorage.setItem("barjos-qr-history", JSON.stringify(qrHistory));

    console.log(
      `✏️ URL modifiée pour ${BARJOS_CONFIG[barjoId].name}: ${newUrl}`
    );
  } else if (newUrl === defaultUrl) {
    resetUrl(barjoId);
  }
}

function resetUrl(barjoId) {
  const baseUrl = document.getElementById("base-url").value;
  const defaultUrl = `${baseUrl}?barjo=${barjoId}`;

  delete customUrls[barjoId];

  const urlElement = document.getElementById(`url-${barjoId}`);
  urlElement.textContent = defaultUrl;
  urlElement.classList.remove("modified");

  // Mettre à jour le badge de statut
  const statusBadge = document.getElementById(`status-${barjoId}`);
  statusBadge.textContent = "DÉFAUT";
  statusBadge.classList.remove("modified");

  // Régénérer le QR code avec l'URL par défaut
  const qrImg = document.getElementById(`qr-${barjoId}`);
  const defaultQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    defaultUrl
  )}`;
  qrImg.src = defaultQrUrl;

  // Mettre à jour l'historique
  qrHistory[barjoId] = {
    url: defaultUrl,
    qrUrl: defaultQrUrl,
    generated: new Date().toISOString(),
  };

  // Sauvegarder
  saveCustomUrls();
  localStorage.setItem("barjos-qr-history", JSON.stringify(qrHistory));

  console.log(`🔄 URL réinitialisée pour ${BARJOS_CONFIG[barjoId].name}`);
}

function resetAllUrls() {
  if (
    confirm(
      "Êtes-vous sûr de vouloir réinitialiser toutes les URLs personnalisées ?"
    )
  ) {
    customUrls = {};
    qrHistory = {};
    localStorage.removeItem("barjos-custom-urls");
    localStorage.removeItem("barjos-qr-history");
    generateQRCodes();
    console.log("🔄 Toutes les URLs et le cache QR ont été réinitialisés");
  }
}

function exportUrls() {
  const baseUrl = document.getElementById("base-url").value;
  let urls = "📋 URLs des QR Codes - Les Barjos du Barajo\n";
  urls += "=".repeat(50) + "\n\n";

  Object.keys(BARJOS_CONFIG).forEach((barjoId) => {
    const barjo = BARJOS_CONFIG[barjoId];
    const currentUrl = customUrls[barjoId] || `${baseUrl}?barjo=${barjoId}`;
    const status = customUrls[barjoId] ? " (MODIFIÉE)" : "";
    urls += `${barjo.name}: ${currentUrl}${status}\n`;
  });

  urls += `\n📅 Généré le: ${new Date().toLocaleString("fr-FR")}\n`;

  navigator.clipboard
    .writeText(urls)
    .then(() => {
      alert("📋 URLs copiées dans le presse-papier !");
    })
    .catch(() => {
      // Fallback si clipboard API non disponible
      const textarea = document.createElement("textarea");
      textarea.value = urls;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("📋 URLs copiées dans le presse-papier !");
    });
}

function saveCustomUrls() {
  localStorage.setItem("barjos-custom-urls", JSON.stringify(customUrls));
}

function loadCustomUrls() {
  console.log(
    "💾 URLs personnalisées chargées:",
    Object.keys(customUrls).length
  );
  console.log("🏷️ QR codes en cache:", Object.keys(qrHistory).length);
}

// ===============================
// FONCTIONS MODALE PHOTO
// ===============================

function openPhotoModal(photoUrl, barjoName) {
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
            </div>
        `;
    document.body.appendChild(modal);
  }

  // Mettre à jour le contenu
  const modalImg = modal.querySelector(".modal-image");
  const modalTitle = modal.querySelector(".modal-title");

  modalImg.src = photoUrl;
  modalImg.alt = barjoName;
  modalTitle.textContent = barjoName;

  // Afficher la modale
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePhotoModal() {
  const modal = document.getElementById("photo-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Fermer avec Echap
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePhotoModal();
  }
});
