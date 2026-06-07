"use strict";
/**
 * SQLite适配器
 * 用于开发环境，无需额外安装数据库服务
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteAdapter = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class SQLiteAdapter {
    constructor(dbPath = './data/trae.db') {
        this.db = null;
        this.dbPath = dbPath;
    }
    /**
     * 初始化数据库连接
     */
    async initialize() {
        // 确保目录存在
        const fs = await Promise.resolve().then(() => __importStar(require('fs')));
        const path = await Promise.resolve().then(() => __importStar(require('path')));
        const dir = path.dirname(this.dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        this.db = new better_sqlite3_1.default(this.dbPath);
        this.db.pragma('journal_mode = WAL');
        // 初始化表结构
        this.initTables();
    }
    /**
     * 初始化表结构
     */
    initTables() {
        if (!this.db)
            throw new Error('Database not initialized');
        // 创建用户表
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    /**
     * 执行查询
     */
    async query(sql, params) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.db.prepare(sql);
            const rows = (params ? stmt.all(...params) : stmt.all());
            return { rows };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * 执行插入
     */
    async insert(sql, params) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.db.prepare(sql);
            const result = params ? stmt.run(...params) : stmt.run();
            return {
                insertId: Number(result.lastInsertRowid),
                affectedRows: result.changes,
            };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * 执行更新
     */
    async update(sql, params) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.db.prepare(sql);
            const result = params ? stmt.run(...params) : stmt.run();
            return { affectedRows: result.changes };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * 执行删除
     */
    async delete(sql, params) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.db.prepare(sql);
            const result = params ? stmt.run(...params) : stmt.run();
            return { affectedRows: result.changes };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * 执行DDL语句（创建表等）
     */
    async run(sql) {
        if (!this.db)
            throw new Error('Database not initialized');
        this.db.exec(sql);
    }
    /**
     * 关闭数据库连接
     */
    async close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
    /**
     * 获取适配器名称
     */
    getName() {
        return 'SQLite';
    }
    /**
     * 统一错误处理
     */
    handleError(error) {
        const err = error;
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return new Error('ER_DUP_ENTRY');
        }
        return error;
    }
}
exports.SQLiteAdapter = SQLiteAdapter;
//# sourceMappingURL=SQLiteAdapter.js.map