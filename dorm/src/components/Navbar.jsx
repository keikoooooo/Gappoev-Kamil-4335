import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role_id === 2; // Assume  1 is for admins

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#f8f9fa', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
          Главная
        </Link>
        {isAdmin && (
          <Link to="/admin/register-users" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            Регистрация пользователей
          </Link>
        )}
      </div>
      <div>
        {localStorage.getItem('accessToken') ? (
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>
            Выйти
          </button>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
            Войти
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;