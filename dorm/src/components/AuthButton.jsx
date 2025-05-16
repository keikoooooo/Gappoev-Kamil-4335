// src/components/AuthButton.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthButton = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return isAuthenticated ? (
    <button onClick={handleLogout}>Выйти</button>
  ) : (
    <Link to="/login">Войти</Link>
  );
};
export default AuthButton