/**
 * API 路径常量
 * 统一管理所有 API 接口路径
 */

/**
 * 主服务器 API 路径（Node.js Server）
 */
export const MAIN_API = {
  // 用户相关
  USER: {
    LOGIN: '/api/user/login',
    REGISTER: '/api/user/register',
    LIST: '/api/user/list',
    STATUS: '/api/user/status',
    CHANGE_PASSWORD: '/api/user/change-password',
    DELETE: (id: number) => `/api/user/${id}`,
  },

  // 权限相关
  PERMISSION: {
    LIST: '/api/permission/permissions',
    CREATE: '/api/permission/permissions',
    DELETE: (id: number) => `/api/permission/permissions/${id}`,
    GET: (id: number) => `/api/permission/permissions/${id}`,
    UPDATE: (id: number) => `/api/permission/permissions/${id}`,
  },

  // 角色相关
  ROLE: {
    LIST: '/api/permission/roles',
    CREATE: '/api/permission/roles',
    GET: (id: number) => `/api/permission/roles/${id}`,
    UPDATE: (id: number) => `/api/permission/roles/${id}`,
    DELETE: (id: number) => `/api/permission/roles/${id}`,
    GRANT_PERMISSION: (roleId: number) => `/api/permission/roles/${roleId}/permissions`,
    REVOKE_PERMISSION: (roleId: number, permissionId: number) =>
      `/api/permission/roles/${roleId}/permissions/${permissionId}`,
  },

  // 用户权限相关
  USER_PERMISSION: {
    ASSIGN_ROLE: (userId: number) => `/api/permission/users/${userId}/roles`,
    REVOKE_ROLE: (userId: number, roleId: number) =>
      `/api/permission/users/${userId}/roles/${roleId}`,
    GET_PERMISSIONS: (userId: number) => `/api/permission/users/${userId}/permissions`,
  },

  // 数据库相关
  DATABASE: {
    TABLES: '/api/database/tables',
    GET_TABLE_INFO: (tableName: string) =>
      `/api/database/tables/${encodeURIComponent(tableName)}/info`,
    GET_TABLE_DATA: (tableName: string) =>
      `/api/database/tables/${encodeURIComponent(tableName)}/data`,
    QUERY: '/api/database/query',
    STATS: '/api/database/stats',
  },

  // 系统相关
  SYSTEM: {
    HEALTH: '/api/health',
  },
} as const;

/**
 * 业务服务器 API 路径（Python Server）
 */
export const BUSINESS_API = {
  // 用户相关
  USER: {
    LIST: '/api/user/list',
    REGISTER: '/api/user/register',
    LOGIN: '/api/user/login',
    STATUS: '/api/user/status',
    CHANGE_PASSWORD: '/api/user/password',
  },

  // 权限相关
  PERMISSION: {
    INITIALIZE: '/api/permission/initialize',
    ROLE_LIST: '/api/permission/role/list',
    CREATE_ROLE: '/api/permission/role',
    PERMISSION_LIST: '/api/permission/permission/list',
    CREATE_PERMISSION: '/api/permission/permission',
    ASSIGN_ROLE: '/api/permission/assign-role',
    ASSIGN_PERMISSION: '/api/permission/assign-permission',
    GET_USER_PERMISSIONS: (userId: number) => `/api/permission/user/${userId}`,
  },

  // 数据库相关
  DATABASE: {
    TABLES: '/api/database/tables',
    GET_TABLE_STRUCTURE: (tableName: string) =>
      `/api/database/table/${tableName}/structure`,
    GET_TABLE_DATA: (tableName: string) =>
      `/api/database/table/${tableName}/data`,
    QUERY: '/api/database/query',
    STATS: '/api/database/stats',
  },

  // 系统相关
  SYSTEM: {
    HEALTH: '/api/v1/health',
  },
} as const;

/**
 * API 前缀
 */
export const API_PREFIX = {
  MAIN: '/api',
  BUSINESS: '/api',
} as const;
