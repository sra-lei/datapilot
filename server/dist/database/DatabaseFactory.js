"use strict";
/**
 * 数据库工厂类
 * 根据环境配置创建相应的数据库适配器
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseFactory = void 0;
exports.getDatabaseConfigFromEnv = getDatabaseConfigFromEnv;
const SQLiteAdapter_1 = require("./SQLiteAdapter");
const MySQLAdapter_1 = require("./MySQLAdapter");
// 默认配置
const defaultConfig = {
    type: process.env.NODE_ENV === 'production' ? 'mysql' : 'sqlite',
    sqlite: {
        dbPath: process.env.SQLITE_DB_PATH || './data/trae.db',
    },
    mysql: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'trae',
    },
};
/**
 * 数据库工厂类
 */
class DatabaseFactory {
    /**
     * 创建数据库适配器
     * @param config 数据库配置，默认从环境变量读取
     */
    static createAdapter(config = defaultConfig) {
        switch (config.type) {
            case 'sqlite':
                return new SQLiteAdapter_1.SQLiteAdapter(config.sqlite?.dbPath || './data/trae.db');
            case 'mysql':
                if (!config.mysql) {
                    throw new Error('MySQL配置未提供');
                }
                return new MySQLAdapter_1.MySQLAdapter(config.mysql);
            default:
                throw new Error(`不支持的数据库类型: ${config.type}`);
        }
    }
    /**
     * 获取数据库适配器实例（单例）
     */
    static getInstance(config = defaultConfig) {
        if (!DatabaseFactory.instance) {
            DatabaseFactory.instance = DatabaseFactory.createAdapter(config);
        }
        return DatabaseFactory.instance;
    }
    /**
     * 初始化数据库
     */
    static async initialize(config = defaultConfig) {
        const adapter = DatabaseFactory.getInstance(config);
        await adapter.initialize();
        return adapter;
    }
    /**
     * 关闭数据库连接
     */
    static async close() {
        if (DatabaseFactory.instance) {
            await DatabaseFactory.instance.close();
            DatabaseFactory.instance = null;
        }
    }
    /**
     * 重置实例（用于测试）
     */
    static reset() {
        DatabaseFactory.instance = null;
    }
}
exports.DatabaseFactory = DatabaseFactory;
DatabaseFactory.instance = null;
// 从环境变量读取数据库配置
function getDatabaseConfigFromEnv() {
    const dbType = (process.env.DB_TYPE || 'sqlite');
    return {
        type: dbType,
        sqlite: {
            dbPath: process.env.SQLITE_DB_PATH || './data/trae.db',
        },
        mysql: {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'trae',
        },
    };
}
//# sourceMappingURL=DatabaseFactory.js.map