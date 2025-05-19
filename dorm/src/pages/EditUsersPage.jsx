import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'https://kursach-x398.onrender.com/';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState({ id: '', username: '', role_id: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  // Проверка роли пользователя
  useEffect(() => {
    if (authUser && authUser.role_id !== 2) {
      setUnauthorized(true);
    }
  }, [authUser]);

  // Загрузка данных пользователя
  useEffect(() => {
    if (unauthorized) return;

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundUser = response.data.find((u) => u.id === parseInt(id));
        if (foundUser) {
          setUser(foundUser);
        } else {
          setError(`Пользователь с ID ${id} не найден`);
        }
      } catch (err) {
        setError('Ошибка загрузки данных пользователей');
        console.error('Ошибка при загрузке пользователей:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [id, unauthorized]);

  if (unauthorized) {
    return <p style={{ color: 'red', margin: '20px' }}>У вас нет прав для редактирования пользователей. Обратитесь к администратору.</p>;
  }

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Обновление пользователя
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`${API_URL}users/${id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Пользователь успешно обновлён');
      navigate('/');
    } catch (err) {
      setError('Ошибка обновления пользователя');
      console.error('Ошибка при обновлении пользователя:', err);
    }
  };

  // Обновление состояния формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Редактирование пользователя (ID: {id})</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Имя пользователя:</label>
          <input
            type="text"
            name="username"
            value={user.username || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Role ID:</label>
          <input
            type="number"
            name="role_id"
            value={user.role_id || 0}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Сохранить
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
};

export default EditUserPage;