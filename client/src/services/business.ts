/**
 * 业务服务 API
 * 使用业务服务器（Python Server）
 */

import { businessRequest } from '../utils/request';
import { BUSINESS_API } from './constants';
import type { ApiResponse, ServiceHealth, BusinessUser } from './types';

/**
 * 检查业务服务健康状态
 */
export async function checkBusinessHealth(): Promise<ApiResponse<ServiceHealth>> {
  return businessRequest<ServiceHealth>(BUSINESS_API.SYSTEM.HEALTH);
}

/**
 * 获取业务服务器用户列表
 */
export async function getBusinessUsers(): Promise<ApiResponse<BusinessUser[]>> {
  return businessRequest<BusinessUser[]>(BUSINESS_API.USER.LIST);
}

/**
 * 获取业务服务器数据库统计信息
 */
export async function getBusinessDatabaseStats(): Promise<
  ApiResponse<{ table_count: number; db_size: number; db_type: string }>
> {
  return businessRequest<{ table_count: number; db_size: number; db_type: string }>(
    BUSINESS_API.DATABASE.STATS
  );
}

/**
 * 获取数据库表列表
 */
export async function getBusinessTables(): Promise<
  ApiResponse<Array<{ name: string; rows: number }>>
> {
  return businessRequest<Array<{ name: string; rows: number }>>(
    BUSINESS_API.DATABASE.TABLES
  );
}

/**
 * 获取表结构
 */
export async function getBusinessTableStructure(
  tableName: string
): Promise<ApiResponse<{ table_name: string; columns: any[] }>> {
  return businessRequest<{ table_name: string; columns: any[] }>(
    BUSINESS_API.DATABASE.GET_TABLE_STRUCTURE(tableName)
  );
}

/**
 * 获取表数据
 */
export async function getBusinessTableData(
  tableName: string,
  page: number = 1,
  pageSize: number = 20
): Promise<
  ApiResponse<{
    table_name: string;
    data: any[];
    page: number;
    page_size: number;
    total: number;
  }>
> {
  return businessRequest<{
    table_name: string;
    data: any[];
    page: number;
    page_size: number;
    total: number;
  }>(BUSINESS_API.DATABASE.GET_TABLE_DATA(tableName) + `?page=${page}&page_size=${pageSize}`);
}

/**
 * 执行 SQL 查询
 */
export async function executeBusinessQuery(
  query: string
): Promise<ApiResponse<{ result: any[] }>> {
  return businessRequest<{ result: any[] }>(BUSINESS_API.DATABASE.QUERY, {
    method: 'POST',
    body: { query },
  });
}
