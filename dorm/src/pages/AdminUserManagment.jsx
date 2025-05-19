import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/RegistrationForm';
import axios from 'axios';
import '../styles/AdminUsersManagement.css';

const API_URL = 'https://kursach-x398.onrender.com/';

const AdminUserManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState(id ? 'edit' : 'register');
  const [user, setUser] = useState({
    id: '',
    full_name: '',
    role_id: 0,
    email: '',
    phone: '',
    birth_date: '',
    course: 0,
    faculty: '',
    student_card: '',
    specialization: '',
    group_number: 0,
    dormitory_id: 0,
    room_id: 0,
    points: { total: 0 }, // Добавляем поле points с total
  });
  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Полный ответ сервера от /users:', response);
      console.log('Данные (response.data):', response.data);

      let users = [];
      if (Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data?.items) {
        users = response.data.items;
      } else if (response.data?.users) {
        users = response.data.users;
      } else if (response.data?.data) {
        users = response.data.data;
      } else {
        throw new Error('Неизвестный формат данных');
      }

      setUsersList(users);

      if (id) {
        const foundUser = users.find(u => u.id === parseInt(id));
        if (foundUser) {
          setUser({
            id: foundUser.id,
            full_name: foundUser.full_name || '',
            role_id: foundUser.role_id || 0,
            email: foundUser.email || '',
            phone: foundUser.phone || '',
            birth_date: foundUser.birth_date ? foundUser.birth_date.split('T')[0] : '',
            course: foundUser.course || 0,
            faculty: foundUser.faculty || '',
            student_card: foundUser.student_card || '',
            specialization: foundUser.specialization || '',
            group_number: foundUser.group_number || 0,
            dormitory_id: foundUser.dormitory_id || 0,
            room_id: foundUser.room_id || 0,
            points: { total: foundUser.points?.total || 0 }, // Заполняем points.total
          });
        } else {
          setError(`Пользователь с ID ${id} не найден`);
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError(`Ошибка загрузки: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.role_id !== 2) {
      setUnauthorized(true);
      return;
    }

    fetchUsers();
  }, [id, authUser]);

  const filteredUsers = usersList.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.student_card?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const updatedUser = {
        ...user,
        role_id: parseInt(user.role_id),
        course: parseInt(user.course),
        group_number: parseInt(user.group_number),
        dormitory_id: parseInt(user.dormitory_id),
        room_id: parseInt(user.room_id),
        birth_date: user.birth_date ? user.birth_date : null,
        points: { total: parseInt(user.points.total) }, // Убеждаемся, что total — число
      };

      // Преобразуем данные в application/x-www-form-urlencoded
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(updatedUser)) {
        if (value !== null && value !== undefined) {
          if (key === 'points' && value.total !== undefined) {
            params.append('points[total]', value.total); // Специальная обработка для объекта points
          } else {
            params.append(key, value);
          }
        }
      }

      console.log('Отправляемые данные для PUT:', params.toString());

      const response = await axios.put(`${API_URL}users/${id}`, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Ответ сервера от PUT:', response);

      alert('Изменения сохранены успешно!');
      await fetchUsers();
      navigate('/admin/users');
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setError(`Ошибка сохранения: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'points[total]') {
      setUser(prev => ({
        ...prev,
        points: { total: value || 0 },
      }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUserSelect = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  if (unauthorized) {
    return (
      <div className="unauthorized-container">
        <h2>Доступ запрещен</h2>
        <p>У вас недостаточно прав для доступа к этой странице.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Управление пользователями</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              navigate('/admin/users/register');
            }}
          >
            Регистрация
          </button>
          <button
            className={`tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('edit');
              navigate('/admin/users');
            }}
          >
            Редактирование
          </button>
        </div>
      </div>

      {activeTab === 'register' && <RegisterForm />}

      {activeTab === 'edit' && (
        <div className="edit-section">
          {!id ? (
            <div className="user-list-container">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Поиск пользователей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="search-icon">🔍</i>
              </div>
              
              <div className="user-grid">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <div 
                      key={u.id} 
                      className="user-card"
                      onClick={() => handleUserSelect(u.id)}
                    >
                      <div className="user-info">
                        <h3>{u.full_name || 'Не указано'}</h3>
                        <p><strong>ID:</strong> {u.id}</p>
                        <p><strong>Email:</strong> {u.email || 'Не указан'}</p>
                        <p><strong>Группа:</strong> {u.group_number || 'Не указана'}</p>
                      </div>
                      <div className={`role-badge role-${u.role_id}`}>
                        {u.role_id === 1 ? 'Преподаватель' : u.role_id === 2 ? 'Админ' : 'Студент'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-results">Пользователи не найдены</p>
                )}
              </div>
            </div>
          ) : (
            <div className="edit-form-container">
              <button 
                className="back-button"
                onClick={() => navigate('/admin/users')}
              >
                ← Назад к списку
              </button>
              
              <h2>Редактирование пользователя ID: {id}</h2>
              
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-section">
                  <h3>Основная информация</h3>
                  <div className="form-group">
                    <label>Полное имя</label>
                    <input
                      type="text"
                      name="full_name"
                      value={user.full_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Роль</label>
                    <select
                      name="role_id"
                      value={user.role_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="0">Студент</option>
                      <option value="1">Преподаватель</option>
                      <option value="2">Администратор</option>
                    </select>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Контактная информация</h3>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Дата рождения</label>
                    <input
                      type="date"
                      name="birth_date"
                      value={user.birth_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Учебная информация</h3>
                  <div className="form-group">
                    <label>Студенческий билет</label>
                    <input
                      type="text"
                      name="student_card"
                      value={user.student_card}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Курс</label>
                    <input
                      type="number"
                      name="course"
                      value={user.course}
                      onChange={handleChange}
                      min="1"
                      max="6"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Факультет</label>
                    <input
                      type="text"
                      name="faculty"
                      value={user.faculty}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Специализация</label>
                    <input
                      type="text"
                      name="specialization"
                      value={user.specialization}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Номер группы</label>
                    <input
                      type="number"
                      name="group_number"
                      value={user.group_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Проживание</h3>
                  <div className="form-group">
                    <label>ID общежития</label>
                    <input
                      type="number"
                      name="dormitory_id"
                      value={user.dormitory_id}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>ID комнаты</label>
                    <input
                      type="number"
                      name="room_id"
                      value={user.room_id}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Баллы</h3>
                  <div className="form-group">
                    <label>Общий балл</label>
                    <input
                      type="number"
                      name="points[total]"
                      value={user.points.total || 0}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Сохранить изменения
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => navigate('/admin/users')}
                  >
                    Отмена
                  </button>
                </div>
              </form>
              
              {error && <div className="error-message">{error}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;