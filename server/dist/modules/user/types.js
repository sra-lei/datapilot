"use strict";
/**
 * 用户模块类型定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessages = exports.UserOperation = exports.ErrorCode = void 0;
// 错误码
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 200] = "SUCCESS";
    ErrorCode[ErrorCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorCode[ErrorCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorCode[ErrorCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    ErrorCode[ErrorCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorCode[ErrorCode["CONFLICT"] = 409] = "CONFLICT";
    ErrorCode[ErrorCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    ErrorCode[ErrorCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// 用户操作类型
var UserOperation;
(function (UserOperation) {
    UserOperation["USER_REGISTER"] = "USER_REGISTER";
    UserOperation["USER_LOGIN"] = "USER_LOGIN";
    UserOperation["USER_CHANGE_PASSWORD"] = "USER_CHANGE_PASSWORD";
})(UserOperation || (exports.UserOperation = UserOperation = {}));
// 用户消息
exports.UserMessages = {
    SUCCESS: '操作成功',
    ALL_FIELDS_REQUIRED: '所有字段都不能为空',
    USER_NOT_FOUND: '用户不存在',
    USER_ALREADY_EXISTS: '用户名已存在',
    PASSWORD_ERROR: '用户名或密码错误',
    OLD_PASSWORD_ERROR: '旧密码错误',
    REGISTER_SUCCESS: '注册成功',
    LOGIN_SUCCESS: '登录成功',
    CHANGE_PASSWORD_SUCCESS: '密码修改成功',
    REGISTER_FAILED: '注册失败',
    LOGIN_FAILED: '登录失败',
    CHANGE_PASSWORD_FAILED: '修改密码失败',
};
//# sourceMappingURL=types.js.map