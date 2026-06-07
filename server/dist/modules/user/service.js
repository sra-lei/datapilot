"use strict";
/**
 * 用户服务层
 * 处理用户相关业务逻辑
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.changePassword = changePassword;
const database_1 = require("../../database");
const types_1 = require("./types");
const constants_1 = require("./constants");
/**
 * 获取数据库适配器
 */
function getDb() {
    return database_1.DatabaseFactory.getInstance();
}
/**
 * 用户注册
 */
async function register(params) {
    try {
        const { username, password, email } = params;
        const db = getDb();
        const result = await db.insert('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email || null]);
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
        if (error.message === 'ER_DUP_ENTRY') {
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
        const db = getDb();
        const result = await db.query('SELECT id, username, email FROM users WHERE username = ? AND password = ?', [username, password]);
        if (!result.rows || result.rows.length === 0) {
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
            data: result.rows[0],
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
        const db = getDb();
        // 验证旧密码
        const result = await db.query('SELECT id FROM users WHERE username = ? AND password = ?', [username, oldPassword]);
        if (!result.rows || result.rows.length === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.UNAUTHORIZED,
                    message: constants_1.MESSAGES.OLD_PASSWORD_ERROR,
                },
            };
        }
        // 更新密码
        await db.update('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
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