"use strict";
/**
 * 用户路由
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const permission_1 = require("../../middleware/permission");
const router = (0, express_1.Router)();
// 用户注册（公开接口，用于用户自行注册）
router.post('/register', controller_1.register);
// 用户登录
router.post('/login', controller_1.login);
// 修改密码
router.post('/change-password', controller_1.changePassword);
// 删除用户（需要管理员权限）- 软删除，改为停用状态
router.delete('/:id', (0, permission_1.requirePermission)('user:delete'), controller_1.deleteUser);
// 更新用户状态（需要管理员权限）
router.put('/status', (0, permission_1.requirePermission)('user:update'), controller_1.updateUserStatus);
exports.default = router;
//# sourceMappingURL=router.js.map