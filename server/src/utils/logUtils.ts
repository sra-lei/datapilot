/**
 * 统一日志工具
 * 提供结构化日志记录方法，便于搜索和排查问题
 */

import winston from 'winston';

// 操作类型 - 用于日志分类
export const OPERATIONS = {
  // 用户操作
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_CHANGE_PASSWORD: 'USER_CHANGE_PASSWORD',
  USER_GET_INFO: 'USER_GET_INFO',
  USER_UPDATE_INFO: 'USER_UPDATE_INFO',

  // 数据库操作
  DB_INIT: 'DB_INIT',
  DB_QUERY: 'DB_QUERY',
  DB_INSERT: 'DB_INSERT',
  DB_UPDATE: 'DB_UPDATE',
  DB_DELETE: 'DB_DELETE',

  // 系统操作
  SERVER_START: 'SERVER_START',
  SERVER_STOP: 'SERVER_STOP',
  SERVER_ERROR: 'SERVER_ERROR',

  // 通用操作
  REQUEST: 'REQUEST',
  VALIDATION: 'VALIDATION',
} as const;

// 日志上下文接口
export interface LogContext {
  operation?: string;
  userId?: number;
  traceId?: string;
  [key: string]: unknown;
}

// 创建日志实例
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'trae-server' },
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const operation = (meta as LogContext).operation || '-';
          const userId = (meta as LogContext).userId || '-';
          const traceId = (meta as LogContext).traceId || '-';

          let log = `${timestamp} [${level.padEnd(5)}] [${operation.padEnd(20)}] ${message}`;

          const context: string[] = [];
          if (userId !== '-') context.push(`userId=${userId}`);
          if (traceId !== '-') context.push(`traceId=${traceId}`);
          if (context.length > 0) {
            log += ` | ${context.join(' | ')}`;
          }

          const metaKeys = [ 'operation', 'userId', 'traceId', 'service' ];
          const extraMeta = Object.keys(meta)
            .filter(key => !metaKeys.includes(key))
            .reduce((obj, key) => {
              (obj as Record<string, unknown>)[key] = (meta as Record<string, unknown>)[key];
              return obj;
            }, {} as Record<string, unknown>);

          if (Object.keys(extraMeta).length > 0) {
            log += ` | ${JSON.stringify(extraMeta)}`;
          }

          return log;
        }),
      ),
    }),
    // 文件输出 - 所有日志
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 10,
      tailable: true,
    }),
    // 文件输出 - 错误日志
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 10,
      tailable: true,
    }),
    // 文件输出 - 用户操作日志
    new winston.transports.File({
      filename: 'logs/user.log',
      level: 'info',
      maxsize: 5242880,
      maxFiles: 10,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

/**
 * 生成追踪ID
 */
export function generateTraceId(): string {
  return `TRACE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 记录用户操作日志
 */
export function logUserOperation(operation: string, message: string, context: LogContext = {}): void {
  logger.info(message, {
    operation,
    ...context,
  });
}

/**
 * 记录错误日志
 */
export function logError(operation: string, message: string, err: unknown, context: LogContext = {}): void {
  const error = err as Error;
  logger.error(message, {
    operation,
    errorMessage: error?.message || String(err),
    errorStack: error?.stack || '',
    ...context,
  });
}

/**
 * 记录警告日志
 */
export function logWarn(operation: string, message: string, context: LogContext = {}): void {
  logger.warn(message, {
    operation,
    ...context,
  });
}

/**
 * 记录调试日志
 */
export function logDebug(operation: string, message: string, context: LogContext = {}): void {
  logger.debug(message, {
    operation,
    ...context,
  });
}

/**
 * 记录数据库操作日志
 */
export function logDatabase(operation: string, message: string, context: LogContext = {}): void {
  logger.info(message, {
    operation,
    ...context,
  });
}

/**
 * 记录系统日志
 */
export function logSystem(operation: string, message: string, context: LogContext = {}): void {
  logger.info(message, {
    operation,
    ...context,
  });
}

export { logger };
