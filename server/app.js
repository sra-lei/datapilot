/**
 * Express 应用配置
 */

const express = require('express');
const cors = require('cors');
const userRouter = require('./modules/user/router');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由配置
app.use('/api/user', userRouter);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Trae API Server' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
