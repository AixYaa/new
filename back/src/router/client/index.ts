// 登录路由
import { Router } from 'express';
import { ClientController } from '../../controllers/client/index';

const router = Router();

// 挂载登录路由

router.get('/verify', ClientController.verifyToken)

router.post('/login', ClientController.登录);
router.post('/register', ClientController.注册);
router.post('/send-email', ClientController.注册发送邮件)

export default router;