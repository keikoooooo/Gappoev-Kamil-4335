// src/components/MarketplaceSection.jsx
import React, { useState, useEffect } from 'react';
import '../styles/MarketplaceSection.css';
import { getProds } from '../services/api';


const MarketplaceSection = () => {
  const [prods, setProds] = useState([]); // Исправлено: добавлен useState
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => { // Исправлено: добавлен useEffect
    const fetchProducts = async () => {
      try {
        const products = await getProds(); // Исправлено: используется импортированная функция
        setProds(products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Загрузка товаров...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  return (
    <div className="marketplace-section">
      <div className="marketplace-card">
        <h2>Торговая площадка общежитий</h2>
        <p>Лучшая площадка для торговли тортовыми внутри общежитий КАИ</p>
        <div className="buttons">
          <button>Искать</button>
          <button>Продать</button>
        </div>
        { <img src="https://via.placeholder.com/100?text=Hat" alt="Product" className="product-image" /> }
        <p>{setProds}</p>
      </div>
    </div>
  );
};

export default MarketplaceSection;