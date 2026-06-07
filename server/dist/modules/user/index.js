"use strict";
/**
 * 用户模块导出
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
exports.changePasswordController = exports.loginController = exports.registerController = exports.changePassword = exports.login = exports.register = exports.router = void 0;
var router_1 = require("./router");
Object.defineProperty(exports, "router", { enumerable: true, get: function () { return __importDefault(router_1).default; } });
__exportStar(require("./constants"), exports);
__exportStar(require("./types"), exports);
var service_1 = require("./service");
Object.defineProperty(exports, "register", { enumerable: true, get: function () { return service_1.register; } });
Object.defineProperty(exports, "login", { enumerable: true, get: function () { return service_1.login; } });
Object.defineProperty(exports, "changePassword", { enumerable: true, get: function () { return service_1.changePassword; } });
var controller_1 = require("./controller");
Object.defineProperty(exports, "registerController", { enumerable: true, get: function () { return controller_1.register; } });
Object.defineProperty(exports, "loginController", { enumerable: true, get: function () { return controller_1.login; } });
Object.defineProperty(exports, "changePasswordController", { enumerable: true, get: function () { return controller_1.changePassword; } });
//# sourceMappingURL=index.js.map