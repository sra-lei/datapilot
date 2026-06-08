/**
 * 用户控制器
 * 处理用户请求和响应
 */

import { Request, Response } from 'express';
import { success, error } from '../../utils/response';
import { generateTraceId, logUserOperation, logWarn } from '../../utils/logUtils';
import { ErrorCode, MESSAGES, OPERATIONS } from './constants';
import * as userService from './service';
import { RegisterParams, LoginParams, ChangePasswordParams } from './types';
import { permissionService } from '../permission';

/**
 * 用户注册
 */
export async function register(req: Request, res: Response): Promise<void> {
  const traceId = generateTraceId();
  const { username, password, email, roleId } = req.body as RegisterParams;

  if (!username || !password) {
    logWarn(OPERATIONS.USER_REGISTER, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少必需参数',
    });
    error(res, ErrorCode.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    return;
  }

  // 如果指定了角色ID，需要验证当前用户是否有管理员权限
  if (roleId) {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      logWarn(OPERATIONS.USER_REGISTER, '未登录用户尝试指定角色注册', {
        traceId,
        username,
        reason: '未登录',
      });
      error(res, ErrorCode.UNAUTHORIZED, '请先登录');
      return;
    }

    try {
      const hasPermission = await permissionService.hasPermission(
        parseInt(userId as string),
        'user:create'
      );

      if (!hasPermission) {
        logWarn(OPERATIONS.USER_REGISTER, '没有权限创建用户', {
          traceId,
          username,
          reason: '权限不足',
        });
        error(res, ErrorCode.FORBIDDEN, '没有权限执行此操作');
        return;
      }
    } catch (permError) {
      logWarn(OPERATIONS.USER_REGISTER, '权限验证失败', {
        traceId,
        username,
        reason: '权限验证异常',
      });
      error(res, ErrorCode.INTERNAL_ERROR, '权限验证失败');
      return;
    }
  }

  const result = await userService.register({ username, password, email, roleId });

  if (!result.success) {
    logWarn(OPERATIONS.USER_REGISTER, result.error!.message, {
      traceId,
      username,
    });
    error(res, result.error!.code, result.error!.message);
    return;
  }

  logUserOperation(OPERATIONS.USER_REGISTER, MESSAGES.REGISTER_SUCCESS, {
    traceId,
    userId: result.data!.id,
    username,
    email: email || null,
    roleId,
  });

  success(res, result.data, MESSAGES.REGISTER_SUCCESS);
}

/**
 * 用户登录
 */
export async function login(req: Request, res: Response): Promise<void> {
  const traceId = generateTraceId();
  const { username, password } = req.body as LoginParams;

  if (!username || !password) {
    logWarn(OPERATIONS.USER_LOGIN, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username: username || '未提供',
      reason: '缺少必需参数',
    });
    error(res, ErrorCode.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    return;
  }

  const result = await userService.login({ username, password });

  if (!result.success) {
    logWarn(OPERATIONS.USER_LOGIN, result.error!.message, {
      traceId,
      username,
    });
    error(res, result.error!.code, result.error!.message);
    return;
  }

  logUserOperation(OPERATIONS.USER_LOGIN, MESSAGES.LOGIN_SUCCESS, {
    traceId,
    userId: result.data!.id,
    username,
  });

  success(res, result.data, MESSAGES.LOGIN_SUCCESS);
}

/**
 * 修改密码
 */
export async function changePassword(req: Request, res: Response): Promise<void> {
  const traceId = generateTraceId();
  const { username, oldPassword, newPassword, force } = req.body as ChangePasswordParams & { force?: boolean };

  if (!username || !newPassword) {
    logWarn(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少必需参数',
    });
    error(res, ErrorCode.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    return;
  }

  // 强制修改需要管理员权限验证
  if (force) {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      logWarn(OPERATIONS.USER_CHANGE_PASSWORD, '未登录用户尝试强制修改密码', {
        traceId,
        username,
        reason: '未登录',
      });
      error(res, ErrorCode.UNAUTHORIZED, '请先登录');
      return;
    }

    try {
      const hasPermission = await permissionService.hasPermission(
        parseInt(userId as string),
        'user:update'
      );

      if (!hasPermission) {
        logWarn(OPERATIONS.USER_CHANGE_PASSWORD, '没有权限修改用户密码', {
          traceId,
          username,
          reason: '权限不足',
        });
        error(res, ErrorCode.FORBIDDEN, '没有权限执行此操作');
        return;
      }
    } catch (permError) {
      logWarn(OPERATIONS.USER_CHANGE_PASSWORD, '权限验证失败', {
        traceId,
        username,
        reason: '权限验证异常',
      });
      error(res, ErrorCode.INTERNAL_ERROR, '权限验证失败');
      return;
    }

    // 管理员强制修改密码，不需要原密码
    const result = await userService.updatePassword({ username, newPassword });

    if (!result.success) {
      logWarn(OPERATIONS.USER_CHANGE_PASSWORD, result.error!.message, {
        traceId,
        username,
      });
      error(res, result.error!.code, result.error!.message);
      return;
    }

    logUserOperation(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.CHANGE_PASSWORD_SUCCESS, {
      traceId,
      username,
      operatorId: userId,
    });

    success(res, null, MESSAGES.CHANGE_PASSWORD_SUCCESS);
    return;
  }

  // 普通用户修改密码，需要原密码
  if (!oldPassword) {
    logWarn(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少原密码',
    });
    error(res, ErrorCode.BAD_REQUEST, '请输入原密码');
    return;
  }

  const result = await userService.changePassword({ username, oldPassword, newPassword });

  if (!result.success) {
    logWarn(OPERATIONS.USER_CHANGE_PASSWORD, result.error!.message, {
      traceId,
      username,
    });
    error(res, result.error!.code, result.error!.message);
    return;
  }

  logUserOperation(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.CHANGE_PASSWORD_SUCCESS, {
    traceId,
    username,
  });

  success(res, null, MESSAGES.CHANGE_PASSWORD_SUCCESS);
}

/**
 * 删除用户
 */
export async function deleteUser(req: Request, res: Response): Promise<void> {
  const traceId = generateTraceId();
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    logWarn(OPERATIONS.USER_DELETE, '无效的用户ID', {
      traceId,
      userId: req.params.id,
      reason: '参数错误',
    });
    error(res, ErrorCode.BAD_REQUEST, '无效的用户ID');
    return;
  }

  // 获取要删除的用户信息
  const userResult = await userService.getUserById(userId);
  if (!userResult.success || !userResult.data) {
    logWarn(OPERATIONS.USER_DELETE, '用户不存在', {
      traceId,
      userId,
      reason: '用户不存在',
    });
    error(res, ErrorCode.NOT_FOUND, '用户不存在');
    return;
  }

  const username = userResult.data.username;

  // 检查是否为管理员用户（保护管理员不被删除）
  if (username === 'Sra' || username === 'admin') {
    logWarn(OPERATIONS.USER_DELETE, '禁止删除管理员用户', {
      traceId,
      userId,
      username,
      reason: '管理员用户不可删除',
    });
    error(res, ErrorCode.FORBIDDEN, '管理员用户不可删除');
    return;
  }

  const result = await userService.deleteUser(userId);

  if (!result.success) {
    logWarn(OPERATIONS.USER_DELETE, result.error!.message, {
      traceId,
      userId,
      username,
    });
    error(res, result.error!.code, result.error!.message);
    return;
  }

  logUserOperation(OPERATIONS.USER_DELETE, MESSAGES.DELETE_SUCCESS, {
    traceId,
    userId,
    username,
  });

  success(res, null, MESSAGES.DELETE_SUCCESS);
}
