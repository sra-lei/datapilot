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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const router_1 = __importDefault(require("./modules/user/router"));
const router_2 = __importDefault(require("./modules/database-manager/router"));
const router_3 = __importDefault(require("./modules/permission/router"));
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger 配置
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trae API 文档',
            version: '1.0.0',
            description: '用户管理、权限管理和数据库管理的 API 文档',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: '开发服务器',
            },
        ],
    },
    apis: ['./src/modules/**/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Swagger API 文档
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
    explorer: true,
}));
// 路由配置
app.use('/api/user', router_1.default);
app.use('/api/database', router_2.default);
app.use('/api/permission', router_3.default);
// 基础路由
app.get('/', (_req, res) => {
    res.json({
        message: 'Trae API Server',
        docs: 'http://localhost:3000/api-docs',
    });
});
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
exports.default = app;
//# sourceMappingURL=app.js.map