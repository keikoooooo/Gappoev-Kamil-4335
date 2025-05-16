import axios from 'axios';

const API_URL = 'https://kursach-x398.onrender.com/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для добавления accessToken к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик для обновления токена при истечении
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}auth/refresh`, { refreshToken }, {
          headers: { 'Content-Type': 'application/json' },
        });
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getDorms = async () => {
  try {
    const response = await api.get('/dormitories');
    return response.data;
  } catch (error) {
    console.error('Ошибка при запросе общежитий:', error);
    throw error;
  }
};

export const getProds = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка при запросе товаров:', error);
    throw error;
  }
};

export const getProductsForModeration = async () => {
  try {
    const response = await api.get('/products', { params: { moderation: true } });
    return response.data.items || [];
  } catch (error) {
    console.error('Ошибка при запросе товаров для модерации:', error);
    throw error;
  }
};

export const approveProduct = async (productId) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_URL}products/${productId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении товара:', error);
    throw error;
  }
};

export const createProd = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    throw error;
  }
};
export const getUserMe = async () => {
  const token = localStorage.getItem('accessToken'); // Предполагаем, что токен хранится в localStorage
  const response = await axios.get(`${API_URL}users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export default api;