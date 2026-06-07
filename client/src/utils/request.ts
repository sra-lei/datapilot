/**
 * 封装fetch请求
 */

const BASE_URL = '/api';

export async function request<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}
