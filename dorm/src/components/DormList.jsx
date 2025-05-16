// src/components/DormList.jsx
import React, { useState, useEffect } from 'react';
import DormCard from './DormCard';
import axios from 'axios';
import '../styles/DormList.css';

function DormList() {
  const [dorms, setDorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        // Попытка загрузить данные с API
        const response = await axios.get('/dormitories');
        setDorms(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError(err.message);
        // Если API недоступно, используем mock-данные

      }
    };

    fetchDorms();
  }, []);

  const handleCardExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  if (loading) return <div className="loading">Загрузка данных...</div>;
  if (error && !useMockData) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="dorm-list">
      {useMockData && (
        <div className="mock-warning">
          Используются тестовые данные. Сервер недоступен.
        </div>
      )}
      {dorms.map(dorm => (
        <DormCard 
          key={dorm.id} 
          dorm={dorm} 
          isExpanded={expandedCardId === dorm.id}
          onExpand={() => handleCardExpand(dorm.id)}
        />
      ))}
    </div>
  );
}

export default DormList;