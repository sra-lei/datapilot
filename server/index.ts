/**
 * 服务器入口文件
 */

import app from './app';
import { initDatabase } from './config';
import { logSystem, logError } from './utils';
import { SYSTEM_OPERATIONS, SYSTEM_MESSAGES } from './constants';

const PORT = process.env.PORT || 3001;

// 启动服务器
async function startServer(): Promise<void> {
  try {
    await initDatabase();

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
