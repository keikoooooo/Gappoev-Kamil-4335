import React, { useContext } from 'react'; // Добавляем useContext
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Импортируем useAuth
import PrivateRoute from './components/PrivateRoute';
import DormsPage from './pages/DormPage';
import MainPage from './pages/MainPage';
import LoginForm from './components/LoginForm';
import AuthButton from './components/AuthButton';
import MarketplacePage from './pages/MarketplacePage';
import AdminUserManagement from './pages/AdminUserManagment'; // Исправлено название файла

import './App.css';

// Импортируем логотип
import logoKAI from './styles/logoKAI.png';

// Компонент хедера
function Header() {
  const { user: authUser } = useAuth(); // Получаем текущего пользователя из контекста

  return (
    <header>
      <div className="header-container">
        <div className="nav-container">
          <img src={logoKAI} alt="Логотип КНИТУ-КАИ" className="logo" />
          <div className="navbutt">
            <Link to="/">Главная</Link>
          </div>
          <div className="navbutt">
            <Link to="/dormitories">Общежития</Link>
          </div>
          <div className="navbutt">
            <Link to="/marketplace">Маркет</Link>
          </div>
          {/* Условное отображение ссылки на управление пользователями */}
          {authUser?.role_id === 2 && (
            <div className="navbutt">
              <Link to="/admin/users">Управление пользователями</Link>
            </div>
          )}
          
          <div className="navbutt">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      © Emil Badtretdinov | Daniil Vakhrameev | Tazeev Iskander | Gappoev Kamil
    </footer>
  );
}

// Главный компонент
function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/dormitories" element={<DormsPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            
            {/* Админские маршруты */}
            <Route path="/admin/users" element={
              <PrivateRoute requiredRole={2}>
                <AdminUserManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/users/edit/:id" element={
              <PrivateRoute requiredRole={2}>
                <AdminUserManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/users/register" element={
              <PrivateRoute requiredRole={2}>
                <AdminUserManagement />
              </PrivateRoute>
            } />
            
            {/* Перенаправление для старых ссылок */}
            <Route path="/admin/register-users" element={<Navigate to="/admin/users" replace />} />
            <Route path="/admin/register-users/:id" element={<Navigate to="/admin/users/edit/:id" replace />} />
            
            {/* Страница 404 (можно добавить позже) */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;