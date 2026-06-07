/**
 * MySQL适配器
 * 用于生产环境
 */
import { IDatabaseAdapter, QueryResult } from './IDatabaseAdapter';
export interface MySQLConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
export declare class MySQLAdapter implements IDatabaseAdapter {
    private pool;
    private config;
    constructor(config: MySQLConfig);
    /**
     * 初始化数据库连接
     */
    initialize(): Promise<void>;
    /**
     * 执行查询
     */
    query(sql: string, params?: unknown[]): Promise<QueryResult>;
    /**
     * 执行插入
     */
    insert(sql: string, params?: unknown[]): Promise<QueryResult>;
    /**
     * 执行更新
     */
    update(sql: string, params?: unknown[]): Promise<QueryResult>;
    /**
     * 执行删除
     */
    delete(sql: string, params?: unknown[]): Promise<QueryResult>;
    /**
     * 关闭数据库连接
     */
    close(): Promise<void>;
    /**
     * 获取适配器名称
     */
    getName(): string;
}
//# sourceMappingURL=MySQLAdapter.d.ts.map