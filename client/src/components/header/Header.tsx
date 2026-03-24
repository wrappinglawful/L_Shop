import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, basket, logout } = useAuth();

  return (
    <header className="header animate-fade-in-down">
      <div className="header-content">
        <Link to="/" className="logo-text">Shop</Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Catalog</Link>
          {user ? (
            <>
              <Link to="/basket" className="nav-link basket-link">
                Basket
                {basket && basket.basket.length > 0 && (
                  <span className="badge">{basket.basket.length}</span>
                )}
              </Link>
              <Link to="/delivery" className="nav-link">Deliveries</Link>
              <div className="user-menu">
                <span className="username">{user.name}</span>
                <button onClick={logout} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
