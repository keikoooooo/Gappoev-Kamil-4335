// src/components/LogoutButton.jsx
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Выйти</button>;
};

export default LogoutButton;