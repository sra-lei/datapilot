"use strict";
/**
 * 统一响应格式工具
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.error = error;
// 成功响应
function success(res, data = null, message = '操作成功', statusCode = 200) {
    return res.status(statusCode).json({
        code: statusCode,
        message,
        data,
    });
}
// 错误响应
function error(res, code, message) {
    return res.status(code).json({
        code,
        message,
    });
}
//# sourceMappingURL=response.js.map