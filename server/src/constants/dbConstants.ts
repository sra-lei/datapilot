/**
 * 数据库模块常量
 */

export const DB_CONFIG = {
  DEFAULT_PORT: 3001,
  DEFAULT_DB_PATH: './data/trae.db',
  JOURNAL_MODE: 'WAL',
} as const;

export const DB_ERRORS = {
  DUPLICATE_ENTRY: 'ER_DUP_ENTRY',
  NOT_INITIALIZED: 'Database not initialized',
} as const;

export const DB_ADAPTER_NAMES = {
  SQLITE: 'SQLite',
  MYSQL: 'MySQL',
} as const;