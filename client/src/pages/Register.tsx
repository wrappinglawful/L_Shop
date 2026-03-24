import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', password: '', email: '', phone: '' });
  const { login } = useAuth();
  const { showAlert } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/register', formData);
      login(res.data);
      navigate('/');
    } catch (err: any) {
      showAlert('Registration Failed', err.response?.data?.message || 'Please check your information and try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <h2>Create Account</h2>
        
        <form onSubmit={handleSubmit} data-registration className="auth-form">
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
            <label>Email</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>

          <div className="form-field">
            <label>Phone</label>
            <input 
              type="tel" 
              placeholder="+375 (29) 000-00-00" 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
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

          <button type="submit" className="btn btn-primary btn-block">Register</button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
