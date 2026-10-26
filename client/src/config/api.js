// Centralized API configuration
// In production on the unified server, calls are relative ('').
// In local development or custom deployment, uses VITE_API_URL or defaults to http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

export default API_BASE_URL;
