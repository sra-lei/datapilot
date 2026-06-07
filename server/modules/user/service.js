/**
 * 用户服务层
 * 处理用户相关业务逻辑
 */

const { pool } = require('../../config/db');
const { ERROR_CODES, MESSAGES } = require('./constants');

/**
 * 用户注册
 * @param {Object} params - 注册参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @param {string} [params.email] - 邮箱
 * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
 */
async function register({ username, password, email }) {
  try {
    const [ result ] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [ username, password, email || null ],
    );

    return {
      success: true,
      data: {
        id: result.insertId,
        username,
        email: email || null,
      },
    };
  } catch (_err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return {
        success: false,
        error: {
          code: ERROR_CODES.CONFLICT,
          message: MESSAGES.USER_ALREADY_EXISTS,
        },
      };
    }

    return {
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: MESSAGES.REGISTER_FAILED,
      },
    };
  }
}

/**
 * 用户登录
 * @param {Object} params - 登录参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
 */
async function login({ username, password }) {
  try {
    const [ rows ] = await pool.query(
      'SELECT id, username, email FROM users WHERE username = ? AND password = ?',
      [ username, password ],
    );

    if (rows.length === 0) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: MESSAGES.PASSWORD_ERROR,
        },
      };
    }

    return {
      success: true,
      data: rows[0],
    };
  } catch (_err) {
    return {
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: MESSAGES.LOGIN_FAILED,
      },
    };
  }
}

/**
 * 修改密码
 * @param {Object} params - 修改密码参数
 * @param {string} params.username - 用户名
 * @param {string} params.oldPassword - 旧密码
 * @param {string} params.newPassword - 新密码
 * @returns {Promise<{success: boolean, error?: Object}>}
 */
async function changePassword({ username, oldPassword, newPassword }) {
  try {
    // 验证旧密码
    const [ rows ] = await pool.query(
      'SELECT id FROM users WHERE username = ? AND password = ?',
      [ username, oldPassword ],
    );

    if (rows.length === 0) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: MESSAGES.OLD_PASSWORD_ERROR,
        },
      };
    }

    // 更新密码
    await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [ newPassword, username ],
    );

    return { success: true };
  } catch (_err) {
    return {
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: MESSAGES.CHANGE_PASSWORD_FAILED,
      },
    };
  }
}

module.exports = {
  register,
  login,
  changePassword,
};
