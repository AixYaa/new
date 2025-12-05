//  生成 JWT 令牌
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// 从环境变量中获取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// 定义 JWT 令牌的有效载荷接口
export interface JwtPayload {
  userId: string;
  username: string;
}

// 生成 JWT 令牌
export function 生成JwtToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function 验证JwtToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
