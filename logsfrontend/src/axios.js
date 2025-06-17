
import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : '';

export const axiosInstance = axios.create({
  baseURL,
});
