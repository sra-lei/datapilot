/**
 * 用户控制器
 * 处理用户请求和响应
 */

const { success, error } = require('../../utils/response');
const { generateTraceId, logUserOperation, logWarn } = require('../../utils/logUtils');
const { ERROR_CODES, MESSAGES, OPERATIONS } = require('./constants');
const userService = require('./service');

/**
 * 用户注册
 */
async function register(req, res) {
  const traceId = generateTraceId();
  const { username, password, email } = req.body;

  if (!username || !password) {
    logWarn(OPERATIONS.USER_REGISTER, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少必需参数',
    });
    return error(res, ERROR_CODES.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
  }

  const result = await userService.register({ username, password, email });

  if (!result.success) {
    logWarn(OPERATIONS.USER_REGISTER, result.error.message, {
      traceId,
      username,
    });
    return error(res, result.error.code, result.error.message);
  }

  logUserOperation(OPERATIONS.USER_REGISTER, MESSAGES.REGISTER_SUCCESS, {
    traceId,
    userId: result.data.id,
    username,
    email: email || null,
  });

  return success(res, result.data, MESSAGES.REGISTER_SUCCESS);
}

/**
 * 用户登录
 */
async function login(req, res) {
  const traceId = generateTraceId();
  const { username, password } = req.body;

  if (!username || !password) {
    logWarn(OPERATIONS.USER_LOGIN, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username: username || '未提供',
      reason: '缺少必需参数',
    });
    return error(res, ERROR_CODES.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
  }

  const result = await userService.login({ username, password });

  if (!result.success) {
    logWarn(OPERATIONS.USER_LOGIN, result.error.message, {
      traceId,
      username,
    });
    return error(res, result.error.code, result.error.message);
  }

  logUserOperation(OPERATIONS.USER_LOGIN, MESSAGES.LOGIN_SUCCESS, {
    traceId,
    userId: result.data.id,
    username,
  });

  return success(res, result.data, MESSAGES.LOGIN_SUCCESS);
}

/**
 * 修改密码
 */
async function changePassword(req, res) {
  const traceId = generateTraceId();
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    logWarn(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少必需参数',
    });
    return error(res, ERROR_CODES.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
  }

  const result = await userService.changePassword({ username, oldPassword, newPassword });

  if (!result.success) {
    logWarn(OPERATIONS.USER_CHANGE_PASSWORD, result.error.message, {
      traceId,
      username,
    });
    return error(res, result.error.code, result.error.message);
  }

  logUserOperation(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.CHANGE_PASSWORD_SUCCESS, {
    traceId,
    username,
  });

  return success(res, null, MESSAGES.CHANGE_PASSWORD_SUCCESS);
}

module.exports = {
  register,
  login,
  changePassword,
};
