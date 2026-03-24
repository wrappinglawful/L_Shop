import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../utils/AuthContext';
import type { Address } from '../types/index';
import { useNotification } from '../utils/NotificationContext';
import './Order.css';

const OrderPage: React.FC = () => {
  const [address, setAddress] = useState<Address>({ country: '', town: '', street: '', houseNumber: '' });
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { basket, refreshBasket } = useAuth();
  const { showAlert } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/delivery', { address, phone, email, paymentMethod });
      showAlert('Order Placed', 'Your order has been successfully organized!');
      await refreshBasket();
      navigate('/delivery');
    } catch (err: any) {
      showAlert('Order Error', err.response?.data?.message || 'There was a problem placing your order.');
    }
  };

  if (!basket || basket.basket.length === 0) {
    return <div className="empty-state container-sm"><h2>Your basket is empty.</h2></div>;
  }

  return (
    <div className="order-page container-sm">
      <div className="order-card glass">
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit} data-delivery className="order-form">
          <section className="form-section">
            <h3>Delivery Address</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Country</label>
                <input 
                  type="text" 
                  placeholder="Country" 
                  value={address.country} 
                  onChange={(e) => setAddress({ ...address, country: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-field">
                <label>Town</label>
                <input 
                  type="text" 
                  placeholder="Town" 
                  value={address.town} 
                  onChange={(e) => setAddress({ ...address, town: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-field full-width">
                <label>Street</label>
                <input 
                  type="text" 
                  placeholder="Street" 
                  value={address.street} 
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-field">
                <label>House Number</label>
                <input 
                  type="text" 
                  placeholder="House Number" 
                  value={address.houseNumber} 
                  onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })} 
                  required 
                />
              </div>
            </div>
          </section>
          
          <section className="form-section">
            <h3>Contact Info</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Phone</label>
                <input 
                  type="tel" 
                  placeholder="+375 (29) 000-00-00" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Payment Method</h3>
            <div className="form-field">
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="card">Credit Card</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </div>
          </section>

          <button type="submit" className="btn btn-primary btn-block">
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
