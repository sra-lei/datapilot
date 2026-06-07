"use strict";
/**
 * 数据库适配层模块
 * 统一导出所有数据库相关组件
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfigFromEnv = exports.DatabaseFactory = exports.MySQLAdapter = exports.SQLiteAdapter = void 0;
var SQLiteAdapter_1 = require("./SQLiteAdapter");
Object.defineProperty(exports, "SQLiteAdapter", { enumerable: true, get: function () { return SQLiteAdapter_1.SQLiteAdapter; } });
var MySQLAdapter_1 = require("./MySQLAdapter");
Object.defineProperty(exports, "MySQLAdapter", { enumerable: true, get: function () { return MySQLAdapter_1.MySQLAdapter; } });
var DatabaseFactory_1 = require("./DatabaseFactory");
Object.defineProperty(exports, "DatabaseFactory", { enumerable: true, get: function () { return DatabaseFactory_1.DatabaseFactory; } });
Object.defineProperty(exports, "getDatabaseConfigFromEnv", { enumerable: true, get: function () { return DatabaseFactory_1.getDatabaseConfigFromEnv; } });
//# sourceMappingURL=index.js.map