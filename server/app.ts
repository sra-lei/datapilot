/**
 * Express 应用配置
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRouter from './modules/user/router';

const app: Application = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由配置
app.use('/api/user', userRouter);

// 基础路由
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Trae API Server' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default app;
