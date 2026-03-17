import React, { useState, useEffect } from 'react';
import api from '../api';
import type { Product } from '../types/index';
import { useAuth } from '../utils/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');
  const [available, setAvailable] = useState(false);
  const { user, refreshBasket } = useAuth();

  const fetchProducts = async () => {
    const params = { search, category, sortBy, order, available };
    const res = await api.get('/products', { params });
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, sortBy, order, available]);

  const addToBasket = async (productId: string | number, count: number) => {
    if (!user) {
      alert('Please login to add to basket');
      return;
    }
    await api.post('/basket', { productId, count });
    await refreshBasket();
  };

  return (
    <div className="home-container">
      <section className="filters card">
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

      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card card">
            <div className="product-image">
              <img src={p.images.preview} alt={p.title} />
              {p.discount && <span className="discount-badge">-{p.discount}%</span>}
            </div>
            <div className="product-info">
              <div className="product-header">
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
                  <input type="number" defaultValue={1} min={1} id={`count-${p.id}`} className="count-input" />
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
        ))}
      </div>
    </div>
  );
};

export default Home;
