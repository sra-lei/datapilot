/**
 * 用户服务层
 * 处理用户相关业务逻辑
 */

import { pool } from '../../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ErrorCode, UserInfo, ServiceResult } from './types';
import { MESSAGES } from './constants';
import { RegisterParams, LoginParams, ChangePasswordParams } from './types';

/**
 * 用户注册
 */
export async function register(params: RegisterParams): Promise<ServiceResult<UserInfo>> {
  try {
    const { username, password, email } = params;
    const [ result ] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [ username, password, email || null ],
    );

    return {
      success: true,
      data: {
        id: result.insertId,
        username,
        email: email || null,
      },
    };
  } catch (err: unknown) {
    const error = err as { code?: string };
    if (error.code === 'ER_DUP_ENTRY') {
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
export async function login(params: LoginParams): Promise<ServiceResult<UserInfo>> {
  try {
    const { username, password } = params;
    const [ rows ] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, email FROM users WHERE username = ? AND password = ?',
      [ username, password ],
    );

    if (rows.length === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: MESSAGES.PASSWORD_ERROR,
        },
      };
    }

    return {
      success: true,
      data: rows[0] as UserInfo,
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
    const [ rows ] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ? AND password = ?',
      [ username, oldPassword ],
    );

    if (rows.length === 0) {
      return {
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: MESSAGES.OLD_PASSWORD_ERROR,
        },
      };
    }

    await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [ newPassword, username ],
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
