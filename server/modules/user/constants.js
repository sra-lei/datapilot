/**
 * 用户模块常量
 */

// 用户相关错误码
const ERROR_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// 用户相关消息
const MESSAGES = {
  // 通用
  SUCCESS: '操作成功',

  // 参数校验
  ALL_FIELDS_REQUIRED: '所有字段都不能为空',

  // 用户操作
  USER_NOT_FOUND: '用户不存在',
  USER_ALREADY_EXISTS: '用户名已存在',
  PASSWORD_ERROR: '用户名或密码错误',
  OLD_PASSWORD_ERROR: '旧密码错误',

  // 操作结果
  REGISTER_SUCCESS: '注册成功',
  LOGIN_SUCCESS: '登录成功',
  CHANGE_PASSWORD_SUCCESS: '密码修改成功',

  // 操作失败
  REGISTER_FAILED: '注册失败',
  LOGIN_FAILED: '登录失败',
  CHANGE_PASSWORD_FAILED: '修改密码失败',
};

// 操作类型
const OPERATIONS = {
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGIN: 'USER_LOGIN',
  USER_CHANGE_PASSWORD: 'USER_CHANGE_PASSWORD',
};

module.exports = {
  ERROR_CODES,
  MESSAGES,
  OPERATIONS,
};
