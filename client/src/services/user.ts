/**
 * 用户服务层
 */

import { request } from '../utils/request';
import { UserInfo, LoginParams, RegisterParams, ChangePasswordParams, ApiResponse, UpdateUserStatusParams } from '../types';

/**
 * 用户登录
 */
export async function login(params: LoginParams): Promise<ApiResponse<UserInfo>> {
  return request('/user/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 用户注册
 */
export async function register(params: RegisterParams): Promise<ApiResponse<UserInfo>> {
  return request('/user/register', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 修改密码
 */
export async function changePassword(params: ChangePasswordParams): Promise<ApiResponse> {
  return request('/user/change-password', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 删除用户（软删除，改为停用状态）
 */
export async function deleteUser(userId: number): Promise<ApiResponse> {
  return request(`/user/${userId}`, {
    method: 'DELETE',
  });
}

/**
 * 更新用户状态
 */
export async function updateUserStatus(params: UpdateUserStatusParams): Promise<ApiResponse> {
  return request('/user/status', {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 检查健康状态
 */
export async function checkHealth(): Promise<{ status: string }> {
  return request('/health');
}
