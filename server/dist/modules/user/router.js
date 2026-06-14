"use strict";
/**
 * 用户路由
 * @swagger
 * tags:
 *   name: 用户管理
 *   description: 用户注册、登录、状态管理等接口
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const permission_1 = require("../../middleware/permission");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: 用户注册
 *     tags: [用户管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterParams'
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 参数错误
 */
router.post('/register', controller_1.register);
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: 用户登录
 *     tags: [用户管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginParams'
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 用户名或密码错误
 *       403:
 *         description: 用户已被停用或删除
 */
router.post('/login', controller_1.login);
/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: 修改密码
 *     tags: [用户管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordParams'
 *     responses:
 *       200:
 *         description: 密码修改成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 参数错误
 *       401:
 *         description: 未授权（强制修改时）
 *       403:
 *         description: 权限不足（强制修改时）
 */
router.post('/change-password', controller_1.changePassword);
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: 删除用户（软删除）
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 无效的用户ID
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足或管理员用户不可删除
 *       404:
 *         description: 用户不存在
 */
router.delete('/:id', (0, permission_1.requirePermission)('user:delete'), controller_1.deleteUser);
/**
 * @swagger
 * /api/user/status:
 *   put:
 *     summary: 更新用户状态
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserStatusParams'
 *     responses:
 *       200:
 *         description: 状态更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 参数错误
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足或管理员用户不可修改
 *       404:
 *         description: 用户不存在
 */
router.put('/status', (0, permission_1.requirePermission)('user:update'), controller_1.updateUserStatus);
exports.default = router;
//# sourceMappingURL=router.js.map