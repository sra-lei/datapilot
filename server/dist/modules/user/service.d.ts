/**
 * 用户服务层
 * 处理用户相关业务逻辑
 */
import { UserInfo, ServiceResult } from './types';
import { RegisterParams, LoginParams, ChangePasswordParams } from './types';
/**
 * 用户注册
 */
export declare function register(params: RegisterParams): Promise<ServiceResult<UserInfo>>;
/**
 * 用户登录
 */
export declare function login(params: LoginParams): Promise<ServiceResult<UserInfo>>;
/**
 * 修改密码
 */
export declare function changePassword(params: ChangePasswordParams): Promise<ServiceResult>;
//# sourceMappingURL=service.d.ts.map