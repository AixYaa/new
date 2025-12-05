// 请求拦截器 检查请求是否包含 Authorization 头 如果没有则返回 401 错误
import { Request, Response, NextFunction } from 'express';

export function 请求拦截器(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: '未授权，请提供有效的 Authorization 头' });
  }
  next();
}
