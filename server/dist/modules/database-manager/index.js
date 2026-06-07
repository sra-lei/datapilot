"use strict";
/**
 * 数据库管理模块 - 导出
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseManagerService = exports.databaseManagerController = exports.default = void 0;
var router_1 = require("./router");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(router_1).default; } });
var controller_1 = require("./controller");
Object.defineProperty(exports, "databaseManagerController", { enumerable: true, get: function () { return controller_1.databaseManagerController; } });
var service_1 = require("./service");
Object.defineProperty(exports, "databaseManagerService", { enumerable: true, get: function () { return service_1.databaseManagerService; } });
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map