/**
 * 统一导出 - 配置模块
 */

const dbConfig = require('./database');
const { pool, initDatabase } = require('./db');

module.exports = {
  dbConfig,
  pool,
  initDatabase,
};
