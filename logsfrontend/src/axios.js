
import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/read-log'
    : '/api/read-log';

export const axiosInstance = axios.create({
  baseURL,
});
