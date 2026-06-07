"use strict";
/**
 * 用户路由
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
// 用户注册
router.post('/register', controller_1.register);
// 用户登录
router.post('/login', controller_1.login);
// 修改密码
router.post('/change-password', controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=router.js.map