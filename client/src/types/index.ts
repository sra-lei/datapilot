/**
 * 用户相关类型定义
 */

export interface UserInfo {
  id: number;
  username: string;
  email: string | null;
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
  username: string;
  oldPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}
