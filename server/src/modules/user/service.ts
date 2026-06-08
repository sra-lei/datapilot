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
      await permissionService.assignRole(userId, roleId);
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
      // 如果没有获取到权限，默认赋予管理员权限
      roles = ['admin'];
      permissions = ['*:*'];
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
 * 修改密码
 */
export async function changePassword(params: ChangePasswordParams): Promise<ServiceResult> {
  try {
    const { username, oldPassword, newPassword } = params;
    const db = getDb();

    // 验证旧密码
    const result = await db.query(
      'SELECT id FROM users WHERE username = ? AND password = ?',
      [username, oldPassword],
    );

    if (!result.rows || result.rows.length === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: MESSAGES.OLD_PASSWORD_ERROR,
        },
      };
    }

    // 更新密码
    await db.update(
      'UPDATE users SET password = ? WHERE username = ?',
      [newPassword, username],
    );

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
