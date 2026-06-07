/**
 * 数据库配置和初始化
 */

import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import dbConfig from './database';
import { generateTraceId } from '../utils/logUtils';

export const pool: Pool = mysql.createPool(dbConfig);

// 初始化数据库和表
export async function initDatabase(): Promise<void> {
  const traceId = generateTraceId();
  const connection: PoolConnection = await pool.getConnection();

  try {
    const { logDatabase, logError, OPERATIONS } = require('../utils/logUtils');
    const { SYSTEM_MESSAGES } = require('../constants');

    logDatabase(OPERATIONS.DB_INIT, '开始初始化数据库', {
      traceId,
      database: dbConfig.database,
      host: dbConfig.host,
    });

    // 创建数据库（如果不存在）
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);

    // 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    logDatabase(OPERATIONS.DB_INIT, SYSTEM_MESSAGES.DB_INIT_SUCCESS, {
      traceId,
      tables: [ 'users' ],
    });
  } catch (error) {
    const { logError, OPERATIONS } = require('../utils/logUtils');
    const { SYSTEM_MESSAGES } = require('../constants');

    logError(OPERATIONS.DB_INIT, SYSTEM_MESSAGES.DB_INIT_FAILED, error, {
      traceId,
      database: dbConfig.database,
    });
    throw error;
  } finally {
    connection.release();
  }
}
