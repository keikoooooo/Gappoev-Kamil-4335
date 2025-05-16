import axios from 'axios';

const API_URL = 'https://kursach-x398.onrender.com/';
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || 'your_client_id';

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', username); // сервер ожидает username, а не studentId
  formData.append('password', password);
  formData.append('client_id', CLIENT_ID);
  
  try {
    const response = await axios.post(
      `${API_URL}auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token
    };
  } catch (error) {
    // Улучшенная обработка ошибок
    if (error.response) {
      // Для 422 ошибки (валидация)
      if (error.response.status === 422) {
        const errorData = error.response.data;
        if (Array.isArray(errorData)) {
          throw new Error(errorData.map(e => e.msg).join(', '));
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        }
      }
      // Для других ошибок
      throw new Error(error.response.data?.detail || error.message);
    }
    throw error;
  }
};

// Остальные функции остаются без изменений
export const register = async (studentId, password) => {
  try {
    const response = await axios.post(`${API_URL}auth/register`, { 
      studentId, 
      password 
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    // Пробрасываем полный объект ошибки для детализированной обработки
    if (error.response) {
      error.message = error.response.data?.detail || error.message;
    }
    throw error;
  }
};
export const refreshToken = async () => {
  // ... существующая реализация
};