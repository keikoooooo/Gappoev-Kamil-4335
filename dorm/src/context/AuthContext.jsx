import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const syncAuthState = () => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Ошибка парсинга user из localStorage:', e);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    console.log('Sync Auth State:', { isAuthenticated: !!token, user: storedUser ? JSON.parse(storedUser) : null });
  };

  useEffect(() => {
    syncAuthState();

    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        syncAuthState();
      }
    };

    const handleAuthChange = () => {
      syncAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const login = async (accessToken, refreshToken, userData) => {
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      window.dispatchEvent(new Event('auth-change'));
    } catch (error) {
      console.error('Ошибка при входе:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      window.dispatchEvent(new Event('auth-change'));
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const checkTokenValidity = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      logout();
      return false;
    }
    return true;
  };

  useEffect(() => {
    const validateToken = async () => {
      const isValid = await checkTokenValidity();
      if (!isValid) {
        console.log('Токен недействителен, выполняется выход');
      }
    };

    if (isAuthenticated) {
      validateToken();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkTokenValidity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider. Убедитесь, что ваш компонент обёрнут в AuthProvider.');
  }
  return context;
};