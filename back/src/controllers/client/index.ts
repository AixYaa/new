import { Request, Response } from 'express';
import { Encrypt } from '../../utils/Decorator';
import { getDB } from '../../config/mongo';
import { getRedis } from '../../config/redis'; // 引入 Redis
import { 发送邮件 } from '../../utils/sendEmail'; // 引入邮件发送工具
import { 生成JwtToken, 验证JwtToken } from '../../utils/jwt';
import { 加密 } from '../../utils/Aes';

export class ClientController {
  @Encrypt
  static async 登录(req: Request<null,{username:string,password:string}>, res: Response) {
    const { username, password } = req.body;
    
    const collection = getDB().collection('用户');
    
    // 支持用户名或邮箱登录
    const user = await collection.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!user) {
      res.json({
        code: 400,
        msg: '用户不存在',
        data: null
      });
      return;
    }

    // 验证密码
    if (user.password !== 加密(password)) {
      res.json({
        code: 400,
        msg: '密码错误',
        data: null
      });
      return;
    }

    const token = 生成JwtToken({
      userId: user._id.toString(),
      username: user.username
    });

    res.json({
      code: 200,
      msg: '登录成功',
      data: {
        token: token,
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        }
      }
    });
  }

  static async verifyToken(req: Request, res: Response) {
    const token = req.headers['x-token'] as string;
    
    if (!token) {
      res.json({
        code: 401,
        msg: '未提供令牌',
        data: null
      });
      return;
    }

    const payload = 验证JwtToken(token);
    
    if (!payload) {
      res.json({
        code: 401,
        msg: '令牌无效或已过期',
        data: null
      });
      return;
    }

    res.json({
      code: 200,
      msg: '验证通过',
      data: payload
    });
  }

  static async 注册(req: Request<null,{username:string,email:string,code:string,password:string,confirmPassword:string}>, res: Response) {
    const { username,email,code,password,confirmPassword } = req.body;

    const collection = getDB().collection('用户');

    // 验证 code 
    const 存储的验证码 = await getRedis().get(`email:${email}`);
    if (!存储的验证码 || 存储的验证码 !== code) {
      res.json({
        code: 400,
        msg: '验证码错误',
        data: null,
      });
      return;
    }

    const 插入结果 = await collection.insertOne({
      username,
      email,
      password: 加密(password),
    });

    const 令牌 = 生成JwtToken({
      userId: 插入结果.insertedId.toString(),
      username,
    });

    if(插入结果.insertedId){
      res.json({
        code: 200,
        msg: '注册成功',
        data: {
          token: 令牌,
        },
      });
    }else{
      res.json({
        code: 400,
        msg: '注册失败',
        data: null,
      });
    }

  }

  static 注销(req: Request, res: Response) {
    res.json({
      code: 200,
      msg: '注销成功',
      data: null,
    });
  }

  @Encrypt
  static 获取用户信息(req: Request, res: Response) {
    res.json({
      code: 200,
      msg: '获取用户信息成功',
      data: {
        id: 123456,
        name: '张三',
        email: 'zhangsan@example.com',
      }
    });
  }

  static async 注册发送邮件(req: Request<null,{email:string}>, res: Response) {
    const { email } = req.body;
    // 检查邮箱是否已存在
    const collection = getDB().collection('用户');
    const 存在用户 = await collection.findOne({ email });
    if (存在用户) {
      res.json({
        code: 400,
        msg: '邮箱已存在',
        data: null,
      });
      return;
    }

    // 生成随机验证码 数字+字母
    const 验证码 = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 如果这个用户修改了信息 再发送验证码 就需要判断是否有旧验证码 如果有 就直接返回成功 让用户使用旧的验证码继续注册
    const 旧验证码 = await getRedis().get(`email:${email}`);
    if(旧验证码){
      res.json({
        code: 200,
        msg: '使用旧验证码注册 如果需要新验证码 请稍后重试',
        data: null,
      });
      return;
    }

    // 保存验证码到 Redis 中，过期时间为 5 分钟
    await getRedis().setex(`email:${email}`, 300, 验证码);

    // 发送验证码到用户邮箱
    await 发送邮件(email,'欢迎加入我们','verification',{code:验证码});

    res.json({
      code: 200,
      msg: '验证码发送成功',
      data: null,
    });
  }


}