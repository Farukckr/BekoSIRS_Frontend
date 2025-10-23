import axios from 'axios';
import { getToken } from '../storage/storage.native';
import Constants from 'expo-constants';

// 🔹 Get your computer's local IP address
// Replace this with YOUR actual IP address from ipconfig/ifconfig
const COMPUTER_IP = '192.168.0.109';

// 🔹 Expo Go requires using your computer's local network IP
const API_BASE_URL = __DEV__ 
  ? `http://${COMPUTER_IP}:8000/`
  : 'https://your-production-api.com/';

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('📱 Device:', Constants.deviceName);
console.log('🌐 Platform:', Constants.platform);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 second timeout for mobile networks
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token added to request');
      }
    } catch (error) {
      console.error('❌ Error getting token:', error);
    }
    
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('❌ Server Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ Network Error - No Response:', {
        message: 'Cannot connect to backend',
        url: error.config?.url,
        baseURL: API_BASE_URL
      });
      console.error('💡 Troubleshooting:');
      console.error('   1. Check if backend is running: python manage.py runserver 0.0.0.0:8000');
      console.error('   2. Verify IP address is correct:', COMPUTER_IP);
      console.error('   3. Ensure phone and computer are on same WiFi');
      console.error('   4. Check Django ALLOWED_HOSTS includes:', COMPUTER_IP);
      console.error('   5. Disable firewall temporarily to test');
    } else {
      // Error in request setup
      console.error('❌ Request Setup Error:', error.message);
    }
    
    // Return a more user-friendly error
    const userError = error.response?.data?.message || 
                      error.response?.statusText ||
                      'Network connection error. Check your connection.';
    
    return Promise.reject({
      ...error,
      userMessage: userError
    });
  }
);

// Test connection function
export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    const response = await axios.get(`${API_BASE_URL}admin/`, {
      timeout: 5000,
      validateStatus: () => true // Accept any status to test connectivity
    });
    console.log('✅ Backend is reachable! Status:', response.status);
    return true;
  } catch (error: any) {
    console.error('❌ Backend connection test failed:');
    if (error.code === 'ECONNABORTED') {
      console.error('   ⏱️ Connection timeout - Backend not responding');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   🌐 DNS resolution failed - Check IP address');
    } else if (error.message.includes('Network Error')) {
      console.error('   📡 Network error - Check WiFi connection');
    } else {
      console.error('   ❓ Unknown error:', error.message);
    }
    return false;
  }
};

export default api;