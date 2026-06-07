/**
 * 用户模块类型定义
 */
export declare enum ErrorCode {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}
export declare enum UserOperation {
    USER_REGISTER = "USER_REGISTER",
    USER_LOGIN = "USER_LOGIN",
    USER_CHANGE_PASSWORD = "USER_CHANGE_PASSWORD"
}
export declare const UserMessages: {
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
export interface RegisterParams {
    username: string;
    password: string;
    email?: string;
}
export interface LoginParams {
    username: string;
    password: string;
}
export interface ChangePasswordParams {
    username: string;
    oldPassword: string;
    newPassword: string;
}
export interface UserInfo {
    id: number;
    username: string;
    email: string | null;
}
export interface ServiceResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: ErrorCode;
        message: string;
    };
}
//# sourceMappingURL=types.d.ts.map