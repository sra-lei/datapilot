/**
 * 统一日志工具
 * 提供结构化日志记录方法，便于搜索和排查问题
 */
import winston from 'winston';
export interface LogContext {
    operation?: string;
    userId?: number;
    traceId?: string;
    [key: string]: unknown;
}
declare const logger: winston.Logger;
/**
 * 生成追踪ID
 */
export declare function generateTraceId(): string;
/**
 * 记录用户操作日志
 */
export declare function logUserOperation(operation: string, message: string, context?: LogContext): void;
/**
 * 记录错误日志
 */
export declare function logError(operation: string, message: string, err: unknown, context?: LogContext): void;
/**
 * 记录警告日志
 */
export declare function logWarn(operation: string, message: string, context?: LogContext): void;
/**
 * 记录调试日志
 */
export declare function logDebug(operation: string, message: string, context?: LogContext): void;
/**
 * 记录数据库操作日志
 */
export declare function logDatabase(operation: string, message: string, context?: LogContext): void;
/**
 * 记录系统日志
 */
export declare function logSystem(operation: string, message: string, context?: LogContext): void;
export { logger };
//# sourceMappingURL=logUtils.d.ts.map