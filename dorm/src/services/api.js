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
    console.log(`Одобрение товара с ID: ${productId}, URL: ${API_URL}/products/${productId}`); // Отладка
    const response = await api.put(`/products/${productId}`, {
      status: 'approved'
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при одобрении товара:', error);
    if (error.response?.status === 404) {
      throw new Error(`Ошибка 404: Ресурс /products/${productId} не найден. Проверьте endpoint или ID.`);
    } else if (error.response?.status === 422) {
      throw new Error(`Ошибка 422: ${JSON.stringify(error.response.data)}`);
    }
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

export const createProd = async (formData) => {
  try {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    if (error.response?.status === 422) {
      throw new Error(`Ошибка 422: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

export const getUserMe = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Ошибка при запросе данных пользователя:', error);
    throw error;
  }
};

export default api;