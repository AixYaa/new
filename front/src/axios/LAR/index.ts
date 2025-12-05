import { instance } from "../index";

// 登录请求体
export interface LoginRequest {
  username: string;
  password: string;
  remember: boolean;
}

// 注册请求体
export interface RegisterRequest {
  username: string;
  email:string;
  password: string;
  confirmPassword: string;
}

export function login(data: LoginRequest) {
  return instance.post('/client/login', data);
}

export function register(data: RegisterRequest) {
  return instance.post('/client/register', data);
}

export function sendEmail(data: { email: string }) : Promise<{
  code: number;
  msg: string;
  data: null;
}> {
  return instance.post('/client/send-email', data);
}