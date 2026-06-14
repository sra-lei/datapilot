/**
 * Express 应用配置
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import userRouter from './modules/user/router';
import databaseManagerRouter from './modules/database-manager/router';
import permissionRouter from './modules/permission/router';
import { success } from './utils/response';
import { swaggerSpec } from './constants/swaggerConfig';

const app: Application = express();

// 中间件
app.use(cors());
app.use(express.json());

// Swagger UI - 完整的 API 文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 路由配置
app.use('/api/user', userRouter);
app.use('/api/database', databaseManagerRouter);
app.use('/api/permission', permissionRouter);

// 基础路由
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Trae API Server',
    docs: 'http://localhost:3000/api-docs',
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  success(res, { status: 'ok' }, '服务运行正常');
});

export default app;
