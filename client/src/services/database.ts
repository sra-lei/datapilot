/**
 * 数据库服务 API
 */

import { request } from '../utils/request';

export interface TableInfo {
  name: string;
  type: string;
}

export interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
}

export interface DatabaseStats {
  tableCount: number;
  totalRows: number;
  tableStats: Record<string, number>;
  dbFileSize: number;
  dbFilePath: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

/**
 * 获取所有表
 */
export async function getTables(): Promise<ApiResponse<TableInfo[]>> {
  return request('/database/tables');
}

/**
 * 获取表结构
 */
export async function getTableInfo(tableName: string): Promise<ApiResponse<ColumnInfo[]>> {
  return request(`/database/tables/${encodeURIComponent(tableName)}/info`);
}

/**
 * 获取表数据
 */
export async function getTableData(tableName: string, limit?: number): Promise<ApiResponse<QueryResult>> {
  const query = limit ? `?limit=${limit}` : '';
  return request(`/database/tables/${encodeURIComponent(tableName)}/data${query}`);
}

/**
 * 执行 SQL 查询
 */
export async function executeQuery(sql: string): Promise<ApiResponse<QueryResult>> {
  return request('/database/query', {
    method: 'POST',
    body: JSON.stringify({ sql }),
  });
}

/**
 * 获取数据库统计信息
 */
export async function getDatabaseStats(): Promise<ApiResponse<DatabaseStats>> {
  return request('/database/stats');
}
