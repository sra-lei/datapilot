"use strict";
/**
 * 用户控制器
 * 处理用户请求和响应
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.changePassword = changePassword;
exports.deleteUser = deleteUser;
exports.updateUserStatus = updateUserStatus;
const response_1 = require("../../utils/response");
const logUtils_1 = require("../../utils/logUtils");
const constants_1 = require("./constants");
const userService = __importStar(require("./service"));
const types_1 = require("./types");
const permission_1 = require("../permission");
/**
 * 用户注册
 */
async function register(req, res) {
    const traceId = (0, logUtils_1.generateTraceId)();
    const { username, password, email, roleId } = req.body;
    if (!username || !password) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_REGISTER, constants_1.MESSAGES.ALL_FIELDS_REQUIRED, {
            traceId,
            username,
            reason: '缺少必需参数',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, constants_1.MESSAGES.ALL_FIELDS_REQUIRED);
        return;
    }
    // 如果指定了角色ID，需要验证当前用户是否有管理员权限
    if (roleId) {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_REGISTER, '未登录用户尝试指定角色注册', {
                traceId,
                username,
                reason: '未登录',
            });
            (0, response_1.error)(res, constants_1.ErrorCode.UNAUTHORIZED, '请先登录');
            return;
        }
        try {
            const hasPermission = await permission_1.permissionService.hasPermission(parseInt(userId), 'user:create');
            if (!hasPermission) {
                (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_REGISTER, '没有权限创建用户', {
                    traceId,
                    username,
                    reason: '权限不足',
                });
                (0, response_1.error)(res, constants_1.ErrorCode.FORBIDDEN, '没有权限执行此操作');
                return;
            }
        }
        catch (permError) {
            (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_REGISTER, '权限验证失败', {
                traceId,
                username,
                reason: '权限验证异常',
            });
            (0, response_1.error)(res, constants_1.ErrorCode.INTERNAL_ERROR, '权限验证失败');
            return;
        }
    }
    const result = await userService.register({ username, password, email, roleId });
    if (!result.success) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_REGISTER, result.error.message, {
            traceId,
            username,
        });
        (0, response_1.error)(res, result.error.code, result.error.message);
        return;
    }
    (0, logUtils_1.logUserOperation)(constants_1.OPERATIONS.USER_REGISTER, constants_1.MESSAGES.REGISTER_SUCCESS, {
        traceId,
        userId: result.data.id,
        username,
        email: email || null,
        roleId,
    });
    (0, response_1.success)(res, result.data, constants_1.MESSAGES.REGISTER_SUCCESS);
}
/**
 * 用户登录
 */
async function login(req, res) {
    const traceId = (0, logUtils_1.generateTraceId)();
    const { username, password } = req.body;
    if (!username || !password) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_LOGIN, constants_1.MESSAGES.ALL_FIELDS_REQUIRED, {
            traceId,
            username: username || '未提供',
            reason: '缺少必需参数',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, constants_1.MESSAGES.ALL_FIELDS_REQUIRED);
        return;
    }
    const result = await userService.login({ username, password });
    if (!result.success) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_LOGIN, result.error.message, {
            traceId,
            username,
        });
        (0, response_1.error)(res, result.error.code, result.error.message);
        return;
    }
    (0, logUtils_1.logUserOperation)(constants_1.OPERATIONS.USER_LOGIN, constants_1.MESSAGES.LOGIN_SUCCESS, {
        traceId,
        userId: result.data.id,
        username,
    });
    (0, response_1.success)(res, result.data, constants_1.MESSAGES.LOGIN_SUCCESS);
}
/**
 * 修改密码
 */
async function changePassword(req, res) {
    const traceId = (0, logUtils_1.generateTraceId)();
    const { username, oldPassword, newPassword, force } = req.body;
    if (!username || !newPassword) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, constants_1.MESSAGES.ALL_FIELDS_REQUIRED, {
            traceId,
            username,
            reason: '缺少必需参数',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, constants_1.MESSAGES.ALL_FIELDS_REQUIRED);
        return;
    }
    // 强制修改需要管理员权限验证
    if (force) {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, '未登录用户尝试强制修改密码', {
                traceId,
                username,
                reason: '未登录',
            });
            (0, response_1.error)(res, constants_1.ErrorCode.UNAUTHORIZED, '请先登录');
            return;
        }
        try {
            const hasPermission = await permission_1.permissionService.hasPermission(parseInt(userId), 'user:update');
            if (!hasPermission) {
                (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, '没有权限修改用户密码', {
                    traceId,
                    username,
                    reason: '权限不足',
                });
                (0, response_1.error)(res, constants_1.ErrorCode.FORBIDDEN, '没有权限执行此操作');
                return;
            }
        }
        catch (permError) {
            (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, '权限验证失败', {
                traceId,
                username,
                reason: '权限验证异常',
            });
            (0, response_1.error)(res, constants_1.ErrorCode.INTERNAL_ERROR, '权限验证失败');
            return;
        }
        // 管理员强制修改密码，不需要原密码
        const result = await userService.updatePassword({ username, newPassword });
        if (!result.success) {
            (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, result.error.message, {
                traceId,
                username,
            });
            (0, response_1.error)(res, result.error.code, result.error.message);
            return;
        }
        (0, logUtils_1.logUserOperation)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, constants_1.MESSAGES.CHANGE_PASSWORD_SUCCESS, {
            traceId,
            username,
            operatorId: userId,
        });
        (0, response_1.success)(res, null, constants_1.MESSAGES.CHANGE_PASSWORD_SUCCESS);
        return;
    }
    // 普通用户修改密码，需要原密码
    if (!oldPassword) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, constants_1.MESSAGES.ALL_FIELDS_REQUIRED, {
            traceId,
            username,
            reason: '缺少原密码',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, '请输入原密码');
        return;
    }
    const result = await userService.changePassword({ username, oldPassword, newPassword });
    if (!result.success) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, result.error.message, {
            traceId,
            username,
        });
        (0, response_1.error)(res, result.error.code, result.error.message);
        return;
    }
    (0, logUtils_1.logUserOperation)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, constants_1.MESSAGES.CHANGE_PASSWORD_SUCCESS, {
        traceId,
        username,
    });
    (0, response_1.success)(res, null, constants_1.MESSAGES.CHANGE_PASSWORD_SUCCESS);
}
/**
 * 删除用户
 */
async function deleteUser(req, res) {
    const traceId = (0, logUtils_1.generateTraceId)();
    const idParam = req.params.id;
    const userId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
    if (isNaN(userId)) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_DELETE, '无效的用户ID', {
            traceId,
            userId: undefined,
            idParam,
            reason: '参数错误',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, '无效的用户ID');
        return;
    }
    // 获取要删除的用户信息
    const userResult = await userService.getUserById(userId);
    if (!userResult.success || !userResult.data) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_DELETE, '用户不存在', {
            traceId,
            userId,
            reason: '用户不存在',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.NOT_FOUND, '用户不存在');
        return;
    }
    const username = userResult.data.username;
    // 检查是否为管理员用户（保护管理员不被删除）
    if (username === 'Sra' || username === 'admin') {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_DELETE, '禁止删除管理员用户', {
            traceId,
            userId,
            username,
            reason: '管理员用户不可删除',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.FORBIDDEN, '管理员用户不可删除');
        return;
    }
    const result = await userService.deleteUser(userId);
    if (!result.success) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_DELETE, result.error.message, {
            traceId,
            userId,
            username,
        });
        (0, response_1.error)(res, result.error.code, result.error.message);
        return;
    }
    (0, logUtils_1.logUserOperation)(constants_1.OPERATIONS.USER_DELETE, constants_1.MESSAGES.DELETE_SUCCESS, {
        traceId,
        userId,
        username,
    });
    (0, response_1.success)(res, null, constants_1.MESSAGES.DELETE_SUCCESS);
}
/**
 * 更新用户状态
 */
async function updateUserStatus(req, res) {
    const traceId = (0, logUtils_1.generateTraceId)();
    const { userId, status } = req.body;
    if (!userId || !status) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_UPDATE_STATUS, constants_1.MESSAGES.ALL_FIELDS_REQUIRED, {
            traceId,
            reason: '缺少必需参数',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, constants_1.MESSAGES.ALL_FIELDS_REQUIRED);
        return;
    }
    // 验证状态值
    if (!Object.values(types_1.UserStatus).includes(status)) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_UPDATE_STATUS, '无效的状态值', {
            traceId,
            userId,
            status,
            reason: '状态值无效',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, '无效的状态值');
        return;
    }
    // 需要管理员权限
    const operatorId = req.headers['x-user-id'];
    if (!operatorId) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_UPDATE_STATUS, '未登录用户尝试更新用户状态', {
            traceId,
            userId,
            reason: '未登录',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.UNAUTHORIZED, '请先登录');
        return;
    }
    try {
        const hasPermission = await permission_1.permissionService.hasPermission(parseInt(operatorId), 'user:update');
        if (!hasPermission) {
            (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_UPDATE_STATUS, '没有权限更新用户状态', {
                traceId,
                userId,
                reason: '权限不足',
            });
            (0, response_1.error)(res, constants_1.ErrorCode.FORBIDDEN, '没有权限执行此操作');
            return;
        }
    }
    catch (permError) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_UPDATE_STATUS, '权限验证失败', {
            traceId,
            userId,
            reason: '权限验证异常',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.INTERNAL_ERROR, '权限验证失败');
        return;
    }
    const result = await userService.updateUserStatus({ userId, status });
    if (!result.success) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_UPDATE_STATUS, result.error.message, {
            traceId,
            userId,
        });
        (0, response_1.error)(res, result.error.code, result.error.message);
        return;
    }
    (0, logUtils_1.logUserOperation)(constants_1.OPERATIONS.USER_UPDATE_STATUS, constants_1.MESSAGES.UPDATE_STATUS_SUCCESS, {
        traceId,
        userId,
        operatorId,
        newStatus: status,
    });
    (0, response_1.success)(res, null, constants_1.MESSAGES.UPDATE_STATUS_SUCCESS);
}
//# sourceMappingURL=controller.js.map