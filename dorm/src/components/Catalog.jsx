// src/components/Catalog.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from './ProdCard';
import '../styles/Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  useEffect(() => {
    // Моковые данные, замените на запрос к API
    const mockProducts = [
      { id: 1, name: 'Одежда' },
      { id: 2, name: 'Одежда' },
      { id: 3, name: 'Одежда' },
      { id: 4, name: 'Одежда' },
    ];
    setProducts(mockProducts);
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="catalog">
      <h2>Топ Категорий</h2>
      <div className="product-grid">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          ←
        </button>
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(products.length / productsPerPage)}>
          →
        </button>
      </div>
    </div>
  );
};

export default Catalog;