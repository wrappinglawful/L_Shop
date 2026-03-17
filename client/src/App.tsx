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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;
