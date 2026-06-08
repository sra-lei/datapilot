/**
 * SQLite适配器
 * 用于开发环境，无需额外安装数据库服务
 */

import Database from 'better-sqlite3';
import { IDatabaseAdapter, QueryResult, QueryRow } from './IDatabaseAdapter';
import { DB_CONFIG, DB_ERRORS, DB_ADAPTER_NAMES } from '../constants';

export class SQLiteAdapter implements IDatabaseAdapter {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor(dbPath: string = DB_CONFIG.DEFAULT_DB_PATH) {
    this.dbPath = dbPath;
  }

  /**
   * 初始化数据库连接
   */
  async initialize(): Promise<void> {
    // 确保目录存在
    const fs = await import('fs');
    const path = await import('path');
    const dir = path.dirname(this.dbPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    this.db.pragma(`journal_mode = ${DB_CONFIG.JOURNAL_MODE}`);

    // 初始化表结构
    this.initTables();
  }

  /**
   * 初始化表结构
   */
  private initTables(): void {
    if (!this.db) throw new Error(DB_ERRORS.NOT_INITIALIZED);

    // 创建用户表（包含状态字段）
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'deleted')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 检查并添加状态字段（兼容旧数据库）
    try {
      this.db.exec(`ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'`);
    } catch (error) {
      // 字段已存在，忽略错误
    }
  }

  /**
   * 执行查询
   */
  async query(sql: string, params?: unknown[]): Promise<QueryResult> {
    if (!this.db) throw new Error(DB_ERRORS.NOT_INITIALIZED);

    try {
      const stmt = this.db.prepare(sql);
      const rows = (params ? stmt.all(...params) : stmt.all()) as QueryRow[];
      return { rows };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 执行插入
   */
  async insert(sql: string, params?: unknown[]): Promise<QueryResult> {
    if (!this.db) throw new Error(DB_ERRORS.NOT_INITIALIZED);

    try {
      const stmt = this.db.prepare(sql);
      const result = params ? stmt.run(...params) : stmt.run();
      return {
        insertId: Number(result.lastInsertRowid),
        affectedRows: result.changes,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 执行更新
   */
  async update(sql: string, params?: unknown[]): Promise<QueryResult> {
    if (!this.db) throw new Error(DB_ERRORS.NOT_INITIALIZED);

    try {
      const stmt = this.db.prepare(sql);
      const result = params ? stmt.run(...params) : stmt.run();
      return { affectedRows: result.changes };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 执行删除
   */
  async delete(sql: string, params?: unknown[]): Promise<QueryResult> {
    if (!this.db) throw new Error(DB_ERRORS.NOT_INITIALIZED);

    try {
      const stmt = this.db.prepare(sql);
      const result = params ? stmt.run(...params) : stmt.run();
      return { affectedRows: result.changes };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 执行DDL语句（创建表等）
   */
  async run(sql: string): Promise<void> {
    if (!this.db) throw new Error(DB_ERRORS.NOT_INITIALIZED);
    this.db.exec(sql);
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * 获取适配器名称
   */
  getName(): string {
    return DB_ADAPTER_NAMES.SQLITE;
  }

  /**
   * 统一错误处理
   */
  private handleError(error: unknown): Error {
    const err = error as { code?: string; message?: string };
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return new Error(DB_ERRORS.DUPLICATE_ENTRY);
    }
    return error as Error;
  }
}
