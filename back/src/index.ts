import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { 连接数据库 } from './config/mongo';
import { 连接Redis } from './config/redis';
import { 请求拦截器 } from './config/Interceptor';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// 请求拦截器 检查请求是否包含 Authorization 头 如果没有则返回 401 错误
app.use((req, res, next) => {
  // 拦截器 方法 
  请求拦截器(req, res, next);
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});



app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running!');
});

async function bootstrap() {
  try {
    // 并行连接数据库，提高启动速度
    const [mongoClient, redisClient] = await Promise.all([
      连接数据库(),
      连接Redis()
    ]);

    console.log(`✅ MongoDB 连接成功 [${process.env.NODE_ENV || 'development'}] 数据库: ${mongoClient.db().databaseName}`);
    console.log(`✅ Redis   连接成功 [${process.env.NODE_ENV || 'development'}]`);

    app.listen(port, () => {
      console.log(`🚀 服务已启动 http://localhost:${port}`);
    });

  } catch (error) {
    console.error('❌ 服务启动失败:', error);
    process.exit(1);
  }
}

bootstrap();