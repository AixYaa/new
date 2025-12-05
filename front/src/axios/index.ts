// 引入 axios 库
import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
})

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

