import axios from 'axios';

const api = axios.create({
  baseURL: 'https://l-shop-mx75.onrender.com/api',
  withCredentials: true,
});

export default api;
