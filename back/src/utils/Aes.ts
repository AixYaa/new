// 加密工具类
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// 加密算法
const 算法 = 'aes-256-cbc';

// 密钥必须是 32 字节 (256位)
const 密钥 = crypto.scryptSync(process.env.AES_SECRET || 'default_secret', 'salt', 32);

// 初始化向量必须是 16 字节 (128位)
const 初始化向量 = crypto.scryptSync(process.env.AES_IV || 'default_iv', 'salt', 16);

// 加密函数
export function 加密(plainText: string) {
  const cipher = crypto.createCipheriv(算法, 密钥, 初始化向量);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

// 解密函数
export function 解密(encryptedText: string) {
  const decipher = crypto.createDecipheriv(算法, 密钥, 初始化向量);
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}