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

const app: Application = express();

// 中间件
app.use(cors());
app.use(express.json());

// Swagger UI - 完整的 API 文档
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Trae API 文档',
    version: '1.0.0',
    description: '用户管理、权限管理和数据库管理的 API 文档',
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: '开发服务器',
    },
  ],
  tags: [
    { name: '用户管理', description: '用户注册、登录、状态管理等接口' },
    { name: '权限管理', description: '角色、权限和用户角色分配管理接口' },
    { name: '数据库管理', description: '数据库表查询、数据查看和统计接口' },
  ],
  paths: {
    '/': {
      get: {
        summary: '服务器信息',
        responses: {
          '200': { description: '成功' },
        },
      },
    },
    '/api/health': {
      get: {
        summary: '健康检查',
        responses: {
          '200': { description: '服务正常' },
        },
      },
    },
    '/api/user/login': {
      post: {
        tags: ['用户管理'],
        summary: '用户登录',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: '登录成功' },
          '401': { description: '用户名或密码错误' },
          '403': { description: '用户已被停用或删除' },
        },
      },
    },
    '/api/user/register': {
      post: {
        tags: ['用户管理'],
        summary: '用户注册',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  email: { type: 'string' },
                  roleId: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: '注册成功' },
        },
      },
    },
    '/api/user/status': {
      put: {
        tags: ['用户管理'],
        summary: '更新用户状态',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'status'],
                properties: {
                  userId: { type: 'number' },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive', 'deleted'],
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: '状态更新成功' },
        },
      },
    },
  },
};

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
