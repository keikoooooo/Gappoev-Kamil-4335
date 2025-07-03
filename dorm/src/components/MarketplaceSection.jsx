import React, { useState, useEffect } from 'react';
import '../styles/MarketplaceSection.css';
import { getProds, createProd, approveProduct, getUserMe } from '../services/api';

const MarketplaceSection = () => {
  const [prods, setProds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    description: '',
    category_id: '',
    dormitoryId: '',
  });
  const [imageFile, setImageFile] = useState(null); // Для хранения файла изображения
  const [showForm, setShowForm] = useState(false);

  // Получение текущего пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserMe();
        setUser(userData);
      } catch (err) {
        setError(`Ошибка загрузки пользователя: ${err.message}`);
      }
    };
    fetchUser();
  }, []);

  // Получение списка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProds();
        setProds(products.items || products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Валидация перед отправкой
      if (!newProduct.title) throw new Error('Поле "Название" обязательно');
      if (!newProduct.price) throw new Error('Поле "Цена" обязательно');
      if (!newProduct.category_id) throw new Error('Поле "Категория" обязательно');
      if (!user?.id) throw new Error('Не удалось определить ID пользователя');
      if (!user?.dormitory_id && !newProduct.dormitoryId) throw new Error('Не удалось определить ID общежития');
      if (!imageFile) throw new Error('Пожалуйста, выберите изображение');

      // Создаём FormData для отправки
      const formData = new FormData();
      formData.append('title', newProduct.title);
      formData.append('price', parseInt(newProduct.price));
      formData.append('description', newProduct.description || '');
      formData.append('category_id', parseInt(newProduct.category_id));
      formData.append('dormitory_Id', parseInt(newProduct.dormitoryId) || user.dormitory_id);
      formData.append('seller_id', user.id);
      formData.append('images', imageFile); // Добавляем файл изображения

      console.log('Отправляемые данные:', formData); // Отладка (не ото бразит содержимое FormData напрямую)
      const addedProduct = await createProd(formData);
      setProds([...prods, addedProduct]);
      setNewProduct({ title: '', price: '', description: '', category_id: '', dormitoryId: '' });
      setImageFile(null); // Сбрасываем файл
      setShowForm(false);
    } catch (err) {
      console.error('Ошибка добавления:', err);
      setError(`Ошибка добавления товара: ${err.message}`);
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      console.log(`Одобрение товара с ID: ${productId}`);
      await approveProduct(productId);
      setProds(prods.map(prod =>
        prod.id === productId ? { ...prod, status: 'approved' } : prod
      ));
    } catch (err) {
      console.error('Ошибка одобрения:', err);
      setError(`Ошибка одобрения товара: ${err.message}`);
      if (err.response?.status === 404) {
        setError(`Ошибка 404: Endpoint /products/${productId}/approve не найден. Проверьте сервер.`);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  if (loading) return <div>Загрузка товаров...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="marketplace-section">
      <div className="marketplace-card">
        <h2>Торговая площадка общежитий</h2>
        <p>Лучшая площадка для торговли товарами внутри общежитий КАИ</p>
        <div className="buttons">
          <button>Искать</button>
          <button onClick={() => setShowForm(true)}>Продать</button>
        </div>

        {showForm && (
          <form onSubmit={handleAddProduct} className="add-product-form" encType="multipart/form-data">
            <div className="form-group">
              <label>Название товара</label>
              <input
                type="text"
                name="title"
                value={newProduct.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Цена</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Описание</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Категория (ID)</label>
              <input
                type="number"
                name="category_id"
                value={newProduct.category_id}
                onChange={handleInputChange}
                required
                placeholder="Например, 1 для Важные"
              />
            </div>
            <div className="form-group">
              <label>ID общежития</label>
              <input
                type="number"
                name="dormitoryId"
                value={newProduct.dormitoryId || user?.dormitory_id || ''}
                onChange={handleInputChange}
                placeholder={user?.dormitory_id ? `По умолчанию: ${user.dormitory_id}` : 'Введите ID'}
              />
            </div>
            <div className="form-group">
              <label>Изображение</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Добавить товар</button>
              <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
            </div>
          </form>
        )}

        <div className="product-list">
          {prods.length > 0 ? (
            prods.map(product => (
              <div key={product.id} className="product-item">
                <img
                  src={product.image_urls[0] || 'https://via.placeholder.com/100?text=Product'}
                  alt={product.title}
                  className="product-image"
                />
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>Цена: {product.price} руб.</p>
                {product.status === 'pending' && (
                  <button onClick={() => handleApproveProduct(product.id)}>
                    Одобрить
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>Товары отсутствуют.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceSection;