"use strict";
/**
 * 统一导出 - 工具模块
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
__exportStar(require("./logUtils"), exports);
var response_1 = require("./response");
Object.defineProperty(exports, "success", { enumerable: true, get: function () { return response_1.success; } });
Object.defineProperty(exports, "error", { enumerable: true, get: function () { return response_1.error; } });
//# sourceMappingURL=index.js.map