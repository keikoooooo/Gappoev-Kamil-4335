// src/components/MarketplaceSection.jsx
import React, { useState, useEffect } from 'react';
import '../styles/MarketplaceSection.css';
import { getProds } from '../services/api';

const MarketplaceSection = () => {
  const [prods, setProds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProds();
        setProds(products);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить товары');
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Загрузка товаров...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="marketplace-section">
      <div className="marketplace-card">
        <h2>Торговая площадка общежитий</h2>
        <p>Лучшая площадка для торговли внутри общежитий КАИ</p>
        
        <div className="buttons">
          <button>Искать</button>
          <button>Продать</button>
        </div>

        {/* Пример отображения первого товара с проверкой */}
        {prods.length > 0 ? (
          <div className="featured-product">
            <img 
              src={prods[0].image || 'https://via.placeholder.com/100?text=No+Image'} 
              alt={prods[0].title || 'Товар'} 
              className="product-image" 
            />
            <h3>{prods[0].title || 'Название товара'}</h3>
            <p>Цена: {prods[0].price || '---'} ₽</p>
          </div>
        ) : (
          <p>Товары отсутствуют</p>
        )}
      </div>
    </div>
  );
};

export default MarketplaceSection;