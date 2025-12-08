import { Request, Response } from 'express';
import { getDB } from '../../config/mongo';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb';

// 递归查找 index.html
function findIndexHtml(dir: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  
  // 1. 优先查找当前目录下的 index.html
  if (files.includes('index.html')) {
    return 'index.html';
  }
  
  // 2. 查找子目录
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // 忽略 node_modules 和隐藏目录
      if (file === 'node_modules' || file.startsWith('.')) continue;

      const subResult = findIndexHtml(filePath);
      if (subResult) {
        return path.join(file, subResult);
      }
    }
  }
  
  return null;
}

export class ProjectController {
  // 上传项目
  static async uploadProject(req: Request, res: Response) {
    try {
      const file = req.file;
      // 前端传过来的字段还是叫 name 和 description，但在存库时我们用中文
      const { name, description, backendUrl } = req.body;

      // 用户要求减少后端校验，这里只做最基本的非空判断防止崩溃，逻辑校验交给前端
      if (!file) {
         // 虽然用户说不用校验，但没文件没法处理，这个还是得有
        return res.status(400).json({ code: 400, msg: '无文件' });
      }

      // 1. 解压文件
      const zip = new AdmZip(file.path);
      const projectId = new ObjectId();
      const projectDirName = projectId.toString(); // 目录名保持英文ID，方便系统管理
      const extractPath = path.join(__dirname, '../../../public/projects', projectDirName);
      
      if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath, { recursive: true });
      }

      zip.extractAllTo(extractPath, true);

      // 2. 删除上传的压缩包
      fs.unlinkSync(file.path);

      // 3. 查找入口文件
      const entryFile = findIndexHtml(extractPath);
      // 如果找到了，统一分隔符为 /；如果没找到，默认 fallback 到根目录 index.html
      const relativeEntryPath = entryFile ? entryFile.replace(/\\/g, '/') : 'index.html';

      // 4. 保存到数据库 - 使用中文命名
      const db = getDB();
      const project = {
        _id: projectId,
        项目名称: name || '未命名项目',
        项目描述: description || '',
        后端地址: backendUrl || '', // 新增后端地址字段
        目录名: projectDirName, // 这个属于系统内部路径，不建议用中文
        上传时间: new Date(),
        状态: 'deployed', // 状态码也可以考虑中文，但英文状态码更通用，展示时转义即可
        预览地址: `/projects/${projectDirName}/${relativeEntryPath}`
      };

      await db.collection('项目').insertOne(project);

      res.json({
        code: 200,
        msg: '上传成功',
        data: project
      });

    } catch (error: any) {
      console.error('上传失败:', error);
      res.status(500).json({ code: 500, msg: '系统错误: ' + error.message });
    }
  }

  // 获取项目列表
  static async getProjects(req: Request, res: Response) {
    try {
      const db = getDB();
      // 按上传时间倒序
      const projects = await db.collection('项目').find().sort({ 上传时间: -1 }).toArray();
      
      res.json({
        code: 200,
        msg: '获取成功',
        data: projects
      });
    } catch (error: any) {
      res.status(500).json({ code: 500, msg: '获取失败: ' + error.message });
    }
  }

  // 删除项目
  static async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const db = getDB();
      const project = await db.collection('项目').findOne({ _id: new ObjectId(id) });

      if (!project) {
        return res.status(200).json({ code: 404, msg: '项目不存在' }); // 即便不存在也返回200让前端不报错
      }

      // 1. 删除文件目录
      // 注意这里读取的是 "目录名" 字段
      const dirName = project['目录名'];
      if (dirName) {
        const projectPath = path.join(__dirname, '../../../public/projects', dirName);
        if (fs.existsSync(projectPath)) {
          fs.rmSync(projectPath, { recursive: true, force: true });
        }
      }

      // 2. 删除数据库记录
      await db.collection('项目').deleteOne({ _id: new ObjectId(id) });

      res.json({
        code: 200,
        msg: '删除成功'
      });
    } catch (error: any) {
      res.status(500).json({ code: 500, msg: '删除失败: ' + error.message });
    }
  }

  // 更新项目
  static async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, backendUrl } = req.body;
      const db = getDB();

      const updateData: any = {};
      if (name) updateData['项目名称'] = name;
      if (description !== undefined) updateData['项目描述'] = description;
      if (backendUrl !== undefined) updateData['后端地址'] = backendUrl;

      const result = await db.collection('项目').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(200).json({ code: 404, msg: '项目不存在' });
      }

      res.json({
        code: 200,
        msg: '更新成功'
      });
    } catch (error: any) {
      res.status(500).json({ code: 500, msg: '更新失败: ' + error.message });
    }
  }
}
