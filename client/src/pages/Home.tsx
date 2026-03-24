import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import type { Product } from '../types/index';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import Modal from '../components/Modal';
import './Home.css';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');
  const [available, setAvailable] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { user, refreshBasket } = useAuth();
  const { showAlert } = useNotification();

  const fetchProducts = useCallback(async () => {
    setIsFetching(true);
    try {
      const params = { search, category, sortBy, order, available };
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsFetching(false);
    }
  }, [search, category, sortBy, order, available]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const addToBasket = async (productId: string | number, count: number) => {
    if (!user) {
      showAlert('Authentication Required', 'Please login to add items to your basket.');
      return;
    }
    try {
      await api.post('/basket', { productId, count });
      await refreshBasket();
      showAlert('Success', 'Product added to basket!');
    } catch (err) {
      showAlert('Error', 'Failed to add product to basket.');
    }
  };

  return (
    <div className="home-container">
      <section className="filters glass animate-scale-in">
        <div className="filter-group">
          <label>Search</label>
          <input 
            type="text" 
            placeholder="Find products..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        
        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops">Laptops</option>
            <option value="Audio">Audio</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by</label>
          <div className="sort-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="asc">↑</option>
              <option value="desc">↓</option>
            </select>
          </div>
        </div>

        <div className="filter-group checkbox-group">
          <input 
            type="checkbox" 
            id="available"
            checked={available} 
            onChange={(e) => setAvailable(e.target.checked)} 
          />
          <label htmlFor="available">In Stock</label>
        </div>
      </section>

      {isFetching ? (
        <div className="loading-spinner">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((p, idx) => (
              <div key={p.id} className="product-card glass animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="product-image" onClick={() => setSelectedProduct(p)} style={{ cursor: 'pointer' }}>
                  <img src={p.images.preview} alt={p.title} loading="lazy" />
                  {p.discount && <span className="discount-badge">-{p.discount}%</span>}
                </div>
                <div className="product-info">
                  <div className="product-header" onClick={() => setSelectedProduct(p)} style={{ cursor: 'pointer' }}>
                    <h3 data-title>{p.title}</h3>
                    <span className="product-price" data-price>{p.price} $</span>
                  </div>
                  <p className="product-desc">{p.description}</p>
                  <div className="product-meta">
                    <span className="category-tag">{p.categories[0]}</span>
                    {p.isAvailable ? (
                      <span className="stock-status in-stock">Available</span>
                    ) : (
                      <span className="stock-status out-of-stock">Out of stock</span>
                    )}
                  </div>
                  
                  {p.isAvailable && (
                    <div className="add-to-cart">
                      <div className="quantity-input-wrapper">
                        <input type="number" defaultValue={1} min={1} id={`count-${p.id}`} />
                        <div className="quantity-controls-vertical">
                          <button 
                            className="btn-step" 
                            onClick={() => {
                              const input = document.getElementById(`count-${p.id}`) as HTMLInputElement;
                              input.stepUp();
                            }}
                          >
                            ▲
                          </button>
                          <button 
                            className="btn-step" 
                            onClick={() => {
                              const input = document.getElementById(`count-${p.id}`) as HTMLInputElement;
                              input.stepDown();
                            }}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          const count = Number((document.getElementById(`count-${p.id}`) as HTMLInputElement).value);
                          addToBasket(p.id, count);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results glass">No products found matching your criteria.</div>
          )}
        </div>
      )}

      <Modal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        title={selectedProduct?.title || ''}
      >
        {selectedProduct && (
          <div className="product-details-modal">
            <img src={selectedProduct.images.preview} alt={selectedProduct.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem' }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{selectedProduct.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{selectedProduct.price} $</span>
              <span className={`stock-status ${selectedProduct.isAvailable ? 'in-stock' : 'out-of-stock'}`}>
                {selectedProduct.isAvailable ? 'Available' : 'Out of stock'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {selectedProduct.categories.map(c => (
                <span key={c} className="category-tag">{c}</span>
              ))}
            </div>
            {selectedProduct.isAvailable && (
              <button 
                className="btn btn-primary btn-block"
                onClick={() => {
                  addToBasket(selectedProduct.id, 1);
                  setSelectedProduct(null);
                }}
              >
                Add to Cart
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
