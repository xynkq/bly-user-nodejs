const Router = require('koa-router');

const auth = new Router();
const authCtrl = require('./auth.ctrl');

auth.post('/', authCtrl.createCode); // 인증 코드 생성
auth.post('/verify', authCtrl.verifyCode); // 인증 코드 확인

module.exports = auth;