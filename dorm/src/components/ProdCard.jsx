// src/components/ProductCard.jsx
import React from 'react';
import '../styles/ProdCard.css';

const ProdCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src="" alt={product.title} />
      <p>{product.title}</p>
    </div>
  );
};

export default ProdCard;