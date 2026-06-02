const express = require('express');
const cors = require('cors');
const userRouter = require('./user');
const { initDatabase } = require('./config/db');
const { logSystem, logError, OPERATIONS } = require('./utils/logUtils');
const { MESSAGES } = require('./constants/userConstants');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/user', userRouter);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Trae API Server' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
async function startServer() {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      logSystem(OPERATIONS.SERVER_START, MESSAGES.SERVER_START_SUCCESS, {
        port: PORT,
        nodeEnv: process.env.NODE_ENV || 'development'
      });
    });
  } catch (error) {
    logError(OPERATIONS.SERVER_START, MESSAGES.SERVER_START_FAILED, error, {
      port: PORT
    });
  }
}

startServer();
