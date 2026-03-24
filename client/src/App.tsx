import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import Header from './components/header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BasketPage from './pages/Basket';
import OrderPage from './pages/Order';
import DeliveryPage from './pages/Deliveries';

import ProtectedRoute from './components/ProtectedRoute';

import Footer from './components/Footer';

import { NotificationProvider } from './utils/NotificationContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app-wrapper animate-fade-in">
            <Header />
            <main className="animate-fade-in-up" style={{ minHeight: 'calc(100vh - 400px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/basket" 
                  element={
                    <ProtectedRoute>
                      <BasketPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order" 
                  element={
                    <ProtectedRoute>
                      <OrderPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/delivery" 
                  element={
                    <ProtectedRoute>
                      <DeliveryPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
