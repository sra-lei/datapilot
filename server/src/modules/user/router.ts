/**
 * 用户路由
 */

import { Router } from 'express';
import { register, login, changePassword } from './controller';
import { requirePermission } from '../middleware/permission';

const router = Router();

// 用户注册（公开接口，用于用户自行注册）
router.post('/register', register);

// 用户登录
router.post('/login', login);

// 修改密码
router.post('/change-password', changePassword);

export default router;
