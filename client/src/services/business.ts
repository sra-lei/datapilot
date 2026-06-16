/**
 * 业务服务 API
 * 使用业务服务器（Python Server）
 */

import { chartermateRequest } from '../utils/request';
import { BUSINESS_API } from './constants';
import type { ApiResponse, ServiceHealth, BusinessUser } from './types';

/**
 * 检查业务服务健康状态
 * CharterMate 返回格式: {status: "ok", service: "CharterMate"}
 * 不使用 ApiResponse 包装格式
 */
export async function checkBusinessHealth(): Promise<ServiceHealth> {
  try {
    const path = BUSINESS_API.SYSTEM.HEALTH;
    
    // 开发环境使用相对路径（通过 Vite 代理）
    const url = import.meta.env.DEV ? path : 
      `${import.meta.env.VITE_SERVER_CHARTERMATE_URL || 'http://localhost:8000'}${path}`;
    
    const response = await fetch(url);
    const data = await response.json() as ServiceHealth;
    return data;
  } catch (error) {
    console.error('检查 CharterMate 服务状态失败', error);
    return { status: 'error', service: 'charter_mate' };
  }
}

/**
 * 获取业务服务器用户列表
 */
export async function getBusinessUsers(): Promise<ApiResponse<BusinessUser[]>> {
  return chartermateRequest<BusinessUser[]>(BUSINESS_API.USER.LIST);
}

/**
 * 获取业务服务器数据库统计信息
 */
export async function getBusinessDatabaseStats(): Promise<
  ApiResponse<{ table_count: number; db_size: number; db_type: string }>
> {
  return chartermateRequest<{ table_count: number; db_size: number; db_type: string }>(
    BUSINESS_API.DATABASE.STATS
  );
}

/**
 * 获取数据库表列表
 */
export async function getBusinessTables(): Promise<
  ApiResponse<Array<{ name: string; rows: number }>>
> {
  return chartermateRequest<Array<{ name: string; rows: number }>>(
    BUSINESS_API.DATABASE.TABLES
  );
}

/**
 * 获取表结构
 */
export async function getBusinessTableStructure(
  tableName: string
): Promise<ApiResponse<{ table_name: string; columns: any[] }>> {
  return chartermateRequest<{ table_name: string; columns: any[] }>(
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
  return chartermateRequest<{
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
  return chartermateRequest<{ result: any[] }>(BUSINESS_API.DATABASE.QUERY, {
    method: 'POST',
    body: { query },
  });
}
