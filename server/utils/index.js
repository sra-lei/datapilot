/**
 * 统一导出 - 工具模块
 */

const { success, error } = require('./response');
const {
  logger,
  generateTraceId,
  logUserOperation,
  logError,
  logWarn,
  logDebug,
  logDatabase,
  logSystem,
  OPERATIONS,
} = require('./logUtils');

module.exports = {
  // 响应工具
  success,
  error,

  // 日志工具
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
