/**
 * 权限服务 API
 */

import { request } from '../utils/request';

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

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

/**
 * 获取所有权限
 */
export async function getAllPermissions(): Promise<ApiResponse<Permission[]>> {
  return request('/permission/permissions');
}

/**
 * 创建权限
 */
export async function createPermission(name: string, description?: string): Promise<ApiResponse<Permission>> {
  return request('/permission/permissions', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

/**
 * 删除权限
 */
export async function deletePermission(id: number): Promise<ApiResponse<void>> {
  return request(`/permission/permissions/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取所有角色
 */
export async function getAllRoles(): Promise<ApiResponse<Role[]>> {
  return request('/permission/roles');
}

/**
 * 获取角色详情（包括权限）
 */
export async function getRoleWithPermissions(id: number): Promise<ApiResponse<RoleWithPermissions>> {
  return request(`/permission/roles/${id}`);
}

/**
 * 创建角色
 */
export async function createRole(name: string, description?: string): Promise<ApiResponse<Role>> {
  return request('/permission/roles', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

/**
 * 更新角色
 */
export async function updateRole(
  id: number,
  name: string,
  description?: string
): Promise<ApiResponse<Role>> {
  return request(`/permission/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
  });
}

/**
 * 删除角色
 */
export async function deleteRole(id: number): Promise<ApiResponse<void>> {
  return request(`/permission/roles/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 为角色授予权限
 */
export async function grantPermission(
  roleId: number,
  permissionId: number
): Promise<ApiResponse<void>> {
  return request(`/permission/roles/${roleId}/permissions`, {
    method: 'POST',
    body: JSON.stringify({ permissionId }),
  });
}

/**
 * 撤销角色权限
 */
export async function revokePermission(
  roleId: number,
  permissionId: number
): Promise<ApiResponse<void>> {
  return request(`/permission/roles/${roleId}/permissions/${permissionId}`, {
    method: 'DELETE',
  });
}

/**
 * 为用户分配角色
 */
export async function assignRole(
  userId: number,
  roleId: number
): Promise<ApiResponse<void>> {
  return request(`/permission/users/${userId}/roles`, {
    method: 'POST',
    body: JSON.stringify({ roleId }),
  });
}

/**
 * 撤销用户角色
 */
export async function revokeUserRole(
  userId: number,
  roleId: number
): Promise<ApiResponse<void>> {
  return request(`/permission/users/${userId}/roles/${roleId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取用户的角色和权限
 */
export async function getUserPermissions(userId: number): Promise<ApiResponse<UserWithRoles>> {
  return request(`/permission/users/${userId}/permissions`);
}
