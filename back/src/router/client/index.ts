// 登录路由
import { Router } from 'express';
import { ClientController } from '../../controllers/client/index';
import { ProjectController } from '../../controllers/client/project';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// 配置 multer
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ 
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024 // 限制 50MB
  }
});

// 挂载登录路由

router.get('/verify', ClientController.verifyToken)

router.post('/login', ClientController.登录);
router.post('/register', ClientController.注册);
router.post('/send-email', ClientController.注册发送邮件)

// 项目管理路由
router.post('/project/upload', upload.single('file'), ProjectController.uploadProject);
router.get('/project/list', ProjectController.getProjects);
router.put('/project/:id', upload.none(), ProjectController.updateProject);
router.delete('/project/:id', ProjectController.deleteProject);

export default router;
