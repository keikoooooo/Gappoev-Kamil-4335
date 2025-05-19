import axios from 'axios';

// Константы
const API_URL = 'https://kursach-x398.onrender.com/';
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || 'your_client_id';
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET || 'your_client_secret'; // Добавьте, если требуется

// Создаём кастомное событие для уведомления об изменениях в авторизации
export const dispatchAuthChangeEvent = () => {
  window.dispatchEvent(new Event('auth-change'));
};

// Создаём экземпляр axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/refresh')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { accessToken } = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Ошибка обновления токена:', refreshError.message);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        dispatchAuthChangeEvent();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', username);
  formData.append('password', password);
  formData.append('client_id', CLIENT_ID);

  try {
    const response = await axios.post(`${API_URL}auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token: accessToken, refresh_token: refreshToken, user } = response.data;

    console.log('Полный ответ сервера от /auth/login:', response.data); // Отладка

    // Если user отсутствует или пустой, создаём минимальный объект
    let userData = user || {};

    // Используем /users/me для получения полных данных пользователя
    if (accessToken) {
      try {
        const userResponse = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        userData = userResponse.data || {};
        console.log('Данные пользователя от /users/me:', userData);
      } catch (userError) {
        console.error('Ошибка при запросе /users/me:', userError.message);
        // Если запрос не удался, используем данные из /auth/login или минимальный объект
        if (!userData.role_id) {
          console.warn('role_id не найден, используем значение по умолчанию.');
          userData.role_id = 0;
        }
      }
    }

    // Проверяем наличие role_id
    if (!userData.role_id) {
      console.warn('role_id не найден в /users/me и /auth/login. Используем значение по умолчанию.');
      userData.role_id = 0; // Значение по умолчанию
    }

    console.log('Итоговые данные пользователя:', userData); // Отладка

    // Сохраняем токены и данные пользователя
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    dispatchAuthChangeEvent();

    return {
      accessToken,
      refreshToken,
      user: userData,
    };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422) {
        const errorData = error.response.data;
        if (Array.isArray(errorData)) {
          throw new Error(errorData.map(e => e.msg).join(', '));
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        }
      }
      throw new Error(error.response.data?.detail || error.message);
    }
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.detail || error.message);
    }
    throw error;
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.warn('No refresh token available, redirecting to login');
    throw new Error('No refresh token available');
  }

  const formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', refreshToken);
  formData.append('client_id', CLIENT_ID);

  // Добавьте client_secret, если требуется (проверьте документацию API)
  if (CLIENT_SECRET) {
    formData.append('client_secret', CLIENT_SECRET);
  }

  try {
    const response = await axios.post(`${API_URL}auth/refresh`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token: accessToken, refresh_token: newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    dispatchAuthChangeEvent();

    return {
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
    };
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error.response?.data || error.message);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatchAuthChangeEvent();
    if (error.response) {
      throw new Error(error.response.data?.detail || 'Failed to refresh token');
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  dispatchAuthChangeEvent();
  window.location.href = '/login';
};