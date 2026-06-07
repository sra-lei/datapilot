/**
 * 数据库管理模块 - 控制器
 */
import { Request, Response } from 'express';
export declare class DatabaseManagerController {
    /**
     * 获取所有表
     * GET /api/database/tables
     */
    getTables(_req: Request, res: Response): Promise<void>;
    /**
     * 获取表结构
     * GET /api/database/tables/:name/info
     */
    getTableInfo(req: Request, res: Response): Promise<void>;
    /**
     * 获取表数据
     * GET /api/database/tables/:name/data
     */
    getTableData(req: Request, res: Response): Promise<void>;
    /**
     * 执行 SQL 查询
     * POST /api/database/query
     */
    executeQuery(req: Request, res: Response): Promise<void>;
    /**
     * 获取数据库统计信息
     * GET /api/database/stats
     */
    getStats(_req: Request, res: Response): Promise<void>;
}
export declare const databaseManagerController: DatabaseManagerController;
//# sourceMappingURL=controller.d.ts.map