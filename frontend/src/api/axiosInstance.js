import axios from 'axios';

// Create an Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_API}/api`, // Set the base URL for your API
});

// Add a request interceptor to include the auth-token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the auth-token from localStorage first
    let token = localStorage.getItem('authToken');
    
    // If no token in localStorage, try to get it from sessionStorage (for NextAuth)
    if (!token && typeof window !== 'undefined') {
      // We'll handle this in the component level by passing the token from NextAuth session
      // For now, we'll rely on localStorage which gets set when NextAuth session is available
    }
    
    if (token) {
      config.headers['auth-token'] = token; // Set the token in the request headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;