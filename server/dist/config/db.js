"use strict";
/**
 * 数据库配置和初始化
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.initDatabase = initDatabase;
const promise_1 = __importDefault(require("mysql2/promise"));
const database_1 = __importDefault(require("./database"));
const logUtils_1 = require("../utils/logUtils");
exports.pool = promise_1.default.createPool(database_1.default);
// 初始化数据库和表
async function initDatabase() {
    const traceId = (0, logUtils_1.generateTraceId)();
    const connection = await exports.pool.getConnection();
    try {
        const { logDatabase, logError, OPERATIONS } = require('../utils/logUtils');
        const { SYSTEM_MESSAGES } = require('../constants');
        logDatabase(OPERATIONS.DB_INIT, '开始初始化数据库', {
            traceId,
            database: database_1.default.database,
            host: database_1.default.host,
        });
        // 创建数据库（如果不存在）
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${database_1.default.database}`);
        await connection.query(`USE ${database_1.default.database}`);
        // 创建用户表
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        logDatabase(OPERATIONS.DB_INIT, SYSTEM_MESSAGES.DB_INIT_SUCCESS, {
            traceId,
            tables: ['users'],
        });
    }
    catch (error) {
        const { logError, OPERATIONS } = require('../utils/logUtils');
        const { SYSTEM_MESSAGES } = require('../constants');
        logError(OPERATIONS.DB_INIT, SYSTEM_MESSAGES.DB_INIT_FAILED, error, {
            traceId,
            database: database_1.default.database,
        });
        throw error;
    }
    finally {
        connection.release();
    }
}
//# sourceMappingURL=db.js.map