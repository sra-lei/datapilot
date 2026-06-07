/**
 * 服务器入口文件
 */

import app from './app';
import { DatabaseFactory, getDatabaseConfigFromEnv } from './database';
import { logSystem, logError } from './utils';
import { SYSTEM_OPERATIONS, SYSTEM_MESSAGES } from './constants';

const PORT = process.env.PORT || 3001;

// 启动服务器
async function startServer(): Promise<void> {
  try {
    const config = getDatabaseConfigFromEnv();
    const db = await DatabaseFactory.initialize(config);

    logSystem(SYSTEM_OPERATIONS.SERVER_START, `数据库初始化成功，使用 ${db.getName()} 适配器`, {
      port: PORT,
      nodeEnv: process.env.NODE_ENV || 'development',
      dbType: db.getName(),
    });

    app.listen(PORT, () => {
      logSystem(SYSTEM_OPERATIONS.SERVER_START, SYSTEM_MESSAGES.SERVER_START_SUCCESS, {
        port: PORT,
        nodeEnv: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error) {
    logError(SYSTEM_OPERATIONS.SERVER_START, SYSTEM_MESSAGES.SERVER_START_FAILED, error, {
      port: PORT,
    });
  }
}

startServer();
