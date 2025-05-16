import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDorms, getProds, createProd, getProductsForModeration, approveProduct, deleteProduct } from '../services/api';
import '../styles/MarketplaceSection.css';
import { getUserMe } from '../services/api';
import axios from 'axios'; // Для выполнения PUT-запроса

const API_URL = 'https://kursach-x398.onrender.com'; // Замените на ваш URL API

const MarketplacePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [dormitories, setDormitories] = useState([]);
  const [selectedDormId, setSelectedDormId] = useState(null);
  const [products, setProducts] = useState([]);
  const [moderationProducts, setModerationProducts] = useState([]);
  const [loading, setLoading] = useState({ dorms: true, products: true, moderation: false, user: true });
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [userData, setUserData] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category_id: 1,
    image_urls: { main: '' },
    role_id: null,
  });

  const isAdmin = userData?.role_id === 2;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(prev => ({ ...prev, user: true }));
        const data = await getUserMe();
        setUserData(data);
        setNewProduct(prev => ({ ...prev, role_id: data.role_id }));
      } catch (err) {
        setError('Ошибка загрузки данных пользователя');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, user: false }));
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const data = await getDorms();
        setDormitories(data);
        if (data.length > 0) {
          setSelectedDormId(data[0].id);
        }
      } catch (err) {
        setError('Ошибка загрузки общежитий');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, dorms: false }));
      }
    };

    fetchDormitories();
  }, []);

  useEffect(() => {
    if (!selectedDormId) return;

    const fetchProducts = async () => {
      try {
        setLoading(prev => ({ ...prev, products: true }));
        const data = await getProds({ dormitory_id: selectedDormId });
        setProducts(data.items || []);
      } catch (err) {
        setError('Ошибка загрузки товаров');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    };

    fetchProducts();
  }, [selectedDormId]);

  useEffect(() => {
    if (!isAdmin || loading.dorms) return;

    const fetchModerationProducts = async () => {
      try {
        setLoading(prev => ({ ...prev, moderation: true }));
        const data = await getProductsForModeration();
        setModerationProducts(data);
      } catch (err) {
        setError('Ошибка загрузки товаров для модерации');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, moderation: false }));
      }
    };

    fetchModerationProducts();
  }, [isAdmin, loading.dorms]);

  const validateProduct = () => {
    const errors = {};
    if (!newProduct.title.trim()) errors.title = 'Название обязательно';
    if (!newProduct.description.trim()) errors.description = 'Описание обязательно';
    if (!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price) <= 0)
      errors.price = 'Укажите корректную цену';
    if (!selectedDormId) errors.dormitory_id = 'Выберите общежитие';
    if (!newProduct.category_id || newProduct.category_id < 1)
      errors.category_id = 'Укажите корректную категорию';
    if (!newProduct.role_id) errors.role_id = 'Укажите роль';

    const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
    if (!newProduct.image_urls.main || !newProduct.image_urls.main.trim()) {
      errors.image_urls = 'Укажите ссылку на изображение';
    } else if (!urlPattern.test(newProduct.image_urls.main.trim())) {
      errors.image_urls = 'Укажите корректный URL изображения (например, https://example.com/image.jpg)';
    } else {
      const validExtensions = /\.(jpg|jpeg|png|gif)$/i;
      if (!validExtensions.test(newProduct.image_urls.main.trim())) {
        errors.image_urls = 'Изображение должно быть в формате JPG, PNG или GIF';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Пожалуйста, войдите в систему для создания товара');
      window.location.href = '/login';
      return;
    }

    if (!validateProduct()) return;

    try {
      const productData = {
        title: newProduct.title.trim(),
        description: newProduct.description.trim(),
        price: Number(newProduct.price),
        dormitory_id: selectedDormId,
        category_id: Number(newProduct.category_id),
        image_urls: { main: newProduct.image_urls.main.trim() },
        role_id: Number(newProduct.role_id || userData?.role_id),
      };

      await createProd(productData);
      const data = await getProds({ dormitory_id: selectedDormId });
      setProducts(data.items || []);
      setNewProduct({
        title: '',
        description: '',
        price: '',
        category_id: 1,
        image_urls: { main: '' },
        role_id: userData?.role_id || null,
      });
      setError(null);
      setValidationErrors({});
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Не авторизован. Пожалуйста, войдите в систему');
        window.location.href = '/login';
      } else if (err.response?.status === 422) {
        const serverErrors = err.response.data.detail || [];
        const errors = {};
        serverErrors.forEach(error => {
          const field = error.loc[0];
          if (field === 'image_urls.main') {
            errors.image_urls = error.msg || 'Некорректный формат изображения';
          } else {
            errors[field] = error.msg || 'Ошибка валидации';
          }
        });
        setValidationErrors(errors);
        setError('Ошибка валидации: проверьте введенные данные');
      } else {
        setError(err.message || 'Ошибка при создании товара');
      }
      console.error('Server response:', err.response?.data || err);
    }
  };

  const handleDormChange = (dormId) => {
    setSelectedDormId(dormId);
    setError(null);
  };

  const handleApproveProduct = async (productId) => {
    try {
      await approveProduct(productId);
      setModerationProducts(moderationProducts.filter(p => p.id !== productId));
    } catch (err) {
      setError('Ошибка при одобрении товара');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId, isModeration = false) => {
    try {
      await deleteProduct(productId);
      if (isModeration) {
        setModerationProducts(moderationProducts.filter(p => p.id !== productId));
      } else {
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (err) {
      setError('Ошибка при удалении товара');
      console.error(err);
    }
  };

  const handleUpdateProduct = async (product) => {
  try {
    // Создаем объект FormData для отправки данных в формате multipart/form-data
    const formData = new FormData();

    // Явно задаем пустые значения для всех полей, кроме status
    formData.append('title', ''); // Пустая строка вместо null
    formData.append('description', ''); // Пустая строка вместо null
    formData.append('price', ''); // Пустая строка вместо null
    formData.append('category_id', ''); // Пустая строка вместо null
    formData.append('dormitory_id', ''); // Пустая строка вместо null
    formData.append('status', 'approved'); // Используем значение status
    formData.append('image_files', JSON.stringify([])); // Пустой массив для image_files

    const token = localStorage.getItem('accessToken'); // Предполагаем, что токен хранится в localStorage
    const response = await axios.put(`${API_URL}/products/${product.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Указываем тип контента
      },
    });

    // После успешного обновления перезапрашиваем список продуктов
    const updatedProducts = await getProds({ dormitory_id: selectedDormId });
    setProducts(updatedProducts.items || []);
  } catch (err) {
    if (err.response?.status === 422) {
      // Выводим детали ошибки валидации
      const serverErrors = err.response.data.detail || [];
      console.error('Validation errors:', serverErrors);
      setError(`Ошибка валидации: ${JSON.stringify(serverErrors)}`);
    } else {
      setError('Ошибка при обновлении товара: ' + err.message);
    }
    console.error('Update product error:', err.response?.data || err);
  }
};

  if (loading.dorms || loading.user) return <div className="loading">Загрузка...</div>;
  if (error && !selectedDormId) return <div className="error">{error}</div>;

  return (
    <div className="marketplace-page">
      <h1>Торговая площадка</h1>

      <div className="dormitory-selector">
        <h2>Выберите общежитие:</h2>
        <div className="dormitory-buttons">
          {dormitories.map(dorm => (
            <button
              key={dorm.id}
              className={`dorm-button ${selectedDormId === dorm.id ? 'active' : ''}`}
              onClick={() => handleDormChange(dorm.id)}
            >
              {dorm.name}
            </button>
          ))}
        </div>
      </div>

      {isAuthenticated ? (
        <div className="add-product-form">
          <h3>Добавить новый товар</h3>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleCreateProduct}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Название товара*"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              />
              {validationErrors.title && <span className="error-message">{validationErrors.title}</span>}
            </div>

            <div className="form-group">
              <textarea
                placeholder="Описание*"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              {validationErrors.description && <span className="error-message">{validationErrors.description}</span>}
            </div>

            <div className="form-group">
              <input
                type="number"
                placeholder="Цена*"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              {validationErrors.price && <span className="error-message">{validationErrors.price}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Ссылка на изображение (например, https://example.com/image.jpg)"
                value={newProduct.image_urls.main}
                onChange={(e) => setNewProduct({ 
                  ...newProduct, 
                  image_urls: { main: e.target.value } 
                })}
              />
              {validationErrors.image_urls && <span className="error-message">{validationErrors.image_urls}</span>}
            </div>

            {isAdmin && (
              <div className="form-group">
                <select
                  value={newProduct.role_id}
                  onChange={(e) => setNewProduct({ ...newProduct, role_id: e.target.value })}
                >
                  <option value="">Выберите роль</option>
                  <option value="1">Администратор</option>
                  <option value="2">Модератор</option>
                  <option value="3">Пользователь</option>
                </select>
                {validationErrors.role_id && <span className="error-message">{validationErrors.role_id}</span>}
              </div>
            )}

            <button type="submit" className="submit-button">
              Опубликовать
            </button>
          </form>
        </div>
      ) : (
        <div className="auth-message">
          <p>Пожалуйста, <a href="/login">войдите в систему</a> для добавления товара.</p>
        </div>
      )}

      {isAdmin && (
        <div className="moderation-panel">
          <h3>Модерация товаров</h3>
          {loading.moderation ? (
            <div className="loading">Загрузка товаров для модерации...</div>
          ) : moderationProducts.length === 0 ? (
            <p>Нет товаров для модерации</p>
          ) : (
            <div className="moderation-grid">
              {moderationProducts.map(product => (
                <div key={product.id} className="moderation-card">
                  {product.image_urls?.main ? (
                    <img
                      src={product.image_urls.main}
                      alt={product.title}
                      className="moderation-image"
                      onError={(e) => {
                        e.target.src = '/default-product-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">Нет изображения</div>
                  )}
                  <div className="moderation-content">
                    <h4 className="moderation-title">{product.title}</h4>
                    <p className="moderation-description">{product.description}</p>
                    <p className="moderation-price">Цена: <span>{product.price} ₽</span></p>
                  </div>
                  <div className="moderation-actions">
                    <button
                      className="approve-button"
                      onClick={() => handleApproveProduct(product.id)}
                    >
                      Одобрить
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteProduct(product.id, true)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="products-section">
        <h2>Товары в {dormitories.find(d => d.id === selectedDormId)?.name || 'выбранном общежитии'}</h2>
        
        {loading.products ? (
          <div className="loading">Загрузка товаров...</div>
        ) : products.length === 0 ? (
          <p className="no-products">В этом общежитии пока нет товаров</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                {product.image_urls?.main && (
                  <img 
                    src={product.image_urls.main} 
                    alt={product.title} 
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/default-product-image.jpg';
                    }}
                  />
                )}
                <div className="product-header">
                  <h3>{product.title}</h3>
                  <span className="price">{product.price} ₽</span>
                </div>
                <p className="description">{product.description}</p>
                <div className="product-footer">
                  <span>Продавец: {product.seller_name || userData?.full_name || 'Аноним'}</span>
                  <div className="product-actions">
                    {(isAdmin || product.seller_name === userData?.full_name) && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Удалить
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        className="approve-button"
                        onClick={() => handleUpdateProduct(product)}
                      >
                        Одобрить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;