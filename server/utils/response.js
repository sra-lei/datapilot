/**
 * 统一响应格式工具
 */

/**
 * 成功响应
 * @param {Object} res - Express Response 对象
 * @param {Object} data - 返回数据
 * @param {string} message - 成功消息
 */
function success(res, data = null, message = '操作成功') {
  return res.status(200).json({
    code: 200,
    message,
    data
  });
}

/**
 * 错误响应
 * @param {Object} res - Express Response 对象
 * @param {number} code - 错误码
 * @param {string} message - 错误消息
 */
function error(res, code, message) {
  return res.status(code).json({
    code,
    message
  });
}

module.exports = {
  success,
  error
};
