/**
 * 服务器入口文件
 */

import app from './app';
import { DatabaseFactory, getDatabaseConfigFromEnv } from './database';
import { permissionService } from './modules/permission';
import { logSystem, logError } from './utils';
import { LOG_OPERATIONS, SYSTEM_MESSAGES, DB_CONFIG } from './constants';

const PORT = process.env.PORT || DB_CONFIG.DEFAULT_PORT;

// 启动服务器
async function startServer(): Promise<void> {
  try {
    const config = getDatabaseConfigFromEnv();
    const db = await DatabaseFactory.initialize(config);

    logSystem(LOG_OPERATIONS.SERVER_START, `数据库初始化成功，使用 ${db.getName()} 适配器`, {
      port: PORT,
      nodeEnv: process.env.NODE_ENV || 'development',
      dbType: db.getName(),
    });

    // 初始化权限表
    await permissionService.initializeTables();
    logSystem(LOG_OPERATIONS.SERVER_START, '权限表初始化成功');

    app.listen(PORT, () => {
      logSystem(LOG_OPERATIONS.SERVER_START, SYSTEM_MESSAGES.SERVER_START_SUCCESS, {
        port: PORT,
        nodeEnv: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error) {
    logError(LOG_OPERATIONS.SERVER_START, SYSTEM_MESSAGES.SERVER_START_FAILED, error, {
      port: PORT,
    });
  }
}

startServer();
