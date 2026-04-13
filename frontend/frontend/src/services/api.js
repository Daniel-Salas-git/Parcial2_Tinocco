/**
 * API Service - Cliente HTTP centralizado
 * Maneja todas las llamadas al backend
 */

const API_BASE = '/api';

/**
 * Obtiene el token de localStorage
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Realiza una petición HTTP con autenticación
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('No autorizado');
  }

  return response;
}

// ============ AUTH ============

export const authService = {
  async login(usuario, password, recaptchaToken) {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, password, recaptchaToken })
    });
    return response.json();
  },

  async me() {
    const response = await request('/auth/me');
    return response.json();
  }
};

// ============ TICKETS ============

export const ticketService = {
  async crear(data) {
    const response = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { data: await response.arrayBuffer() };
  },

  async obtenerTodos() {
    const response = await request('/tickets');
    return response.json();
  },

  async buscar(params) {
    const query = new URLSearchParams(params).toString();
    const response = await request(`/tickets/buscar?${query}`);
    return response.json();
  },

  async actualizar(id, data) {
    const response = await request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async eliminar(id) {
    await request(`/tickets/${id}`, { method: 'DELETE' });
  },

  async cambiarEstatus(id, estatus) {
    const response = await request(`/tickets/${id}/estatus`, {
      method: 'PATCH',
      body: JSON.stringify({ estatus })
    });
    return response.json();
  },

  async obtenerCatalogos(tipo) {
    const response = await fetch(`${API_BASE}/catalogs/${tipo}`);
    return response.json();
  }
};

// ============ CATALOGOS ============

export const catalogService = {
  async obtenerTodos(tipo) {
    const response = await request(`/catalogs/${tipo}`);
    return response.json();
  },

  async crear(tipo, data) {
    const response = await request(`/catalogs/${tipo}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async actualizar(tipo, id, data) {
    const response = await request(`/catalogs/${tipo}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async eliminar(tipo, id) {
    await request(`/catalogs/${tipo}/${id}`, { method: 'DELETE' });
  }
};

// ============ STATS ============

export const statsService = {
  async obtener(municipioId = null) {
    const query = municipioId ? `?municipioId=${municipioId}` : '';
    const response = await request(`/stats${query}`);
    return response.json();
  }
};

export default {
  auth: authService,
  ticket: ticketService,
  catalog: catalogService,
  stats: statsService
};
