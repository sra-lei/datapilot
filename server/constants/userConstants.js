/**
 * 用户模块常量
 */

// 错误码定义
const ERROR_CODES = {
  // 成功
  SUCCESS: 200,
  
  // 客户端错误 4xx
  BAD_REQUEST: 400,          // 参数错误
  UNAUTHORIZED: 401,         // 未认证
  FORBIDDEN: 403,            // 无权限
  NOT_FOUND: 404,            // 资源不存在
  CONFLICT: 409,             // 资源冲突
  
  // 服务器错误 5xx
  INTERNAL_ERROR: 500,        // 服务器内部错误
  SERVICE_UNAVAILABLE: 503   // 服务不可用
};

// 消息定义
const MESSAGES = {
  // 通用消息
  SUCCESS: '操作成功',
  BAD_REQUEST: '请求参数错误',
  UNAUTHORIZED: '未认证，请先登录',
  FORBIDDEN: '无权限访问',
  NOT_FOUND: '资源不存在',
  CONFLICT: '资源冲突',
  INTERNAL_ERROR: '服务器内部错误',
  SERVICE_UNAVAILABLE: '服务暂不可用',
  
  // 用户相关消息
  USER_NOT_FOUND: '用户不存在',
  USER_ALREADY_EXISTS: '用户名已存在',
  PASSWORD_ERROR: '用户名或密码错误',
  OLD_PASSWORD_ERROR: '旧密码错误',
  
  // 参数校验消息
  USERNAME_REQUIRED: '用户名不能为空',
  PASSWORD_REQUIRED: '密码不能为空',
  EMAIL_REQUIRED: '邮箱不能为空',
  OLD_PASSWORD_REQUIRED: '旧密码不能为空',
  NEW_PASSWORD_REQUIRED: '新密码不能为空',
  ALL_FIELDS_REQUIRED: '所有字段都不能为空',
  
  // 操作结果消息
  REGISTER_SUCCESS: '注册成功',
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
  CHANGE_PASSWORD_SUCCESS: '密码修改成功',
  
  // 错误消息
  REGISTER_FAILED: '注册失败',
  LOGIN_FAILED: '登录失败',
  CHANGE_PASSWORD_FAILED: '修改密码失败',
  USER_ALREADY_EXISTS_ERROR: '用户名已存在',
  
  // 数据库相关消息
  DB_INIT_SUCCESS: '数据库初始化成功',
  DB_INIT_FAILED: '数据库初始化失败',
  DB_CONNECTION_FAILED: '数据库连接失败',
  
  // 系统相关消息
  SERVER_START_SUCCESS: '服务器启动成功',
  SERVER_START_FAILED: '服务器启动失败',
  SERVER_STOP_SUCCESS: '服务器停止成功'
};

// 用户错误码和消息映射
const USER_ERRORS = {
  USERNAME_PASSWORD_REQUIRED: {
    code: ERROR_CODES.BAD_REQUEST,
    message: MESSAGES.ALL_FIELDS_REQUIRED
  },
  USER_ALREADY_EXISTS: {
    code: ERROR_CODES.CONFLICT,
    message: MESSAGES.USER_ALREADY_EXISTS
  },
  REGISTER_FAILED: {
    code: ERROR_CODES.INTERNAL_ERROR,
    message: MESSAGES.REGISTER_FAILED
  },
  PASSWORD_ERROR: {
    code: ERROR_CODES.UNAUTHORIZED,
    message: MESSAGES.PASSWORD_ERROR
  },
  LOGIN_FAILED: {
    code: ERROR_CODES.INTERNAL_ERROR,
    message: MESSAGES.LOGIN_FAILED
  },
  OLD_PASSWORD_ERROR: {
    code: ERROR_CODES.UNAUTHORIZED,
    message: MESSAGES.OLD_PASSWORD_ERROR
  },
  CHANGE_PASSWORD_FAILED: {
    code: ERROR_CODES.INTERNAL_ERROR,
    message: MESSAGES.CHANGE_PASSWORD_FAILED
  }
};

module.exports = {
  ERROR_CODES,
  MESSAGES,
  USER_ERRORS
};
