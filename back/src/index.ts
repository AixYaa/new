import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { 连接数据库 } from './config/mongo';
import { 连接Redis } from './config/redis';
// 挂载路由
import 所有 from './router/index';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 递归查找文件 helper
function findFileInDir(dir: string, filename: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file.startsWith('.')) continue;
      const found = findFileInDir(fullPath, filename);
      if (found) return found;
    } else if (file === filename) {
      return fullPath;
    }
  }
  return null;
}

// 智能静态资源中间件：修复子项目绝对路径引用导致的 404 问题
app.use(async (req, res, next) => {
  // 只处理 GET 请求且非 API、非正确路径的请求
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  if (req.path.startsWith('/projects')) return next();

  const referer = req.get('Referer');
  if (!referer) return next();

  try {
    const refererUrl = new URL(referer);
    // 检查 Referer 是否来自 /projects/{id}/...
    const match = refererUrl.pathname.match(/^\/projects\/([^/]+)(\/.*)?$/);
    
    if (match) {
      const projectId = match[1];
      console.log(`[Assets Middleware] Handling: ${req.path}, Referer Project: ${projectId}`);
      
      // 策略 1: 基于 Referer 目录拼接 (模拟相对路径)
      const refererDir = path.dirname(refererUrl.pathname);
      const relativeRefererDir = refererDir.replace(/^\/projects\//, '');
      const tryPath1 = path.join(__dirname, '../public/projects', relativeRefererDir, req.path);
      if (fs.existsSync(tryPath1)) {
        console.log(`[Assets Middleware] Strategy 1 hit: ${tryPath1}`);
        return res.sendFile(tryPath1);
      }
      
      // 策略 2: 尝试直接在项目根目录下查找
      const tryPath2 = path.join(__dirname, '../public/projects', projectId, req.path);
      if (fs.existsSync(tryPath2)) {
        console.log(`[Assets Middleware] Strategy 2 hit: ${tryPath2}`);
        return res.sendFile(tryPath2);
      }
      
      // 策略 3: 尝试在 dist 目录下查找
      const tryPath3 = path.join(__dirname, '../public/projects', projectId, 'dist', req.path);
      if (fs.existsSync(tryPath3)) {
        console.log(`[Assets Middleware] Strategy 3 hit: ${tryPath3}`);
        return res.sendFile(tryPath3);
      }

      // 策略 4: 终极保底 - 递归查找同名文件
      // 仅当文件名包含 hash (如 .abc1234.js) 时才使用，避免 index.html 这种通用名匹配错
      const filename = path.basename(req.path);
      if (filename.includes('.') && filename.length > 8) { // 简单判断
        const projectRoot = path.join(__dirname, '../public/projects', projectId);
        const foundPath = findFileInDir(projectRoot, filename);
        if (foundPath) {
          console.log(`[Assets Middleware] Strategy 4 (Recursive) hit: ${foundPath}`);
          return res.sendFile(foundPath);
        }
      }
      
      console.log(`[Assets Middleware] All strategies failed for: ${req.path}`);
    }
  } catch (e) {
    console.error(`[Assets Middleware] Error:`, e);
  }
  
  next();
});

// 静态文件服务
app.use('/projects', express.static(path.join(__dirname, '../public/projects')));

// 请求拦截器 检查请求是否包含 Authorization 头 如果没有则返回 401 错误
app.use((req, res, next) => {
  // 拦截器 方法 
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.use('/api', 所有);

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