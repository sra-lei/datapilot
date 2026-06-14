/**
 * 服务层类型定义
 * 统一管理所有服务相关的类型
 */

// 统一响应接口
export interface ApiResponse<T = unknown> {
  status: number;
  msg: string;
  data?: T;
}

// 用户相关类型
export interface UserInfo {
  id: number;
  username: string;
  email: string | null;
  status: 'active' | 'inactive' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  roleId?: number;
}

export interface ChangePasswordParams {
  username?: string;
  oldPassword: string;
  newPassword: string;
  force?: boolean;
}

export interface UpdateUserStatusParams {
  userId: number;
  status: 'active' | 'inactive';
}

// 权限相关类型
export interface Permission {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface UserWithRoles {
  id: number;
  username: string;
  email: string | null;
  roles: Role[];
  permissions: string[];
}

// 数据库相关类型
export interface TableInfo {
  name: string;
  type: string;
}

export interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
}

export interface DatabaseStats {
  tableCount: number;
  totalRows: number;
  tableStats: Record<string, number>;
  dbFileSize: number;
  dbFilePath: string;
}

// 业务服务相关类型
export interface ServiceHealth {
  status: string;
  service: string;
}

export interface BusinessUser {
  id: number;
  username: string;
  email: string | null;
  status: 'active' | 'inactive' | 'deleted';
  created_at: string;
  updated_at: string;
}

// 分页相关类型
export interface PageParams {
  page?: number;
  pageSize?: number;
}

export interface PageResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

// 请求配置类型
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  params?: Record<string, string | number>;
}
