// Nouvelle version d'app.js utilisant l'API backend
class PokedexApp {
  constructor() {
    this.api = window.ApiService;
    this.currentView = 'current';
    this.isOnline = true; // Pour gérer le mode hors ligne plus tard
    
    this.init();
  }

  async init() {
    console.log('🚀 Initialisation du Pokédex des Barjos...');
    
    // Vérifier la connexion à l'API
    await this.checkApiConnection();
    
    // Initialiser l'interface
    this.initializeUI();
    
    // Charger les données initiales
    await this.loadInitialData();
  }

  async checkApiConnection() {
    try {
      const response = await this.api.getStats();
      console.log('✅ Connexion API réussie:', response);
      this.isOnline = true;
    } catch (error) {
      console.error('❌ Impossible de se connecter à l\'API:', error);
      this.isOnline = false;
      this.showErrorMessage('Connexion au serveur impossible. Mode hors ligne activé.');
    }
  }

  initializeUI() {
    // Event listeners pour la navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.getAttribute('onclick').match(/'(.+)'/)[1];
        this.showView(view);
      });
    });

    console.log('🎮 Interface utilisateur initialisée');
  }

  async loadInitialData() {
    if (!this.isOnline) {
      console.log('📱 Mode hors ligne - utilisation des données locales');
      return;
    }

    try {
      // Charger les statistiques
      await this.updateStats();
      
      // Charger la collection si on est sur cette vue
      if (this.currentView === 'collection') {
        await this.loadCollection();
      }
      
      console.log('📊 Données initiales chargées');
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      this.showErrorMessage('Erreur lors du chargement des données');
    }
  }

  async updateStats() {
    try {
      const response = await this.api.getStats();
      const stats = response.data;
      
      // Mettre à jour l'interface
      document.getElementById('collected-count').textContent = stats.collectedBarjos;
      document.getElementById('total-count').textContent = stats.totalBarjos;
      document.getElementById('completion-rate').textContent = `${stats.completionRate}%`;
      
      console.log('📈 Statistiques mises à jour:', stats);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des stats:', error);
    }
  }

  async loadCollection() {
    try {
      const allBarjosResponse = await this.api.getAllBarjos();
      const allBarjos = allBarjosResponse.data;
      
      this.displayCollectionGrid(allBarjos);
      
      console.log('📚 Collection chargée:', allBarjos.length, 'barjos');
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la collection:', error);
    }
  }

  displayCollectionGrid(barjos) {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';

    barjos.forEach(barjo => {
      const miniBarjo = document.createElement('div');
      miniBarjo.className = `mini-barjo ${barjo.isCollected ? 'collected' : 'missing'}`;
      
      if (barjo.isCollected) {
        miniBarjo.innerHTML = `
          <div style="font-size: 10px; font-weight: bold;">${barjo.name}</div>
        `;
        miniBarjo.addEventListener('click', () => this.showBarjoDetails(barjo));
      } else {
        miniBarjo.innerHTML = `
          <div style="font-size: 8px; opacity: 0.5;">???</div>
        `;
      }
      
      grid.appendChild(miniBarjo);
    });
  }

  async showBarjoDetails(barjo) {
    // Afficher les détails du barjo dans la vue actuelle
    this.displayCurrentBarjo(barjo);
    this.showView('current');
  }

  displayCurrentBarjo(barjo) {
    const currentBarjoElement = document.getElementById('current-barjo');
    
    currentBarjoElement.innerHTML = `
      <div class="barjo-photo">
        <img src="${barjo.photoUrl}" alt="${barjo.name}" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <span style="display: none;">👤</span>
      </div>
      <div class="barjo-info">
        <div class="barjo-name">${barjo.name}</div>
        <div class="barjo-description">${barjo.description}</div>
        ${barjo.isCollected ? `<div style="color: #ffd700; margin-top: 10px;">✅ Capturé le ${new Date(barjo.collectedAt).toLocaleDateString()}</div>` : ''}
      </div>
    `;
  }

  showView(viewName) {
    // Masquer toutes les vues
    document.getElementById('current-view').classList.toggle('hidden', viewName !== 'current');
    document.getElementById('collection-view').classList.toggle('hidden', viewName !== 'collection');
    
    // Mettre à jour les boutons de navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Activer le bon bouton
    const activeButton = Array.from(document.querySelectorAll('.nav-btn')).find(btn => 
      btn.getAttribute('onclick').includes(viewName)
    );
    if (activeButton) {
      activeButton.classList.add('active');
    }
    
    this.currentView = viewName;
    
    // Charger les données spécifiques à la vue
    if (viewName === 'collection') {
      this.loadCollection();
    }
    
    console.log('👁️ Vue changée:', viewName);
  }

  showErrorMessage(message) {
    // Créer un message d'erreur temporaire
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
      background: rgba(255, 0, 0, 0.2);
      border: 2px solid #ff0000;
      border-radius: 10px;
      padding: 15px;
      text-align: center;
      margin-bottom: 20px;
      animation: fadeIn 0.5s ease-in;
    `;
    errorDiv.innerHTML = `<strong>⚠️ ${message}</strong>`;
    
    // Insérer avant le contenu principal
    const container = document.querySelector('.pokedex-container');
    const header = document.querySelector('.header');
    container.insertBefore(errorDiv, header.nextSibling);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  showSuccessMessage(message) {
    const successElement = document.getElementById('success-message');
    successElement.innerHTML = `<strong>🎉 ${message.toUpperCase()} 🎉</strong>`;
    successElement.classList.remove('hidden');
    
    setTimeout(() => {
      successElement.classList.add('hidden');
    }, 3000);
  }

  // Méthode pour collecter un barjo (sera utilisée avec les QR codes plus tard)
  async collectBarjo(barjoId) {
    try {
      const response = await this.api.collectBarjo(barjoId);
      const barjo = response.data;
      
      this.showSuccessMessage(response.message || 'Nouveau Barjo capturé !');
      this.displayCurrentBarjo(barjo);
      await this.updateStats();
      
      console.log('🎉 Barjo collecté:', barjo);
      return barjo;
    } catch (error) {
      console.error('❌ Erreur lors de la collection:', error);
      this.showErrorMessage('Impossible de collecter ce Barjo');
    }
  }
}

// Initialiser l'application quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
  window.pokedexApp = new PokedexApp();
});

// Fonction globale pour la compatibilité avec les boutons HTML existants
window.showView = function(viewName) {
  if (window.pokedexApp) {
    window.pokedexApp.showView(viewName);
  }
};

console.log('📱 App.js chargé - Version API');