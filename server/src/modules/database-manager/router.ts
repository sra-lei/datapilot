/**
 * 数据库管理模块 - 路由
 */

import { Router } from 'express';
import { databaseManagerController } from './controller';

const router = Router();

// 获取所有表
router.get('/tables', (req, res) => databaseManagerController.getTables(req, res));

// 获取表结构
router.get('/tables/:name/info', (req, res) => databaseManagerController.getTableInfo(req, res));

// 获取表数据
router.get('/tables/:name/data', (req, res) => databaseManagerController.getTableData(req, res));

// 执行查询
router.post('/query', (req, res) => databaseManagerController.executeQuery(req, res));

// 获取统计信息
router.get('/stats', (req, res) => databaseManagerController.getStats(req, res));

export default router;
