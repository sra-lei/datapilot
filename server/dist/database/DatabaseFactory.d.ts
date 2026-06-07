/**
 * 数据库工厂类
 * 根据环境配置创建相应的数据库适配器
 */
import { IDatabaseAdapter } from './IDatabaseAdapter';
import { MySQLConfig } from './MySQLAdapter';
export type DatabaseType = 'sqlite' | 'mysql';
export interface DatabaseConfig {
    type: DatabaseType;
    sqlite?: {
        dbPath: string;
    };
    mysql?: MySQLConfig;
}
/**
 * 数据库工厂类
 */
export declare class DatabaseFactory {
    private static instance;
    /**
     * 创建数据库适配器
     * @param config 数据库配置，默认从环境变量读取
     */
    static createAdapter(config?: DatabaseConfig): IDatabaseAdapter;
    /**
     * 获取数据库适配器实例（单例）
     */
    static getInstance(config?: DatabaseConfig): IDatabaseAdapter;
    /**
     * 初始化数据库
     */
    static initialize(config?: DatabaseConfig): Promise<IDatabaseAdapter>;
    /**
     * 关闭数据库连接
     */
    static close(): Promise<void>;
    /**
     * 重置实例（用于测试）
     */
    static reset(): void;
}
export declare function getDatabaseConfigFromEnv(): DatabaseConfig;
//# sourceMappingURL=DatabaseFactory.d.ts.map