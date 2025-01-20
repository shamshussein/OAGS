import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token to the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
