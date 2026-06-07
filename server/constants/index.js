/**
 * 统一导出 - 常量模块
 */

const userConstants = require('./userConstants');

const SYSTEM_MESSAGES = {
  DB_INIT_SUCCESS: '数据库初始化成功',
  DB_INIT_FAILED: '数据库初始化失败',
  DB_CONNECTION_FAILED: '数据库连接失败',
  SERVER_START_SUCCESS: '服务器启动成功',
  SERVER_START_FAILED: '服务器启动失败',
  SERVER_STOP_SUCCESS: '服务器停止成功',
};

const SYSTEM_OPERATIONS = {
  DB_INIT: 'DB_INIT',
  DB_QUERY: 'DB_QUERY',
  DB_INSERT: 'DB_INSERT',
  DB_UPDATE: 'DB_UPDATE',
  DB_DELETE: 'DB_DELETE',
  SERVER_START: 'SERVER_START',
  SERVER_STOP: 'SERVER_STOP',
  SERVER_ERROR: 'SERVER_ERROR',
  REQUEST: 'REQUEST',
  VALIDATION: 'VALIDATION',
};

module.exports = {
  ...userConstants,
  SYSTEM_MESSAGES,
  SYSTEM_OPERATIONS,
};
