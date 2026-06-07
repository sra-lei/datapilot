/**
 * 统一响应格式工具
 */
import { Response } from 'express';
export declare function success<T>(res: Response, data?: T | null, message?: string): Response;
export declare function error(res: Response, code: number, message: string): Response;
//# sourceMappingURL=response.d.ts.map