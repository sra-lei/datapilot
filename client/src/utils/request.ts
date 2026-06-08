/**
 * 封装fetch请求
 */

const BASE_URL = '/api';

export async function request<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  // 从 localStorage 获取当前用户信息
  let userId: string | null = null;
  try {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      userId = currentUser.id?.toString();
    }
  } catch (error) {
    console.error('获取用户ID失败', error);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // 如果有 userId，添加到请求头
  if (userId) {
    headers['x-user-id'] = userId;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    headers,
    ...options,
  });

  const data = await response.json() as { code?: number; message?: string; data?: T };

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data as T;
}
