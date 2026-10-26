// Centralized API configuration
// Supports VITE_API_URL in production, or defaults to local backend at http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
