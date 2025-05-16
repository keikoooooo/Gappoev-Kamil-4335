import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import '../styles/RegistrationForm.css';

const RegisterForm = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем предыдущую ошибку
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    try {
      await register(studentId, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Ошибка регистрации');
      console.error('Register error:', err.response?.data || err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Регистрация</h2>
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
          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Подтвердите пароль"
              required
            />
          </div>
          <button type="submit" className="register-button">Зарегистрироваться</button>
          {error && <div className="error">{error}</div>}
          <p className="login-link">
            Уже есть аккаунт? <a href="/login">Войти</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;