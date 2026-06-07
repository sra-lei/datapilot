/**
 * 统一日志工具
 * 提供结构化日志记录方法，便于搜索和排查问题
 */

const winston = require('winston');

// 操作类型 - 用于日志分类
const OPERATIONS = {
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
};

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
          // 提取核心字段
          const operation = meta.operation || '-';
          const userId = meta.userId || '-';
          const traceId = meta.traceId || '-';
          
          // 构建标准日志格式
          let log = `${timestamp} [${level.padEnd(5)}] [${operation.padEnd(20)}] ${message}`;
          
          // 添加上下文信息
          const context = [];
          if (userId !== '-') context.push(`userId=${userId}`);
          if (traceId !== '-') context.push(`traceId=${traceId}`);
          if (context.length > 0) {
            log += ` | ${context.join(' | ')}`;
          }
          
          // 添加其他元数据
          const metaKeys = [ 'operation', 'userId', 'traceId', 'service' ];
          const extraMeta = Object.keys(meta)
            .filter(key => !metaKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = meta[key];
              return obj;
            }, {});
          
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
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true,
    }),
    // 文件输出 - 错误日志
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true,
    }),
    // 文件输出 - 用户操作日志
    new winston.transports.File({ 
      filename: 'logs/user.log', 
      level: 'info',
      maxsize: 5242880, // 5MB
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
function generateTraceId() {
  return `TRACE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 记录用户操作日志
 * @param {string} operation - 操作类型
 * @param {string} message - 日志消息（与API返回message一致）
 * @param {Object} context - 上下文信息
 */
function logUserOperation(operation, message, context = {}) {
  logger.info(message, {
    operation,
    ...context,
  });
}

/**
 * 记录错误日志
 * @param {string} operation - 操作类型
 * @param {string} message - 错误消息（与API返回message一致）
 * @param {Error|Object} error - 错误对象
 * @param {Object} context - 上下文信息
 */
function logError(operation, message, error, context = {}) {
  const errorInfo = {
    operation,
    errorMessage: error.message || String(error),
    errorStack: error.stack || '',
    ...context,
  };
  
  logger.error(message, errorInfo);
}

/**
 * 记录警告日志
 * @param {string} operation - 操作类型
 * @param {string} message - 警告消息（与API返回message一致）
 * @param {Object} context - 上下文信息
 */
function logWarn(operation, message, context = {}) {
  logger.warn(message, {
    operation,
    ...context,
  });
}

/**
 * 记录调试日志
 * @param {string} operation - 操作类型
 * @param {string} message - 调试消息
 * @param {Object} context - 上下文信息
 */
function logDebug(operation, message, context = {}) {
  logger.debug(message, {
    operation,
    ...context,
  });
}

/**
 * 记录数据库操作日志
 * @param {string} operation - 操作类型
 * @param {string} message - 日志消息（与API返回message一致）
 * @param {Object} context - 上下文信息
 */
function logDatabase(operation, message, context = {}) {
  logger.info(message, {
    operation,
    ...context,
  });
}

/**
 * 记录系统日志
 * @param {string} operation - 操作类型
 * @param {string} message - 日志消息（与API返回message一致）
 * @param {Object} context - 上下文信息
 */
function logSystem(operation, message, context = {}) {
  logger.info(message, {
    operation,
    ...context,
  });
}

module.exports = {
  ...logger,
  logger,
  generateTraceId,
  logUserOperation,
  logError,
  logWarn,
  logDebug,
  logDatabase,
  logSystem,
  OPERATIONS,
};
