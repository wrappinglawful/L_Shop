import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer glass animate-fade-in">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="logo-text">Shop</h3>
          <p>Modern e-commerce experience built with Glassmorphism design principles.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Catalog</a></li>
            <li><a href="/basket">Basket</a></li>
            <li><a href="/delivery">Deliveries</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@shop.by</p>
          <p>Phone: +375 (29) 000-00-00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Shop. All rights reserved. Created for L_Final project.</p>
      </div>
    </footer>
  );
};

export default Footer;
