/**
 * 服务器入口文件
 */

const app = require('./app');
const { initDatabase } = require('./config');
const { logSystem, logError } = require('./utils');
const { SYSTEM_OPERATIONS, SYSTEM_MESSAGES } = require('./constants');

const PORT = process.env.PORT || 3001;

// 启动服务器
async function startServer() {
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
