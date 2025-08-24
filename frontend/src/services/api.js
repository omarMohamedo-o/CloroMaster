import config from '../config/config';

class ApiService {
  constructor() {
    this.baseURL = config.api.baseURL;
    this.timeout = config.api.timeout;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Contact API methods
  async createContact(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getContacts() {
    return this.request('/contact');
  }

  async getContact(id) {
    return this.request(`/contact/${id}`);
  }

  async updateContact(id, updateData) {
    return this.request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteContact(id) {
    return this.request(`/contact/${id}`, {
      method: 'DELETE',
    });
  }

  async markContactAsRead(id) {
    return this.request(`/contact/${id}/mark-read`, {
      method: 'PUT',
    });
  }

  async getUnreadContacts() {
    return this.request('/contact/unread');
  }

  // Services API methods
  async getServices() {
    return this.request('/services');
  }

  async getService(id) {
    return this.request(`/services/${id}`);
  }

  async getServicesByCategory(category) {
    return this.request(`/services/category/${encodeURIComponent(category)}`);
  }

  async getCategories() {
    return this.request('/services/categories');
  }

  // Auth API methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async validateToken(token) {
    return this.request('/auth/validate', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
