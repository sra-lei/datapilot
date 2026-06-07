"use strict";
/**
 * 统一日志工具
 * 提供结构化日志记录方法，便于搜索和排查问题
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.OPERATIONS = void 0;
exports.generateTraceId = generateTraceId;
exports.logUserOperation = logUserOperation;
exports.logError = logError;
exports.logWarn = logWarn;
exports.logDebug = logDebug;
exports.logDatabase = logDatabase;
exports.logSystem = logSystem;
const winston_1 = __importDefault(require("winston"));
// 操作类型 - 用于日志分类
exports.OPERATIONS = {
    // 用户操作
    USER_REGISTER: 'USER_REGISTER',
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT',
    USER_CHANGE_PASSWORD: 'USER_CHANGE_PASSWORD',
    USER_GET_INFO: 'USER_GET_INFO',
    USER_UPDATE_INFO: 'USER_UPDATE_INFO',
    // 数据库操作
    DB_INIT: 'DB_INIT',
    DB_QUERY: 'DB_QUERY',
    DB_INSERT: 'DB_INSERT',
    DB_UPDATE: 'DB_UPDATE',
    DB_DELETE: 'DB_DELETE',
    // 系统操作
    SERVER_START: 'SERVER_START',
    SERVER_STOP: 'SERVER_STOP',
    SERVER_ERROR: 'SERVER_ERROR',
    // 通用操作
    REQUEST: 'REQUEST',
    VALIDATION: 'VALIDATION',
};
// 创建日志实例
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    defaultMeta: { service: 'trae-server' },
    transports: [
        // 控制台输出
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                const operation = meta.operation || '-';
                const userId = meta.userId || '-';
                const traceId = meta.traceId || '-';
                let log = `${timestamp} [${level.padEnd(5)}] [${operation.padEnd(20)}] ${message}`;
                const context = [];
                if (userId !== '-')
                    context.push(`userId=${userId}`);
                if (traceId !== '-')
                    context.push(`traceId=${traceId}`);
                if (context.length > 0) {
                    log += ` | ${context.join(' | ')}`;
                }
                const metaKeys = ['operation', 'userId', 'traceId', 'service'];
                const extraMeta = Object.keys(meta)
                    .filter(key => !metaKeys.includes(key))
                    .reduce((obj, key) => {
                    obj[key] = meta[key];
                    return obj;
                }, {});
                if (Object.keys(extraMeta).length > 0) {
                    log += ` | ${JSON.stringify(extraMeta)}`;
                }
                return log;
            })),
        }),
        // 文件输出 - 所有日志
        new winston_1.default.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 10,
            tailable: true,
        }),
        // 文件输出 - 错误日志
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 10,
            tailable: true,
        }),
        // 文件输出 - 用户操作日志
        new winston_1.default.transports.File({
            filename: 'logs/user.log',
            level: 'info',
            maxsize: 5242880,
            maxFiles: 10,
            tailable: true,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        }),
    ],
});
exports.logger = logger;
/**
 * 生成追踪ID
 */
function generateTraceId() {
    return `TRACE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
/**
 * 记录用户操作日志
 */
function logUserOperation(operation, message, context = {}) {
    logger.info(message, {
        operation,
        ...context,
    });
}
/**
 * 记录错误日志
 */
function logError(operation, message, err, context = {}) {
    const error = err;
    logger.error(message, {
        operation,
        errorMessage: error?.message || String(err),
        errorStack: error?.stack || '',
        ...context,
    });
}
/**
 * 记录警告日志
 */
function logWarn(operation, message, context = {}) {
    logger.warn(message, {
        operation,
        ...context,
    });
}
/**
 * 记录调试日志
 */
function logDebug(operation, message, context = {}) {
    logger.debug(message, {
        operation,
        ...context,
    });
}
/**
 * 记录数据库操作日志
 */
function logDatabase(operation, message, context = {}) {
    logger.info(message, {
        operation,
        ...context,
    });
}
/**
 * 记录系统日志
 */
function logSystem(operation, message, context = {}) {
    logger.info(message, {
        operation,
        ...context,
    });
}
//# sourceMappingURL=logUtils.js.map