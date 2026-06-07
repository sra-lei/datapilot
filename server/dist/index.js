"use strict";
/**
 * 服务器入口文件
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const PORT = process.env.PORT || 3001;
// 启动服务器
async function startServer() {
    try {
        await (0, config_1.initDatabase)();
        app_1.default.listen(PORT, () => {
            (0, utils_1.logSystem)(constants_1.SYSTEM_OPERATIONS.SERVER_START, constants_1.SYSTEM_MESSAGES.SERVER_START_SUCCESS, {
                port: PORT,
                nodeEnv: process.env.NODE_ENV || 'development',
            });
        });
    }
    catch (error) {
        (0, utils_1.logError)(constants_1.SYSTEM_OPERATIONS.SERVER_START, constants_1.SYSTEM_MESSAGES.SERVER_START_FAILED, error, {
            port: PORT,
        });
    }
}
startServer();
//# sourceMappingURL=index.js.map