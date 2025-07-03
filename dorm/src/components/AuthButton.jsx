import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AuthButton = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role_id === 2; // Убедитесь, что это правильный role_id для админа

  console.log('AuthButton Debug:', { isAuthenticated, user, isAdmin }); // Для отладки

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <Link to="/login" style={{ textDecoration: 'none', color: '#fff' }}>
        Войти
      </Link>
    );
  }



  return (
    <button
      onClick={(e) => {
        console.log('Click on Logout button', e);
        handleLogout();
      }}
      style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
    >
      Выйти
    </button>
  );
};

export default AuthButton;