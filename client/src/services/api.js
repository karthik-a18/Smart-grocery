import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/grocery' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchItems = () => API.get('/');
export const addItem = (item) => API.post('/add', item);
export const updateItem = (id, item) => API.put(`/${id}`, item);
export const deleteItem = (id) => API.delete(`/${id}`);