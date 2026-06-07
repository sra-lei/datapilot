"use strict";
/**
 * 用户服务层
 * 处理用户相关业务逻辑
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.changePassword = changePassword;
const db_1 = require("../../config/db");
const types_1 = require("./types");
const constants_1 = require("./constants");
/**
 * 用户注册
 */
async function register(params) {
    try {
        const { username, password, email } = params;
        const [result] = await db_1.pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email || null]);
        return {
            success: true,
            data: {
                id: result.insertId,
                username,
                email: email || null,
            },
        };
    }
    catch (err) {
        const error = err;
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.CONFLICT,
                    message: constants_1.MESSAGES.USER_ALREADY_EXISTS,
                },
            };
        }
        return {
            success: false,
            error: {
                code: types_1.ErrorCode.INTERNAL_ERROR,
                message: constants_1.MESSAGES.REGISTER_FAILED,
            },
        };
    }
}
/**
 * 用户登录
 */
async function login(params) {
    try {
        const { username, password } = params;
        const [rows] = await db_1.pool.query('SELECT id, username, email FROM users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.UNAUTHORIZED,
                    message: constants_1.MESSAGES.PASSWORD_ERROR,
                },
            };
        }
        return {
            success: true,
            data: rows[0],
        };
    }
    catch (_err) {
        return {
            success: false,
            error: {
                code: types_1.ErrorCode.INTERNAL_ERROR,
                message: constants_1.MESSAGES.LOGIN_FAILED,
            },
        };
    }
}
/**
 * 修改密码
 */
async function changePassword(params) {
    try {
        const { username, oldPassword, newPassword } = params;
        const [rows] = await db_1.pool.query('SELECT id FROM users WHERE username = ? AND password = ?', [username, oldPassword]);
        if (rows.length === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.UNAUTHORIZED,
                    message: constants_1.MESSAGES.OLD_PASSWORD_ERROR,
                },
            };
        }
        await db_1.pool.query('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
        return { success: true };
    }
    catch (_err) {
        return {
            success: false,
            error: {
                code: types_1.ErrorCode.INTERNAL_ERROR,
                message: constants_1.MESSAGES.CHANGE_PASSWORD_FAILED,
            },
        };
    }
}
//# sourceMappingURL=service.js.map