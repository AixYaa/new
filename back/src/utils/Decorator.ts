import { Request, Response } from 'express';
import { encryptData } from './Encryption';

// 定义装饰器
/**
 * 加密响应数据装饰器 
 * @param target 目标对象
 * @param propertyKey 方法名
 * @param descriptor 方法描述符
 * @returns 方法描述符
 */
export function Encrypt(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (req: Request, res: Response, ...args: any[]) {
    // 劫持 res.json
    const originalJson = res.json.bind(res);
    
    res.json = function (body: any) {
      if (body && body.code === 200 && body.data) {
        try {
          // 如果是对象，先转字符串
          const dataStr = typeof body.data === 'string' 
            ? body.data 
            : JSON.stringify(body.data);
            
          body.data = encryptData(dataStr);
        } catch (error) {
          console.error('加密失败:', error);
        }
      }
      return originalJson(body);
    };

    return originalMethod.apply(this, [req, res, ...args]);
  };

  return descriptor;
}