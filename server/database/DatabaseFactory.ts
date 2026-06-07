/**
 * 数据库工厂类
 * 根据环境配置创建相应的数据库适配器
 */

import { IDatabaseAdapter } from './IDatabaseAdapter';
import { SQLiteAdapter } from './SQLiteAdapter';
import { MySQLAdapter, MySQLConfig } from './MySQLAdapter';

export type DatabaseType = 'sqlite' | 'mysql';

export interface DatabaseConfig {
  type: DatabaseType;
  sqlite?: {
    dbPath: string;
  };
  mysql?: MySQLConfig;
}

// 默认配置
const defaultConfig: DatabaseConfig = {
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
export class DatabaseFactory {
  private static instance: IDatabaseAdapter | null = null;

  /**
   * 创建数据库适配器
   * @param config 数据库配置，默认从环境变量读取
   */
  static createAdapter(config: DatabaseConfig = defaultConfig): IDatabaseAdapter {
    switch (config.type) {
      case 'sqlite':
        return new SQLiteAdapter(config.sqlite?.dbPath || './data/trae.db');

      case 'mysql':
        if (!config.mysql) {
          throw new Error('MySQL配置未提供');
        }
        return new MySQLAdapter(config.mysql);

      default:
        throw new Error(`不支持的数据库类型: ${config.type}`);
    }
  }

  /**
   * 获取数据库适配器实例（单例）
   */
  static getInstance(config: DatabaseConfig = defaultConfig): IDatabaseAdapter {
    if (!DatabaseFactory.instance) {
      DatabaseFactory.instance = DatabaseFactory.createAdapter(config);
    }
    return DatabaseFactory.instance;
  }

  /**
   * 初始化数据库
   */
  static async initialize(config: DatabaseConfig = defaultConfig): Promise<IDatabaseAdapter> {
    const adapter = DatabaseFactory.getInstance(config);
    await adapter.initialize();
    return adapter;
  }

  /**
   * 关闭数据库连接
   */
  static async close(): Promise<void> {
    if (DatabaseFactory.instance) {
      await DatabaseFactory.instance.close();
      DatabaseFactory.instance = null;
    }
  }

  /**
   * 重置实例（用于测试）
   */
  static reset(): void {
    DatabaseFactory.instance = null;
  }
}

// 从环境变量读取数据库配置
export function getDatabaseConfigFromEnv(): DatabaseConfig {
  const dbType = (process.env.DB_TYPE || 'sqlite') as DatabaseType;

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
