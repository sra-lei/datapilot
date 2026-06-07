/**
 * 数据库适配层模块
 * 统一导出所有数据库相关组件
 */

export { IDatabaseAdapter, QueryResult, QueryRow } from './IDatabaseAdapter';
export { SQLiteAdapter } from './SQLiteAdapter';
export { MySQLAdapter, MySQLConfig } from './MySQLAdapter';
export { DatabaseFactory, DatabaseConfig, DatabaseType, getDatabaseConfigFromEnv } from './DatabaseFactory';
