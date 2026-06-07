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
const response_1 = require("../../utils/response");
const logUtils_1 = require("../../utils/logUtils");
const constants_1 = require("./constants");
const userService = __importStar(require("./service"));
/**
 * 用户注册
 */
async function register(req, res) {
    const traceId = (0, logUtils_1.generateTraceId)();
    const { username, password, email } = req.body;
    if (!username || !password) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_REGISTER, constants_1.MESSAGES.ALL_FIELDS_REQUIRED, {
            traceId,
            username,
            reason: '缺少必需参数',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, constants_1.MESSAGES.ALL_FIELDS_REQUIRED);
        return;
    }
    const result = await userService.register({ username, password, email });
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
    const { username, oldPassword, newPassword } = req.body;
    if (!username || !oldPassword || !newPassword) {
        (0, logUtils_1.logWarn)(constants_1.OPERATIONS.USER_CHANGE_PASSWORD, constants_1.MESSAGES.ALL_FIELDS_REQUIRED, {
            traceId,
            username,
            reason: '缺少必需参数',
        });
        (0, response_1.error)(res, constants_1.ErrorCode.BAD_REQUEST, constants_1.MESSAGES.ALL_FIELDS_REQUIRED);
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
//# sourceMappingURL=controller.js.map