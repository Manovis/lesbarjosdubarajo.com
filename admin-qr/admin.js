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
  const baseUrl = document.getElementById("base-url").value;
  if (
    baseUrl &&
    baseUrl !== "https://votre-username.github.io/barjos-pokedex"
  ) {
    generateQRCodes();
  }
  loadCustomUrls();
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
