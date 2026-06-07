/**
 * 数据库配置
 */

export default {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trae',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
