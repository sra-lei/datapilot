/**
 * 数据库服务 API
 * 使用主服务器（Node.js Server）
 */

import { mainRequest } from '../utils/request';
import { MAIN_API } from './constants';
import type {
  ApiResponse,
  TableInfo,
  ColumnInfo,
  QueryResult,
  DatabaseStats,
} from './types';

/**
 * 获取所有表
 */
export async function getTables(): Promise<ApiResponse<TableInfo[]>> {
  return mainRequest(MAIN_API.DATABASE.TABLES);
}

/**
 * 获取表结构
 */
export async function getTableInfo(
  tableName: string
): Promise<ApiResponse<ColumnInfo[]>> {
  return mainRequest(MAIN_API.DATABASE.GET_TABLE_INFO(tableName));
}

/**
 * 获取表数据
 */
export async function getTableData(
  tableName: string,
  limit?: number
): Promise<ApiResponse<QueryResult>> {
  const baseUrl = MAIN_API.DATABASE.GET_TABLE_DATA(tableName);
  const url = limit ? `${baseUrl}?limit=${limit}` : baseUrl;
  return mainRequest(url);
}

/**
 * 执行 SQL 查询
 */
export async function executeQuery(sql: string): Promise<ApiResponse<QueryResult>> {
  return mainRequest(MAIN_API.DATABASE.QUERY, {
    method: 'POST',
    body: { sql },
  });
}

/**
 * 获取数据库统计信息
 */
export async function getDatabaseStats(): Promise<ApiResponse<DatabaseStats>> {
  return mainRequest(MAIN_API.DATABASE.STATS);
}
