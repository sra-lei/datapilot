/**
 * 用户模块类型定义
 */

// 错误码
export enum ErrorCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// 用户操作类型
export enum UserOperation {
  USER_REGISTER = 'USER_REGISTER',
  USER_LOGIN = 'USER_LOGIN',
  USER_CHANGE_PASSWORD = 'USER_CHANGE_PASSWORD',
}

// 用户消息
export const UserMessages = {
  SUCCESS: '操作成功',
  ALL_FIELDS_REQUIRED: '所有字段都不能为空',
  USER_NOT_FOUND: '用户不存在',
  USER_ALREADY_EXISTS: '用户名已存在',
  PASSWORD_ERROR: '用户名或密码错误',
  OLD_PASSWORD_ERROR: '旧密码错误',
  REGISTER_SUCCESS: '注册成功',
  LOGIN_SUCCESS: '登录成功',
  CHANGE_PASSWORD_SUCCESS: '密码修改成功',
  REGISTER_FAILED: '注册失败',
  LOGIN_FAILED: '登录失败',
  CHANGE_PASSWORD_FAILED: '修改密码失败',
} as const;

// 用户注册参数
export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
}

// 用户登录参数
export interface LoginParams {
  username: string;
  password: string;
}

// 修改密码参数
export interface ChangePasswordParams {
  username: string;
  oldPassword: string;
  newPassword: string;
}

// 用户信息
export interface UserInfo {
  id: number;
  username: string;
  email: string | null;
}

// 服务层返回结果
export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
  };
}
