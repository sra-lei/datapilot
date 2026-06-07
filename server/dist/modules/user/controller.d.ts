/**
 * 用户控制器
 * 处理用户请求和响应
 */
import { Request, Response } from 'express';
/**
 * 用户注册
 */
export declare function register(req: Request, res: Response): Promise<void>;
/**
 * 用户登录
 */
export declare function login(req: Request, res: Response): Promise<void>;
/**
 * 修改密码
 */
export declare function changePassword(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=controller.d.ts.map