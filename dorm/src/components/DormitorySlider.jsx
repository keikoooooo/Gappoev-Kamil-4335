// src/components/DormitorySlider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DormitorySlider.css';

const DormitorySlider = () => {

  const [dormitories, setDormitories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === dormitories.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? dormitories.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) return <div className="loading">Загрузка общежитий...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (dormitories.length === 0) return <div className="empty">Нет данных об общежитиях</div>;

  return (
    <div className="dormitory-slider">
      <h2 className="slider-title">Выберите общежитие</h2>
      
      <div className="slider-container">
        <button className="slider-arrow left-arrow" onClick={prevSlide}>
          &lt;
        </button>
        
        <div className="slide">
          <img 
            src={dormitories[currentIndex].imageUrl || '/default-dorm.jpg'} 
            alt={dormitories[currentIndex].name}
            className="dormitory-image"
            onError={(e) => {
              e.target.src = '/default-dorm.jpg';
            }}
          />
          <div className="dormitory-info">
            <h3>{dormitories[currentIndex].name}</h3>
            <p>{dormitories[currentIndex].address}</p>
            <p>Количество мест: {dormitories[currentIndex].capacity}</p>
          </div>
        </div>
        
        <button className="slider-arrow right-arrow" onClick={nextSlide}>
          &gt;
        </button>
      </div>
      
      <div className="dots-container">
        {dormitories.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DormitorySlider;