import React, { useState, useEffect } from 'react';
import api from '../api';
import type { Delivery } from '../types/index';
import './Deliveries.css';

const DeliveryPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const res = await api.get('/delivery');
      setDeliveries(res.data);
    };
    fetchDeliveries();
  }, []);

  return (
    <div className="deliveries-page">
      <h1>My Deliveries</h1>
      {deliveries.length === 0 ? (
        <div className="empty-state glass">
          <p>No deliveries found. Make your first order!</p>
        </div>
      ) : (
        <div className="deliveries-list">
          {deliveries.map(d => (
            <div key={d.id} className="delivery-card glass">
              <div className="delivery-header">
                <div>
                  <span className="order-id">Order #{d.id.toString().slice(0, 8)}</span>
                  <span className={`status-badge ${d.status}`}>{d.status}</span>
                </div>
                <span className="delivery-date">2026-03-17</span>
              </div>
              
              <div className="delivery-body">
                <div className="delivery-info">
                  <h4>Shipping Address</h4>
                  <p>{d.address.country}, {d.address.town}</p>
                  <p>{d.address.street}, {d.address.houseNumber}</p>
                </div>
                
                <div className="delivery-items">
                  <h4>Items</h4>
                  <ul>
                    {d.items.map((item, idx) => (
                      <li key={idx}>
                        {item.products.title} <span className="item-qty">x{item.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="delivery-footer">
                <span>Payment: <strong>{d.paymentMethod}</strong></span>
                <span className="total-price">
                  Total: {d.items.reduce((sum, i) => sum + i.products.price * i.count, 0).toFixed(2)} $
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;
