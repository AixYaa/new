// 结果配置
export interface Result<T = any> {
  code: number;
  msg: string;
  data: T;
}