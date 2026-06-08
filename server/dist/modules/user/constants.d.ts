/**
 * 用户模块常量
 */
import { ErrorCode, UserOperation, UserStatus } from './types';
export { ErrorCode, UserOperation, UserStatus };
export declare const MESSAGES: {
    readonly SUCCESS: "操作成功";
    readonly ALL_FIELDS_REQUIRED: "所有字段都不能为空";
    readonly USER_NOT_FOUND: "用户不存在";
    readonly USER_ALREADY_EXISTS: "用户名已存在";
    readonly PASSWORD_ERROR: "用户名或密码错误";
    readonly OLD_PASSWORD_ERROR: "旧密码错误";
    readonly GET_PERMISSION_FAILED: "获取用户权限失败，请稍后重试";
    readonly USER_INACTIVE: "用户已被停用，无法登录";
    readonly USER_DELETED: "用户已被删除";
    readonly REGISTER_SUCCESS: "注册成功";
    readonly LOGIN_SUCCESS: "登录成功";
    readonly CHANGE_PASSWORD_SUCCESS: "密码修改成功";
    readonly UPDATE_STATUS_SUCCESS: "状态更新成功";
    readonly DELETE_SUCCESS: "删除成功（停用）";
    readonly REGISTER_FAILED: "注册失败";
    readonly LOGIN_FAILED: "登录失败";
    readonly CHANGE_PASSWORD_FAILED: "修改密码失败";
    readonly UPDATE_STATUS_FAILED: "更新状态失败";
    readonly DELETE_FAILED: "删除失败";
};
export declare const OPERATIONS: {
    readonly USER_REGISTER: "USER_REGISTER";
    readonly USER_LOGIN: "USER_LOGIN";
    readonly USER_CHANGE_PASSWORD: "USER_CHANGE_PASSWORD";
    readonly USER_UPDATE_STATUS: "USER_UPDATE_STATUS";
    readonly USER_DELETE: "USER_DELETE";
};
export declare const USER_STATUS_LABELS: {
    readonly active: "启用";
    readonly inactive: "停用";
    readonly deleted: "已删除";
};
//# sourceMappingURL=constants.d.ts.map