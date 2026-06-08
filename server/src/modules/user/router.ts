/**
 * 用户路由
 */

import { Router } from 'express';
import { register, login, changePassword, deleteUser, updateUserStatus } from './controller';
import { requirePermission } from '../../middleware/permission';

const router = Router();

// 用户注册（公开接口，用于用户自行注册）
router.post('/register', register);

// 用户登录
router.post('/login', login);

// 修改密码
router.post('/change-password', changePassword);

// 删除用户（需要管理员权限）- 软删除，改为停用状态
router.delete('/:id', requirePermission('user:delete'), deleteUser);

// 更新用户状态（需要管理员权限）
router.put('/status', requirePermission('user:update'), updateUserStatus);

export default router;
