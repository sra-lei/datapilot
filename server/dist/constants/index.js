"use strict";
/**
 * 统一导出 - 常量模块
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_OPERATIONS = exports.SYSTEM_MESSAGES = void 0;
__exportStar(require("./userConstants"), exports);
exports.SYSTEM_MESSAGES = {
    DB_INIT_SUCCESS: '数据库初始化成功',
    DB_INIT_FAILED: '数据库初始化失败',
    DB_CONNECTION_FAILED: '数据库连接失败',
    SERVER_START_SUCCESS: '服务器启动成功',
    SERVER_START_FAILED: '服务器启动失败',
    SERVER_STOP_SUCCESS: '服务器停止成功',
};
exports.SYSTEM_OPERATIONS = {
    DB_INIT: 'DB_INIT',
    DB_QUERY: 'DB_QUERY',
    DB_INSERT: 'DB_INSERT',
    DB_UPDATE: 'DB_UPDATE',
    DB_DELETE: 'DB_DELETE',
    SERVER_START: 'SERVER_START',
    SERVER_STOP: 'SERVER_STOP',
    SERVER_ERROR: 'SERVER_ERROR',
    REQUEST: 'REQUEST',
    VALIDATION: 'VALIDATION',
};
//# sourceMappingURL=index.js.map