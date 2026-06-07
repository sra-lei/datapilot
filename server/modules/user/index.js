/**
 * 用户模块导出
 */

const router = require('./router');
const constants = require('./constants');
const service = require('./service');
const controller = require('./controller');

module.exports = {
  router,
  constants,
  service,
  controller,
};
