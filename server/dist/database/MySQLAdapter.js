"use strict";
/**
 * MySQL适配器
 * 用于生产环境
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLAdapter = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
class MySQLAdapter {
    constructor(config) {
        this.pool = null;
        this.config = config;
    }
    /**
     * 初始化数据库连接
     */
    async initialize() {
        this.pool = promise_1.default.createPool({
            host: this.config.host,
            port: this.config.port,
            user: this.config.user,
            password: this.config.password,
            database: this.config.database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        // 测试连接
        const connection = await this.pool.getConnection();
        connection.release();
    }
    /**
     * 执行查询
     */
    async query(sql, params) {
        if (!this.pool)
            throw new Error('Database not initialized');
        const [rows] = await this.pool.query(sql, params);
        return { rows: rows };
    }
    /**
     * 执行插入
     */
    async insert(sql, params) {
        if (!this.pool)
            throw new Error('Database not initialized');
        const [result] = await this.pool.query(sql, params);
        return {
            insertId: result.insertId,
            affectedRows: result.affectedRows,
        };
    }
    /**
     * 执行更新
     */
    async update(sql, params) {
        if (!this.pool)
            throw new Error('Database not initialized');
        const [result] = await this.pool.query(sql, params);
        return { affectedRows: result.affectedRows };
    }
    /**
     * 执行删除
     */
    async delete(sql, params) {
        if (!this.pool)
            throw new Error('Database not initialized');
        const [result] = await this.pool.query(sql, params);
        return { affectedRows: result.affectedRows };
    }
    /**
     * 关闭数据库连接
     */
    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }
    /**
     * 获取适配器名称
     */
    getName() {
        return 'MySQL';
    }
}
exports.MySQLAdapter = MySQLAdapter;
//# sourceMappingURL=MySQLAdapter.js.map