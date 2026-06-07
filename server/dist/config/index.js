"use strict";
/**
 * 统一导出 - 配置模块
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = exports.pool = exports.dbConfig = void 0;
var database_1 = require("./database");
Object.defineProperty(exports, "dbConfig", { enumerable: true, get: function () { return __importDefault(database_1).default; } });
var db_1 = require("./db");
Object.defineProperty(exports, "pool", { enumerable: true, get: function () { return db_1.pool; } });
Object.defineProperty(exports, "initDatabase", { enumerable: true, get: function () { return db_1.initDatabase; } });
//# sourceMappingURL=index.js.map