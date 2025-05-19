import React from 'react';
import '../styles/Home.css'; // Ensure this file exists

const Home = () => {
  return (
    <div className="home-container">
      <h1>Добро пожаловать в систему КНИТУ-КАИ!</h1>
      <p>
        Это приложение помогает студентам и администраторам управлять общежитиями, регистрировать пользователей и пользоваться маркетплейсом.
      </p>
      <div className="home-links">
        <a href="/dormitories">Посмотреть общежития</a>
        <a href="/marketplace">Перейти в маркет</a>
        <a href="/register">Зарегистрироваться</a>
      </div>
    </div>
  );
};

export default Home;