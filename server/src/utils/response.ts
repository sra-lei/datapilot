/**
 * 统一响应格式工具
 */

import { Response } from 'express';

// 成功响应
export function success<T>(res: Response, data: T | null = null, message: string = '操作成功'): Response {
  return res.status(200).json({
    code: 200,
    message,
    data,
  });
}

// 错误响应
export function error(res: Response, code: number, message: string): Response {
  return res.status(code).json({
    code,
    message,
  });
}
