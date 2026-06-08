/**
 * 用户服务层
 * 处理用户相关业务逻辑
 */
import { UserStatus, UserInfo, ServiceResult } from './types';
import { RegisterParams, LoginParams, ChangePasswordParams } from './types';
/**
 * 用户注册
 */
export declare function register(params: RegisterParams): Promise<ServiceResult<UserInfo>>;
/**
 * 用户登录
 */
export declare function login(params: LoginParams): Promise<ServiceResult<UserInfo & {
    roles?: string[];
    permissions?: string[];
}>>;
/**
 * 修改密码
 */
export declare function changePassword(params: ChangePasswordParams): Promise<ServiceResult>;
/**
 * 修改密码（管理员强制修改，不需要原密码）
 */
export declare function updatePassword(params: {
    username: string;
    newPassword: string;
}): Promise<ServiceResult>;
/**
 * 根据ID获取用户信息
 */
export declare function getUserById(userId: number): Promise<ServiceResult<UserInfo>>;
/**
 * 更新用户状态
 */
export declare function updateUserStatus(params: {
    userId: number;
    status: UserStatus;
}): Promise<ServiceResult>;
/**
 * 删除用户（改为停用状态）
 */
export declare function deleteUser(userId: number): Promise<ServiceResult>;
//# sourceMappingURL=service.d.ts.map