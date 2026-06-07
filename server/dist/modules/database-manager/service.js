"use strict";
/**
 * 数据库管理模块 - 服务层
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
exports.databaseManagerService = exports.DatabaseManagerService = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
class DatabaseManagerService {
    constructor() {
        // 从环境变量或默认路径获取数据库路径
        this.dbPath = process.env.SQLITE_DB_PATH || path_1.default.join(process.cwd(), 'data', 'trae.db');
    }
    /**
     * 获取数据库连接（直接使用 better-sqlite3）
     */
    getDb() {
        return new better_sqlite3_1.default(this.dbPath);
    }
    /**
     * 获取所有表信息
     */
    async getTables() {
        try {
            const db = this.getDb();
            const tables = db.prepare("SELECT name, type FROM sqlite_master WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'").all();
            db.close();
            return {
                success: true,
                data: tables,
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 500,
                    message: `获取表列表失败: ${error.message}`,
                },
            };
        }
    }
    /**
     * 获取表结构信息
     */
    async getTableInfo(tableName) {
        try {
            const db = this.getDb();
            const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all();
            db.close();
            return {
                success: true,
                data: columns,
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 500,
                    message: `获取表结构失败: ${error.message}`,
                },
            };
        }
    }
    /**
     * 执行查询
     */
    async executeQuery(sql) {
        try {
            // 安全检查：只允许 SELECT 查询
            const trimmedSql = sql.trim().toLowerCase();
            if (!trimmedSql.startsWith('select')) {
                return {
                    success: false,
                    error: {
                        code: 403,
                        message: '只允许执行 SELECT 查询',
                    },
                };
            }
            const db = this.getDb();
            const stmt = db.prepare(sql);
            // 获取列信息
            const columns = stmt.columns().map((col) => col.name);
            // 执行查询
            const rows = stmt.all();
            db.close();
            return {
                success: true,
                data: {
                    columns,
                    rows,
                    rowCount: rows.length,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 500,
                    message: `查询失败: ${error.message}`,
                },
            };
        }
    }
    /**
     * 获取表数据预览
     */
    async getTableData(tableName, limit = 100) {
        try {
            const db = this.getDb();
            // 获取列信息
            const columnsResult = db.prepare(`PRAGMA table_info("${tableName}")`).all();
            const columns = columnsResult.map((col) => col.name);
            // 执行查询
            const rows = db.prepare(`SELECT * FROM "${tableName}" LIMIT ?`).all(limit);
            db.close();
            return {
                success: true,
                data: {
                    columns,
                    rows,
                    rowCount: rows.length,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 500,
                    message: `获取表数据失败: ${error.message}`,
                },
            };
        }
    }
    /**
     * 获取数据库统计信息
     */
    async getDatabaseStats() {
        try {
            const db = this.getDb();
            // 获取表数量
            const tableCount = db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").get();
            // 获取总行数
            const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
            const tableStats = {};
            let totalRows = 0;
            for (const table of tables) {
                const count = db.prepare(`SELECT COUNT(*) as count FROM "${table.name}"`).get();
                tableStats[table.name] = count.count;
                totalRows += count.count;
            }
            // 获取数据库文件大小
            const fs = await Promise.resolve().then(() => __importStar(require('fs')));
            const stats = fs.statSync(this.dbPath);
            db.close();
            return {
                success: true,
                data: {
                    tableCount: tableCount.count,
                    totalRows,
                    tableStats,
                    dbFileSize: stats.size,
                    dbFilePath: this.dbPath,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 500,
                    message: `获取数据库统计失败: ${error.message}`,
                },
            };
        }
    }
}
exports.DatabaseManagerService = DatabaseManagerService;
// 导出单例
exports.databaseManagerService = new DatabaseManagerService();
//# sourceMappingURL=service.js.map