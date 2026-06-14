/**
 * 统一请求工具
 * 支持从多个服务器获取数据
 */

import { ServerType, getServerUrl } from '../config';
import type { ApiResponse } from '../services/types';

// 请求配置接口
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

// 默认请求配置
const defaultConfig: RequestConfig = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

/**
 * 发起请求
 * @param serverType 服务器类型
 * @param path API 路径
 * @param config 请求配置
 * @returns 响应结果
 */
export async function request<T = unknown>(
  serverType: ServerType,
  path: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const mergedConfig: RequestConfig = { ...defaultConfig, ...config };
  const url = `${getServerUrl(serverType)}${path}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, mergedConfig.timeout);

    const response = await fetch(url, {
      method: mergedConfig.method,
      headers: mergedConfig.headers,
      body: mergedConfig.body ? JSON.stringify(mergedConfig.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 解析响应
    const result = await response.json() as ApiResponse<T>;
    result.success = response.ok && result.code === 200;

    return result;
  } catch (error) {
    console.error(`请求失败 ${url}:`, error);
    return {
      success: false,
      code: 500,
      message: error instanceof Error ? error.message : '请求失败',
    };
  }
}

/**
 * 主服务器请求（Node.js Server）
 */
export const mainRequest = async <T = unknown>(
  path: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  return request<T>(ServerType.MAIN, path, config);
};

/**
 * 业务服务器请求（Python Server）
 */
export const businessRequest = async <T = unknown>(
  path: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  return request<T>(ServerType.BUSINESS, path, config);
};

export default request;
