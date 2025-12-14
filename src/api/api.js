import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.100.72:5000/api/admin', // Keep as is, matches index.js
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const responseData = error.response.data;
      if (responseData && responseData.redirect === true && responseData.redirectTo) {
        console.error('Session expired or token is invalid. Redirecting to login page...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminNotifications');
        window.location.href = responseData.redirectTo;
        return new Promise(() => {});
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;