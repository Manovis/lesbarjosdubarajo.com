// Configuration de l'API
const API_CONFIG = {
  baseURL: 'http://localhost:3001/api', // URL du backend en développement
  // baseURL: 'https://ton-backend-url.com/api', // URL de production à configurer plus tard
};

// Classe pour gérer les appels API
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  // Méthode générique pour faire des requêtes HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Méthodes spécifiques pour les barjos
  async getAllBarjos() {
    return this.request('/barjos');
  }

  async getBarjo(id) {
    return this.request(`/barjos/${id}`);
  }

  async getStats() {
    return this.request('/barjos/stats');
  }

  async getCollection() {
    return this.request('/barjos/collection');
  }

  async collectBarjo(id) {
    return this.request(`/barjos/${id}/collect`, {
      method: 'POST',
    });
  }

  async uncollectBarjo(id) {
    return this.request(`/barjos/${id}/uncollect`, {
      method: 'POST',
    });
  }

  async createBarjo(barjoData) {
    return this.request('/barjos', {
      method: 'POST',
      body: JSON.stringify(barjoData),
    });
  }

  async updateBarjo(id, barjoData) {
    return this.request(`/barjos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(barjoData),
    });
  }

  async deleteBarjo(id) {
    return this.request(`/barjos/${id}`, {
      method: 'DELETE',
    });
  }
}

// Instance globale du service API
const apiService = new ApiService();

// Export pour utilisation dans d'autres fichiers
window.ApiService = apiService;