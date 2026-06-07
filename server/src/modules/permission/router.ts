/**
 * 权限管理模块 - 路由
 */

import { Router } from 'express';
import { permissionController } from './controller';

const router = Router();

// 权限管理
router.get('/permissions', (req, res) => permissionController.getAllPermissions(req, res));
router.post('/permissions', (req, res) => permissionController.createPermission(req, res));
router.delete('/permissions/:id', (req, res) => permissionController.deletePermission(req, res));

// 角色管理
router.get('/roles', (req, res) => permissionController.getAllRoles(req, res));
router.get('/roles/:id', (req, res) => permissionController.getRoleWithPermissions(req, res));
router.post('/roles', (req, res) => permissionController.createRole(req, res));
router.put('/roles/:id', (req, res) => permissionController.updateRole(req, res));
router.delete('/roles/:id', (req, res) => permissionController.deleteRole(req, res));

// 角色权限管理
router.post('/roles/:id/permissions', (req, res) => permissionController.grantPermission(req, res));
router.delete('/roles/:roleId/permissions/:permissionId', (req, res) => permissionController.revokePermission(req, res));

// 用户角色管理
router.post('/users/:userId/roles', (req, res) => permissionController.assignRole(req, res));
router.delete('/users/:userId/roles/:roleId', (req, res) => permissionController.revokeRole(req, res));

// 用户权限查询
router.get('/users/:userId/permissions', (req, res) => permissionController.getUserPermissions(req, res));

export default router;
