"use strict";
/**
 * 用户服务层
 * 处理用户相关业务逻辑
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.changePassword = changePassword;
exports.updatePassword = updatePassword;
exports.getUserById = getUserById;
exports.updateUserStatus = updateUserStatus;
exports.deleteUser = deleteUser;
const database_1 = require("../../database");
const types_1 = require("./types");
const constants_1 = require("./constants");
const permission_1 = require("../permission");
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
        const { username, password, email, roleId } = params;
        const db = getDb();
        const result = await db.insert('INSERT INTO users (username, password, email, status) VALUES (?, ?, ?, ?)', [username, password, email || null, types_1.UserStatus.ACTIVE]);
        const userId = result.insertId;
        // 如果指定了角色ID，则为用户分配角色
        if (roleId) {
            await permission_1.permissionService.assignRole({ userId, roleId });
        }
        return {
            success: true,
            data: {
                id: userId,
                username,
                email: email || null,
                status: types_1.UserStatus.ACTIVE,
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
        const result = await db.query('SELECT id, username, email, status FROM users WHERE username = ? AND password = ?', [username, password]);
        if (!result.rows || result.rows.length === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.UNAUTHORIZED,
                    message: constants_1.MESSAGES.PASSWORD_ERROR,
                },
            };
        }
        const user = result.rows[0];
        // 检查用户状态
        if (user.status === types_1.UserStatus.INACTIVE) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.FORBIDDEN,
                    message: constants_1.MESSAGES.USER_INACTIVE,
                },
            };
        }
        if (user.status === types_1.UserStatus.DELETED) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.FORBIDDEN,
                    message: constants_1.MESSAGES.USER_DELETED,
                },
            };
        }
        // 获取用户的角色和权限
        const permResult = await permission_1.permissionService.getUserPermissions(user.id);
        let roles = [];
        let permissions = [];
        if (permResult.success && permResult.data) {
            roles = permResult.data.roles.map(r => r.name);
            permissions = permResult.data.permissions;
        }
        else {
            // 获取权限失败时返回登录错误，避免默认赋予高权限
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.INTERNAL_ERROR,
                    message: constants_1.MESSAGES.GET_PERMISSION_FAILED,
                },
            };
        }
        return {
            success: true,
            data: {
                ...user,
                roles,
                permissions,
            },
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
/**
 * 修改密码（管理员强制修改，不需要原密码）
 */
async function updatePassword(params) {
    try {
        const { username, newPassword } = params;
        const db = getDb();
        // 更新密码
        const result = await db.update('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
        if (result.affectedRows === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.NOT_FOUND,
                    message: constants_1.MESSAGES.USER_NOT_FOUND,
                },
            };
        }
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
/**
 * 根据ID获取用户信息
 */
async function getUserById(userId) {
    try {
        const db = getDb();
        const result = await db.query('SELECT id, username, email, status FROM users WHERE id = ?', [userId]);
        if (!result.rows || result.rows.length === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.NOT_FOUND,
                    message: constants_1.MESSAGES.USER_NOT_FOUND,
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
                message: '获取用户信息失败',
            },
        };
    }
}
/**
 * 更新用户状态
 */
async function updateUserStatus(params) {
    try {
        const { userId, status } = params;
        const db = getDb();
        // 检查用户是否存在
        const userCheck = await db.query('SELECT id, username FROM users WHERE id = ?', [userId]);
        if (!userCheck.rows || userCheck.rows.length === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.NOT_FOUND,
                    message: constants_1.MESSAGES.USER_NOT_FOUND,
                },
            };
        }
        const username = userCheck.rows[0].username;
        // 不能修改管理员状态
        if (username === 'Sra' || username === 'admin') {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.FORBIDDEN,
                    message: '不能修改管理员用户的状态',
                },
            };
        }
        // 更新用户状态
        const result = await db.update('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, userId]);
        if (result.affectedRows === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.NOT_FOUND,
                    message: constants_1.MESSAGES.USER_NOT_FOUND,
                },
            };
        }
        return { success: true };
    }
    catch (_err) {
        return {
            success: false,
            error: {
                code: types_1.ErrorCode.INTERNAL_ERROR,
                message: constants_1.MESSAGES.UPDATE_STATUS_FAILED,
            },
        };
    }
}
/**
 * 删除用户（改为停用状态）
 */
async function deleteUser(userId) {
    try {
        const db = getDb();
        // 检查用户是否存在
        const userCheck = await db.query('SELECT id, username FROM users WHERE id = ?', [userId]);
        if (!userCheck.rows || userCheck.rows.length === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.NOT_FOUND,
                    message: constants_1.MESSAGES.USER_NOT_FOUND,
                },
            };
        }
        const username = userCheck.rows[0].username;
        // 不能删除管理员
        if (username === 'Sra' || username === 'admin') {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.FORBIDDEN,
                    message: '不能删除管理员用户',
                },
            };
        }
        // 将用户状态改为 deleted（软删除）
        const result = await db.update('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [types_1.UserStatus.DELETED, userId]);
        if (result.affectedRows === 0) {
            return {
                success: false,
                error: {
                    code: types_1.ErrorCode.NOT_FOUND,
                    message: constants_1.MESSAGES.USER_NOT_FOUND,
                },
            };
        }
        return { success: true };
    }
    catch (_err) {
        return {
            success: false,
            error: {
                code: types_1.ErrorCode.INTERNAL_ERROR,
                message: constants_1.MESSAGES.DELETE_FAILED,
            },
        };
    }
}
//# sourceMappingURL=service.js.map