import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import './Auth.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const { login } = useAuth();
  const { showAlert } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      login(res.data);
      navigate('/');
    } catch (err: any) {
      showAlert('Login Failed', err.response?.data?.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your account</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-field">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
