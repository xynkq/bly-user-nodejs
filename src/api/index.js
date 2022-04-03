const Router = require('koa-router');

const api = new Router();
const user = require('./user');
const auth = require('./auth');

api.use('/user', user.routes());
api.use('/auth', auth.routes());

module.exports = api;