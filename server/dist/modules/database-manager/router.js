"use strict";
/**
 * 数据库管理模块 - 路由
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
// 获取所有表
router.get('/tables', (req, res) => controller_1.databaseManagerController.getTables(req, res));
// 获取表结构
router.get('/tables/:name/info', (req, res) => controller_1.databaseManagerController.getTableInfo(req, res));
// 获取表数据
router.get('/tables/:name/data', (req, res) => controller_1.databaseManagerController.getTableData(req, res));
// 执行查询
router.post('/query', (req, res) => controller_1.databaseManagerController.executeQuery(req, res));
// 获取统计信息
router.get('/stats', (req, res) => controller_1.databaseManagerController.getStats(req, res));
exports.default = router;
//# sourceMappingURL=router.js.map