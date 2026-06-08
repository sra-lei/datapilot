/**
 * 用户服务层
 * 处理用户相关业务逻辑
 */

import { DatabaseFactory } from '../../database';
import { ErrorCode, UserInfo, ServiceResult } from './types';
import { MESSAGES } from './constants';
import { RegisterParams, LoginParams, ChangePasswordParams } from './types';
import { permissionService } from '../permission';

/**
 * 获取数据库适配器
 */
function getDb() {
  return DatabaseFactory.getInstance();
}

/**
 * 用户注册
 */
export async function register(params: RegisterParams): Promise<ServiceResult<UserInfo>> {
  try {
    const { username, password, email, roleId } = params;
    const db = getDb();

    const result = await db.insert(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email || null],
    );

    const userId = result.insertId!;

    // 如果指定了角色ID，则为用户分配角色
    if (roleId) {
      await permissionService.assignRole({ userId, roleId });
    }

    return {
      success: true,
      data: {
        id: userId,
        username,
        email: email || null,
      },
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    if (error.message === 'ER_DUP_ENTRY') {
      return {
        success: false,
        error: {
          code: ErrorCode.CONFLICT,
          message: MESSAGES.USER_ALREADY_EXISTS,
        },
      };
    }

    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: MESSAGES.REGISTER_FAILED,
      },
    };
  }
}

/**
 * 用户登录
 */
export async function login(params: LoginParams): Promise<ServiceResult<UserInfo & { roles?: string[]; permissions?: string[] }>> {
  try {
    const { username, password } = params;
    const db = getDb();

    const result = await db.query(
      'SELECT id, username, email FROM users WHERE username = ? AND password = ?',
      [username, password],
    );

    if (!result.rows || result.rows.length === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: MESSAGES.PASSWORD_ERROR,
        },
      };
    }

    const user = result.rows[0] as unknown as UserInfo;
    
    // 获取用户的角色和权限
    const permResult = await permissionService.getUserPermissions(user.id);
    let roles: string[] = [];
    let permissions: string[] = [];
    
    if (permResult.success && permResult.data) {
      roles = permResult.data.roles.map(r => r.name);
      permissions = permResult.data.permissions;
    } else {
      // 获取权限失败时返回登录错误，避免默认赋予高权限
      return {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: MESSAGES.GET_PERMISSION_FAILED,
        },
      };
    }

    return {
      success: true,
      data: {
        ...user,
        roles,
        permissions,
      },
    };
  } catch (_err: unknown) {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: MESSAGES.LOGIN_FAILED,
      },
    };
  }
}

/**
 * 修改密码（管理员强制修改，不需要原密码）
 */
export async function updatePassword(params: { username: string; newPassword: string }): Promise<ServiceResult> {
  try {
    const { username, newPassword } = params;
    const db = getDb();

    // 更新密码
    const result = await db.update(
      'UPDATE users SET password = ? WHERE username = ?',
      [newPassword, username],
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.NOT_FOUND,
          message: MESSAGES.USER_NOT_FOUND,
        },
      };
    }

    return { success: true };
  } catch (_err: unknown) {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: MESSAGES.CHANGE_PASSWORD_FAILED,
      },
    };
  }
}

/**
 * 根据ID获取用户信息
 */
export async function getUserById(userId: number): Promise<ServiceResult<UserInfo>> {
  try {
    const db = getDb();

    const result = await db.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [userId],
    );

    if (!result.rows || result.rows.length === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.NOT_FOUND,
          message: MESSAGES.USER_NOT_FOUND,
        },
      };
    }

    return {
      success: true,
      data: result.rows[0] as unknown as UserInfo,
    };
  } catch (_err: unknown) {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: '获取用户信息失败',
      },
    };
  }
}

/**
 * 删除用户
 */
export async function deleteUser(userId: number): Promise<ServiceResult> {
  try {
    const db = getDb();

    // 删除用户的角色关联
    await db.delete('DELETE FROM user_roles WHERE user_id = ?', [userId]);

    // 删除用户
    const result = await db.delete('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.NOT_FOUND,
          message: MESSAGES.USER_NOT_FOUND,
        },
      };
    }

    return { success: true };
  } catch (_err: unknown) {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: MESSAGES.DELETE_FAILED,
      },
    };
  }
}
