/**
 * 用户模块常量
 */
import { ErrorCode, UserOperation } from './types';
export { ErrorCode, UserOperation };
export declare const MESSAGES: {
    readonly SUCCESS: "操作成功";
    readonly ALL_FIELDS_REQUIRED: "所有字段都不能为空";
    readonly USER_NOT_FOUND: "用户不存在";
    readonly USER_ALREADY_EXISTS: "用户名已存在";
    readonly PASSWORD_ERROR: "用户名或密码错误";
    readonly OLD_PASSWORD_ERROR: "旧密码错误";
    readonly REGISTER_SUCCESS: "注册成功";
    readonly LOGIN_SUCCESS: "登录成功";
    readonly CHANGE_PASSWORD_SUCCESS: "密码修改成功";
    readonly REGISTER_FAILED: "注册失败";
    readonly LOGIN_FAILED: "登录失败";
    readonly CHANGE_PASSWORD_FAILED: "修改密码失败";
};
export declare const OPERATIONS: {
    readonly USER_REGISTER: "USER_REGISTER";
    readonly USER_LOGIN: "USER_LOGIN";
    readonly USER_CHANGE_PASSWORD: "USER_CHANGE_PASSWORD";
};
//# sourceMappingURL=constants.d.ts.map