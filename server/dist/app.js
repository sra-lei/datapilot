"use strict";
/**
 * Express 应用配置
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./modules/user/router"));
const router_2 = __importDefault(require("./modules/database-manager/router"));
const router_3 = __importDefault(require("./modules/permission/router"));
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 路由配置
app.use('/api/user', router_1.default);
app.use('/api/database', router_2.default);
app.use('/api/permission', router_3.default);
// 基础路由
app.get('/', (_req, res) => {
    res.json({ message: 'Trae API Server' });
});
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
exports.default = app;
//# sourceMappingURL=app.js.map