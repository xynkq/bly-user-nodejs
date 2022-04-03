const Router = require('koa-router');

const user = new Router();
const userCtrl = require('./user.ctrl');

user.post('/', userCtrl.add); // 회원 가입
user.post('/login/email', userCtrl.loginByEmail); // 로그인 - 이메일
user.post('/login/mobile', userCtrl.loginByMobile); // 로그인 - 전화번호
user.post('/logout/:_idx', userCtrl.logout); // 로그아웃
user.put('/find', userCtrl.changePassword); // 비밀번호 재설정
user.get('/', userCtrl.searchAll); // 전체 사용자 조회
user.get('/:_idx', userCtrl.search); // 사용자 조회
user.delete('/:_idx', userCtrl.remove); // 회원 탈퇴

module.exports = user;