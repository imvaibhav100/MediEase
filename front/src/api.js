import axios from "axios";

// Allow overriding backend base URL via environment variable at build time
const ENV_BASE = process.env.REACT_APP_API_URL;
const BACKEND_BASE = ENV_BASE && ENV_BASE.trim().length > 0
  ? ENV_BASE.trim()
  : (window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://mediease-backend-production.up.railway.app');
const API_URL = `${BACKEND_BASE}/api/auth`;
const CART_API_URL = `${BACKEND_BASE}/api/cart`;
const ORDER_API_URL = `${BACKEND_BASE}/api/orders`;

// Helper to get auth header
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('MediEase_user') || '{}');
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const signup = async (email, password, name, phone) => {
  return axios.post(`${API_URL}/signup`, { email, password, name, phone });
};

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

// Cart APIs
export const getCart = async () => {
  return axios.get(CART_API_URL, { headers: getAuthHeader() });
};

export const addToCartAPI = async (item) => {
  return axios.post(`${CART_API_URL}/add`, {
    medicineId: item.id || '',
    name: item.name,
    price: item.price,
    quantity: item.quantity || 1,
    genericSource: item.genericSource || '',
    category: item.category || '',
    salts: item.salts ? (Array.isArray(item.salts) ? item.salts.join(', ') : item.salts) : ''
  }, { headers: getAuthHeader() });
};

export const removeFromCartAPI = async (medicineName) => {
  return axios.delete(`${CART_API_URL}/remove/${encodeURIComponent(medicineName)}`, { headers: getAuthHeader() });
};

export const updateCartItemAPI = async (medicineName, quantity) => {
  return axios.put(`${CART_API_URL}/update`, { medicineName, quantity }, { headers: getAuthHeader() });
};

export const clearCartAPI = async () => {
  return axios.delete(`${CART_API_URL}/clear`, { headers: getAuthHeader() });
};

// Order APIs
export const createOrder = async (shippingAddress, paymentMethod) => {
  return axios.post(`${ORDER_API_URL}/create`, { shippingAddress, paymentMethod }, { headers: getAuthHeader() });
};

export const buyNow = async (item, shippingAddress, paymentMethod) => {
  return axios.post(`${ORDER_API_URL}/buy-now`, {
    medicineId: item.id || '',
    name: item.name,
    price: item.price,
    quantity: item.quantity || 1,
    genericSource: item.genericSource || '',
    category: item.category || '',
    salts: item.salts ? (Array.isArray(item.salts) ? item.salts.join(', ') : item.salts) : '',
    shippingAddress,
    paymentMethod
  }, { headers: getAuthHeader() });
};

export const getOrders = async () => {
  return axios.get(ORDER_API_URL, { headers: getAuthHeader() });
};

export const getOrder = async (orderId) => {
  return axios.get(`${ORDER_API_URL}/${orderId}`, { headers: getAuthHeader() });
};

export const cancelOrder = async (orderId) => {
  return axios.post(`${ORDER_API_URL}/${orderId}/cancel`, {}, { headers: getAuthHeader() });
};
