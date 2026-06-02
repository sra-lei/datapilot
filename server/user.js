const express = require('express');
const router = express.Router();
const { pool } = require('./config/db');
const { success, error } = require('./utils/response');
const { ERROR_CODES, MESSAGES } = require('./constants/userConstants');
const { logUserOperation, logError, logWarn, generateTraceId, OPERATIONS } = require('./utils/logUtils');

// 用户注册
router.post('/register', async (req, res) => {
  const traceId = generateTraceId();
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    logWarn(OPERATIONS.USER_REGISTER, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少必需参数'
    });
    return error(res, ERROR_CODES.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email || null]
    );
    
    logUserOperation(OPERATIONS.USER_REGISTER, MESSAGES.REGISTER_SUCCESS, {
      traceId,
      userId: result.insertId,
      username,
      email: email || null
    });
    
    return success(res, { id: result.insertId, username, email }, MESSAGES.REGISTER_SUCCESS);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      logWarn(OPERATIONS.USER_REGISTER, MESSAGES.USER_ALREADY_EXISTS, {
        traceId,
        username
      });
      return error(res, ERROR_CODES.CONFLICT, MESSAGES.USER_ALREADY_EXISTS);
    }
    
    logError(OPERATIONS.USER_REGISTER, MESSAGES.REGISTER_FAILED, err, {
      traceId,
      username
    });
    return error(res, ERROR_CODES.INTERNAL_ERROR, MESSAGES.REGISTER_FAILED);
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const traceId = generateTraceId();
  const { username, password } = req.body;
  
  if (!username || !password) {
    logWarn(OPERATIONS.USER_LOGIN, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username: username || '未提供',
      reason: '缺少必需参数'
    });
    return error(res, ERROR_CODES.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
  }
  
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (rows.length === 0) {
      logWarn(OPERATIONS.USER_LOGIN, MESSAGES.PASSWORD_ERROR, {
        traceId,
        username
      });
      return error(res, ERROR_CODES.UNAUTHORIZED, MESSAGES.PASSWORD_ERROR);
    }
    
    logUserOperation(OPERATIONS.USER_LOGIN, MESSAGES.LOGIN_SUCCESS, {
      traceId,
      userId: rows[0].id,
      username
    });
    
    return success(res, rows[0], MESSAGES.LOGIN_SUCCESS);
  } catch (err) {
    logError(OPERATIONS.USER_LOGIN, MESSAGES.LOGIN_FAILED, err, {
      traceId,
      username
    });
    return error(res, ERROR_CODES.INTERNAL_ERROR, MESSAGES.LOGIN_FAILED);
  }
});

// 修改密码
router.post('/change-password', async (req, res) => {
  const traceId = generateTraceId();
  const { username, oldPassword, newPassword } = req.body;
  
  if (!username || !oldPassword || !newPassword) {
    logWarn(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.ALL_FIELDS_REQUIRED, {
      traceId,
      username,
      reason: '缺少必需参数'
    });
    return error(res, ERROR_CODES.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
  }
  
  try {
    // 验证旧密码
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE username = ? AND password = ?',
      [username, oldPassword]
    );
    
    if (rows.length === 0) {
      logWarn(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.OLD_PASSWORD_ERROR, {
        traceId,
        username
      });
      return error(res, ERROR_CODES.UNAUTHORIZED, MESSAGES.OLD_PASSWORD_ERROR);
    }
    
    // 更新密码
    await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [newPassword, username]
    );
    
    logUserOperation(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.CHANGE_PASSWORD_SUCCESS, {
      traceId,
      userId: rows[0].id,
      username
    });
    
    return success(res, null, MESSAGES.CHANGE_PASSWORD_SUCCESS);
  } catch (err) {
    logError(OPERATIONS.USER_CHANGE_PASSWORD, MESSAGES.CHANGE_PASSWORD_FAILED, err, {
      traceId,
      username
    });
    return error(res, ERROR_CODES.INTERNAL_ERROR, MESSAGES.CHANGE_PASSWORD_FAILED);
  }
});

module.exports = router;
