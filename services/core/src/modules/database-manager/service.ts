/**
 * 数据库管理模块 - 服务层
 */

import { DatabaseFactory } from '../../database';
import { TableInfo, ColumnInfo, QueryResult, ServiceResult } from './types';
import Database from 'better-sqlite3';
import path from 'path';

export class DatabaseManagerService {
  private dbPath: string;

  constructor() {
    // 从环境变量或默认路径获取数据库路径
    this.dbPath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'trae.db');
  }

  /**
   * 获取数据库连接（直接使用 better-sqlite3）
   */
  private getDb(): Database.Database {
    return new Database(this.dbPath);
  }

  /**
   * 获取所有表信息
   */
  async getTables(): Promise<ServiceResult<TableInfo[]>> {
    try {
      const db = this.getDb();
      const tables = db.prepare(
        "SELECT name, type FROM sqlite_master WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'"
      ).all() as TableInfo[];
      db.close();

      return {
        success: true,
        data: tables,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: `获取表列表失败: ${(error as Error).message}`,
        },
      };
    }
  }

  /**
   * 获取表结构信息
   */
  async getTableInfo(tableName: string): Promise<ServiceResult<ColumnInfo[]>> {
    try {
      const db = this.getDb();
      const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all() as ColumnInfo[];
      db.close();

      return {
        success: true,
        data: columns,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: `获取表结构失败: ${(error as Error).message}`,
        },
      };
    }
  }

  /**
   * 执行查询
   */
  async executeQuery(sql: string): Promise<ServiceResult<QueryResult>> {
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
      const columns = stmt.columns().map((col: { name: string }) => col.name);

      // 执行查询
      const rows = stmt.all() as Record<string, unknown>[];
      db.close();

      return {
        success: true,
        data: {
          columns,
          rows,
          rowCount: rows.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: `查询失败: ${(error as Error).message}`,
        },
      };
    }
  }

  /**
   * 获取表数据预览
   */
  async getTableData(tableName: string, limit: number = 100): Promise<ServiceResult<QueryResult>> {
    try {
      const db = this.getDb();

      // 获取列信息
      const columnsResult = db.prepare(`PRAGMA table_info("${tableName}")`).all() as ColumnInfo[];
      const columns = columnsResult.map((col) => col.name);

      // 执行查询
      const rows = db.prepare(`SELECT * FROM "${tableName}" LIMIT ?`).all(limit) as Record<string, unknown>[];
      db.close();

      return {
        success: true,
        data: {
          columns,
          rows,
          rowCount: rows.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: `获取表数据失败: ${(error as Error).message}`,
        },
      };
    }
  }

  /**
   * 获取数据库统计信息
   */
  async getDatabaseStats(): Promise<ServiceResult<Record<string, unknown>>> {
    try {
      const db = this.getDb();

      // 获取表数量
      const tableCount = db.prepare(
        "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      ).get() as { count: number };

      // 获取总行数
      const tables = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      ).all() as { name: string }[];

      const tableStats: Record<string, number> = {};
      let totalRows = 0;

      for (const table of tables) {
        const count = db.prepare(`SELECT COUNT(*) as count FROM "${table.name}"`).get() as { count: number };
        tableStats[table.name] = count.count;
        totalRows += count.count;
      }

      // 获取数据库文件大小
      const fs = await import('fs');
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
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: `获取数据库统计失败: ${(error as Error).message}`,
        },
      };
    }
  }
}

// 导出单例
export const databaseManagerService = new DatabaseManagerService();
