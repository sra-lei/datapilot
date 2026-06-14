# Services 模块

## 概述

Services 模块统一管理所有与后端服务器的通信，提供类型安全、配置驱动的 API 调用方式。

## 目录结构

```
services/
├── index.ts        # 统一导出入口
├── types.ts        # 类型定义（统一管理）
├── constants.ts    # API 路径常量
├── user.ts         # 用户服务（主服务器）
├── permission.ts   # 权限服务（主服务器）
├── database.ts     # 数据库服务（主服务器）
└── business.ts     # 业务服务（Python服务器）
```

## 核心改进

### 1. 统一类型定义

所有类型定义集中在 `types.ts` 中：

```typescript
import type {
  ApiResponse,
  UserInfo,
  Permission,
  Role,
  TableInfo,
  ServiceHealth,
} from './services/types';
```

### 2. API 路径常量

所有 API 路径统一管理：

```typescript
import { MAIN_API, BUSINESS_API } from './services/constants';

// 主服务器 API
MAIN_API.USER.LOGIN        // /api/user/login
MAIN_API.DATABASE.STATS    // /api/database/stats

// 业务服务器 API
BUSINESS_API.SYSTEM.HEALTH // /api/v1/health
```

### 3. 统一请求工具

使用 `mainRequest` 和 `businessRequest`：

```typescript
import { mainRequest, businessRequest } from './utils/request';

// 主服务器请求
const user = await mainRequest(MAIN_API.USER.LOGIN, {
  method: 'POST',
  body: { username, password },
});

// 业务服务器请求
const health = await businessRequest(BUSINESS_API.SYSTEM.HEALTH);
```

## 使用示例

### 导入服务

```typescript
// 方式一：统一导入
import { login, getAllRoles, getTables } from './services';

// 方式二：按需导入
import { login } from './services/user';
import { getAllRoles } from './services/permission';
```

### 调用服务

```typescript
// 用户登录
const result = await login({ username: 'admin', password: '123456' });

// 获取角色列表
const roles = await getAllRoles();

// 获取数据库表
const tables = await getTables();
```

## 类型定义

| 类型 | 说明 | 文件 |
|------|------|------|
| `ApiResponse<T>` | 统一响应格式 | types.ts |
| `UserInfo` | 用户信息 | types.ts |
| `Permission` | 权限信息 | types.ts |
| `Role` | 角色信息 | types.ts |
| `TableInfo` | 表信息 | types.ts |
| `ServiceHealth` | 服务健康状态 | types.ts |
| `BusinessUser` | 业务用户信息 | types.ts |

## 最佳实践

1. **统一导入**：使用 `import { xxx } from './services'` 导入服务
2. **使用常量**：所有 API 路径使用 `MAIN_API` 或 `BUSINESS_API` 常量
3. **类型安全**：使用 TypeScript 类型定义，确保参数和返回值类型正确
4. **统一错误处理**：所有服务返回统一的 `ApiResponse` 格式

## 添加新服务

1. 在 `constants.ts` 中添加 API 路径
2. 在 `types.ts` 中添加类型定义（如果需要）
3. 在对应服务文件中添加服务函数
4. 在 `index.ts` 中导出（自动导出）

## 服务器配置

服务的服务器地址由 `src/config/index.ts` 统一管理，支持环境变量配置。
