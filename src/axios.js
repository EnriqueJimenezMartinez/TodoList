
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.openai.com/v1/completions',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer YOUR_API_KEY` 
  }
});

export default api;
