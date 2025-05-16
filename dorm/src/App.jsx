import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DormsPage from "./pages/DormPage";
import MainPage from "./pages/MainPage";
import LoginForm from "./components/LoginForm";
import AuthButton from "./components/AuthButton";
import MarketplacePage from "./pages/MarketplacePage";
import { refreshTokens } from './services/authService';
import RegisterForm from './components/RegistrationForm';

import './index.css';

// Компонент хедера
function Header() {
  return (
    <header>
      <div className="header-container">
        <div className="nav-container">
          <img src="../logoKAI.png" alt="Логотип КНИТУ-КАИ" className="logo" />
          <div className="navbutt">
            <Link to="/">Главная</Link>
          </div>
          <div className="navbutt">
            <Link to="/dormitories">Общежития</Link>
          </div>
          <div className="navbutt">
            <AuthButton />
          </div>
          <div className="navbutt">
            <Link to="/marketplace">Маркет</Link>
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
    <AuthProvider>
      <Router>
        <Header />
        <main> {/* Оборачиваем Routes в main для flexbox */}
          <Routes>
            <Route path="/dormitories" element={<DormsPage />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;