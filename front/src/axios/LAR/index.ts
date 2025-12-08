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
// 解密登录响应体 
export function login(data: LoginRequest) : Promise<{
  code: number;
  msg: string;
  data: string
}> {
  return instance.post('/client/login', data);
}

export function register(data: RegisterRequest) : Promise<{
  code: number;
  msg: string;
  data: {
    token: string;
  };
}> {
  return instance.post('/client/register', data);
}

export function sendEmail(data: { email: string }) : Promise<{
  code: number;
  msg: string;
  data: null;
}> {
  return instance.post('/client/send-email', data);
}

// 项目管理相关接口
export interface Project {
  _id: string;
  项目名称: string;
  项目描述: string;
  后端地址?: string; // 新增字段
  上传时间: string;
  状态: 'deployed' | 'processing' | 'failed';
  预览地址: string;
}

export function uploadProject(formData: FormData) : Promise<{
  code: number;
  msg: string;
  data: Project;
}> {
  return instance.post('/client/project/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function getProjectList() : Promise<{
  code: number;
  msg: string;
  data: Project[];
}> {
  return instance.get('/client/project/list');
}

export function updateProject(id: string, data: any) : Promise<{
  code: number;
  msg: string;
}> {
  return instance.put(`/client/project/${id}`, data);
}

export function deleteProject(id: string) : Promise<{
  code: number;
  msg: string;
}> {
  return instance.delete(`/client/project/${id}`);
}
