"use strict";
/**
 * 数据库管理模块 - 控制器
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseManagerController = exports.DatabaseManagerController = void 0;
const service_1 = require("./service");
const response_1 = require("../../utils/response");
class DatabaseManagerController {
    /**
     * 获取所有表
     * GET /api/database/tables
     */
    async getTables(_req, res) {
        const result = await service_1.databaseManagerService.getTables();
        if (result.success) {
            (0, response_1.success)(res, result.data, '获取表列表成功');
        }
        else {
            (0, response_1.error)(res, result.error.code, result.error.message);
        }
    }
    /**
     * 获取表结构
     * GET /api/database/tables/:name/info
     */
    async getTableInfo(req, res) {
        const name = String(req.params.name || '');
        if (!name) {
            (0, response_1.error)(res, 400, '表名不能为空');
            return;
        }
        const result = await service_1.databaseManagerService.getTableInfo(name);
        if (result.success) {
            (0, response_1.success)(res, result.data, '获取表结构成功');
        }
        else {
            (0, response_1.error)(res, result.error.code, result.error.message);
        }
    }
    /**
     * 获取表数据
     * GET /api/database/tables/:name/data
     */
    async getTableData(req, res) {
        const name = req.params.name;
        const limit = parseInt(req.query.limit) || 100;
        if (!name) {
            (0, response_1.error)(res, 400, '表名不能为空');
            return;
        }
        const result = await service_1.databaseManagerService.getTableData(name, limit);
        if (result.success) {
            (0, response_1.success)(res, result.data, '获取表数据成功');
        }
        else {
            (0, response_1.error)(res, result.error.code, result.error.message);
        }
    }
    /**
     * 执行 SQL 查询
     * POST /api/database/query
     */
    async executeQuery(req, res) {
        const { sql } = req.body;
        if (!sql) {
            (0, response_1.error)(res, 400, 'SQL 语句不能为空');
            return;
        }
        const result = await service_1.databaseManagerService.executeQuery(sql);
        if (result.success) {
            (0, response_1.success)(res, result.data, '查询成功');
        }
        else {
            (0, response_1.error)(res, result.error.code, result.error.message);
        }
    }
    /**
     * 获取数据库统计信息
     * GET /api/database/stats
     */
    async getStats(_req, res) {
        const result = await service_1.databaseManagerService.getDatabaseStats();
        if (result.success) {
            (0, response_1.success)(res, result.data, '获取统计信息成功');
        }
        else {
            (0, response_1.error)(res, result.error.code, result.error.message);
        }
    }
}
exports.DatabaseManagerController = DatabaseManagerController;
// 导出单例
exports.databaseManagerController = new DatabaseManagerController();
//# sourceMappingURL=controller.js.map