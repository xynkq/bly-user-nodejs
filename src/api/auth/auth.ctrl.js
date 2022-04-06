const Cache = require('memory-cache');
const Validate = require('../../lib/validation');
const config = require('./../../../config/cache');

exports.createCode = async (ctx) => {
  console.log('인증 코드 생성');
  const { body } = ctx.request;
  console.log(body);
  const validate = Validate.validateCreateCode(body);
  if (validate.error) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: '검증 오류입니다.',
    };
    return;
  }
  const { mobile } = body;
  if (!mobile) {
    ctx.status = 404;
    ctx.body = {
      status: 404,
      message: '전화번호를 입력해 주세요.',
    };
    return;
  }
  Cache.del(mobile);
  const code = Math.floor(1000 + Math.random() * 9000);
  Cache.put(mobile, code);
  ctx.status = 200;
  ctx.body = {
    status: 200,
    message: '코드가 발급되었습니다.',
    mobile,
    code,
  };
};

exports.verifyCode = async (ctx) => {
  console.log('인증 코드 확인');
  const { body } = ctx.request;
  console.log(body);
  const validate = Validate.validateVerifyCode(body);
  if (validate.error) {
    console.log(validate.error.message);
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: '검증 오류입니다.',
    };
    return;
  }
  try {
    const { mobile, code } = body;
    const data = await Cache.get(mobile);
    if (!data) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: '코드가 발급되지 않았습니다.',
      };
      return;
    }
    if (data !== code) {
      ctx.status = 402;
      ctx.body = {
        status: 402,
        message: '코드가 일치하지 않습니다. 분실 시 재발급해 주세요.',
      };
    } else {
      Cache.del(mobile);
      Cache.put(mobile, config.auth);
      ctx.status = 200;
      ctx.body = {
        status: 200,
        message: '전화번호 인증이 완료되었습니다.',
      };
    }
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '전화번호 인증이 실패하였습니다.',
    };
  }
};
