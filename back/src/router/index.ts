// 路由配置 汇聚所有的接口
import { Router } from 'express';
import loginRouter from './client';

const router = Router();

// 挂载登录路由
router.use('/client', loginRouter);

export default router;