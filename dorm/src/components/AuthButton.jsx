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
      <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
        Войти
      </Link>
    );
  }

  if (isAdmin) {
    return (
      <>
        <Link
          to="/admin/register-users"
          style={{ textDecoration: 'none', color: '#007bff', marginRight: '10px' }}
          onClick={(e) => console.log('Click on Register Users link', e)}
        >
          Регистрация пользователей
        </Link>
        
      </>
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