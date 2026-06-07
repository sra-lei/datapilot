/**
 * SQLite适配器
 * 用于开发环境，无需额外安装数据库服务
 */
import { IDatabaseAdapter, QueryResult } from './IDatabaseAdapter';
export declare class SQLiteAdapter implements IDatabaseAdapter {
    private db;
    private dbPath;
    constructor(dbPath?: string);
    /**
     * 初始化数据库连接
     */
    initialize(): Promise<void>;
    /**
     * 初始化表结构
     */
    private initTables;
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
    /**
     * 统一错误处理
     */
    private handleError;
}
//# sourceMappingURL=SQLiteAdapter.d.ts.map