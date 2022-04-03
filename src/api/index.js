const Router = require('koa-router');

const api = new Router();
const user = require('./user');

api.use('/user', user.routes());

module.exports = api;