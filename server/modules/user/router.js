/**
 * 用户路由
 */

const express = require('express');
const router = express.Router();
const userController = require('./controller');

// 用户注册
router.post('/register', userController.register);

// 用户登录
router.post('/login', userController.login);

// 修改密码
router.post('/change-password', userController.changePassword);

module.exports = router;
