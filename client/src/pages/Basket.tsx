import React from 'react';
import { useAuth } from '../utils/AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';
import './Basket.css';

const BasketPage: React.FC = () => {
  const { basket, refreshBasket } = useAuth();

  const updateCount = async (productId: string | number, count: number) => {
    await api.put('/basket', { productId, count });
    await refreshBasket();
  };

  const removeItem = async (productId: string | number) => {
    await api.delete(`/basket/${productId}`);
    await refreshBasket();
  };

  if (!basket || basket.basket.length === 0) {
    return (
      <div className="empty-state container-sm">
        <h2>Your basket is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const total = basket.basket.reduce((sum, item) => sum + item.products.price * item.count, 0);

  return (
    <div className="basket-page">
      <h1>Shopping Basket</h1>
      
      <div className="basket-content">
        <div className="basket-items">
          {basket.basket.map(item => (
            <div key={item.products.id} className="basket-item glass">
              <img src={item.products.images.preview} alt={item.products.title} className="item-img" />
              <div className="item-details">
                <h3 data-title="basket">{item.products.title}</h3>
                <p className="item-price" data-price="basket">{item.products.price} $</p>
                <div className="item-actions">
                  <div className="quantity-input-wrapper">
                    <input 
                      type="number" 
                      value={item.count} 
                      readOnly
                      id={`count-${item.products.id}`}
                    />
                    <div className="quantity-controls-vertical">
                      <button 
                        className="btn-step" 
                        onClick={() => updateCount(item.products.id, item.count + 1)}
                      >
                        ▲
                      </button>
                      <button 
                        className="btn-step" 
                        onClick={() => updateCount(item.products.id, item.count - 1)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.products.id)} className="btn-remove">Remove</button>
                </div>
              </div>
              <div className="item-total">
                {(item.products.price * item.count).toFixed(2)} $
              </div>
            </div>
          ))}
        </div>

        <aside className="basket-summary">
          <div className="glass summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{total.toFixed(2)} $</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{total.toFixed(2)} $</span>
            </div>
            <Link to="/order" className="btn btn-primary btn-block text-center">Checkout Now</Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BasketPage;
