/**
 * 数据库适配层接口
 * 定义统一的数据库操作接口，支持多种数据库实现
 */
export interface QueryRow {
    [key: string]: unknown;
}
export interface QueryResult {
    rows?: QueryRow[];
    insertId?: number;
    affectedRows?: number;
}
/**
 * 数据库适配器接口
 * 所有数据库适配器必须实现此接口
 */
export interface IDatabaseAdapter {
    /**
     * 初始化数据库连接
     */
    initialize(): Promise<void>;
    /**
     * 执行查询
     * @param sql SQL语句
     * @param params 参数数组
     */
    query(sql: string, params?: unknown[]): Promise<QueryResult>;
    /**
     * 执行插入
     * @param sql SQL语句
     * @param params 参数数组
     */
    insert(sql: string, params?: unknown[]): Promise<QueryResult>;
    /**
     * 执行更新
     * @param sql SQL语句
     * @param params 参数数组
     */
    update(sql: string, params?: unknown[]): Promise<QueryResult>;
    /**
     * 执行删除
     * @param sql SQL语句
     * @param params 参数数组
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
//# sourceMappingURL=IDatabaseAdapter.d.ts.map