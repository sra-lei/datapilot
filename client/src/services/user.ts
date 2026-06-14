/**
 * 用户服务层
 * 使用主服务器（Node.js Server）
 */

import { mainRequest } from '../utils/request';
import { MAIN_API } from './constants';
import type {
  ApiResponse,
  UserInfo,
  LoginParams,
  RegisterParams,
  ChangePasswordParams,
  UpdateUserStatusParams,
} from './types';

/**
 * 用户登录
 */
export async function login(params: LoginParams): Promise<ApiResponse<UserInfo>> {
  return mainRequest(MAIN_API.USER.LOGIN, {
    method: 'POST',
    body: params,
  });
}

/**
 * 用户注册
 */
export async function register(params: RegisterParams): Promise<ApiResponse<UserInfo>> {
  return mainRequest(MAIN_API.USER.REGISTER, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取用户列表
 */
export async function getUserList(): Promise<ApiResponse<UserInfo[]>> {
  return mainRequest(MAIN_API.USER.LIST);
}

/**
 * 修改密码
 */
export async function changePassword(
  params: ChangePasswordParams
): Promise<ApiResponse> {
  return mainRequest(MAIN_API.USER.CHANGE_PASSWORD, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 删除用户（软删除，改为停用状态）
 */
export async function deleteUser(userId: number): Promise<ApiResponse> {
  return mainRequest(MAIN_API.USER.DELETE(userId), {
    method: 'DELETE',
  });
}

/**
 * 更新用户状态
 */
export async function updateUserStatus(
  params: UpdateUserStatusParams
): Promise<ApiResponse> {
  return mainRequest(MAIN_API.USER.STATUS, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 检查主服务器健康状态
 */
export async function checkHealth(): Promise<ApiResponse<{ status: string }>> {
  return mainRequest(MAIN_API.SYSTEM.HEALTH);
}
