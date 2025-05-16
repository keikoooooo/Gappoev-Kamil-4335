import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import '../styles/LoginForm.css'; // Новый файл стилей

const LoginForm = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken, refreshToken } = await login(studentId, password);
      authLogin(accessToken, refreshToken, { studentId, role: 'user' }); // Добавляем user данные
      navigate('/dormitories');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка входа');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Номер студ. билета"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              required
            />
          </div>
          <button type="submit" className="login-button">Войти</button>
          {error && <div className="error">{error}</div>}
          <p className="register-link">
            Нет аккаунта? <a href="/register">Зарегистрироваться</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;