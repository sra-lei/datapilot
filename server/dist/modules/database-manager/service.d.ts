/**
 * 数据库管理模块 - 服务层
 */
import { TableInfo, ColumnInfo, QueryResult, ServiceResult } from './types';
export declare class DatabaseManagerService {
    private dbPath;
    constructor();
    /**
     * 获取数据库连接（直接使用 better-sqlite3）
     */
    private getDb;
    /**
     * 获取所有表信息
     */
    getTables(): Promise<ServiceResult<TableInfo[]>>;
    /**
     * 获取表结构信息
     */
    getTableInfo(tableName: string): Promise<ServiceResult<ColumnInfo[]>>;
    /**
     * 执行查询
     */
    executeQuery(sql: string): Promise<ServiceResult<QueryResult>>;
    /**
     * 获取表数据预览
     */
    getTableData(tableName: string, limit?: number): Promise<ServiceResult<QueryResult>>;
    /**
     * 获取数据库统计信息
     */
    getDatabaseStats(): Promise<ServiceResult<Record<string, unknown>>>;
}
export declare const databaseManagerService: DatabaseManagerService;
//# sourceMappingURL=service.d.ts.map