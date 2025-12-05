import { Request, Response } from 'express';
import { Result } from '../../config/result';
import { Encrypt } from '../../utils/Decorator';

export class ClientController {
  static 登录(req: Request, res: Response)  {
    res.json({
      code: 200,
      msg: '登录成功',
      data: {
        token: '123456',
      }
    });
  }

  static 注册(req: Request, res: Response) {
      res.json({
      code: 200,
      msg: '注册成功',
      data: {
        token: '123456',
      }
    });
  }

  static 注销(req: Request, res: Response) {
    res.json({
      code: 200,
      msg: '注销成功',
      data: null,
    });
  }

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

  @Encrypt
  static demo(req: Request, res: Response) {
    res.json({
      code: 200,
      msg: 'client demo成功',
      data: {
        id: 123456,
        name: '张三',
        email: 'zhangsan@example.com',
      },
    });
  }
}