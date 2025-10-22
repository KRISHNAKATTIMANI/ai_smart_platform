// API Configuration for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
export const getApiUrl = () => {
  return API_BASE_URL;
};

export const apiEndpoints = {
  upload: '/api/upload',
  analyze: '/api/analyze',
  chat: '/api/chat',
  downloadPdf: '/api/download-pdf',
  usage: '/api/usage'
};

export { API_BASE_URL };
export default API_BASE_URL;
