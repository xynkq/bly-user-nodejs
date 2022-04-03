const Cache = require('memory-cache');
const SMS = require('./../lib/sms');

const smsMiddleware = async (ctx) => {
  console.log('112');
  const { mobile } = ctx.request.body;
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
  try {
    const response = await SMS.getCode(JSON.stringify({
      type: "SMS",
      countryCode: "82",
      from: mobile,
      content: `인증번호 [${code}]를 입력해 주세요.`,
      messages: [{
        to: "01012345678",
        content: `인증번호 [${code}]를 입력해 주세요.`,
      }],
    }));
    console.log(response);
    ctx.status = response.status;
    ctx.body = response.body;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = smsMiddleware;