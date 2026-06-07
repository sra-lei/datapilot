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

/**
 * 用户注册
 */
export async function register(req: Request, res: Response): Promise<void> {
  const traceId = generateTraceId();
  const { username, password, email } = req.body as RegisterParams;

  if (!username || !password) {
    logWarn(OPERATIONS.USER_REGISTER, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少必需参数',
    });
    error(res, ErrorCode.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    return;
  }

  const result = await userService.register({ username, password, email });

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
  const { username, oldPassword, newPassword } = req.body as ChangePasswordParams;

  if (!username || !oldPassword || !newPassword) {
    logWarn(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少必需参数',
    });
    error(res, ErrorCode.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
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
