const Cache = require('memory-cache');
const Validate = require('../../lib/validation');
const models = require('./../../models');
const config = require('./../../../config/cache');

exports.add = async (ctx) => {
  console.log('회원 가입');
  const { body } = ctx.request;
  console.log(body);
  const validate = Validate.validateUser(body);
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
    const { email, mobile } = body;
    const overlap = await models.User.findAllForCheck(email, mobile);
    if (overlap) {
      if (overlap.email == email) {
        ctx.status = 403;
        ctx.body = {
          status: 403,
          message: '이미 존재하는 이메일입니다.',
        };
      } else if (overlap.mobile == mobile) {
        ctx.status = 403;
        ctx.body = {
          status: 403,
          message: '이미 존재하는 전화번호입니다.',
        };
      }
      return;
    }
    const verified = await Cache.get(mobile);
    if (verified != config.auth) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: '전화번호 인증을 진행해 주세요.',
      };
      return;
    }
    await models.User.create(body);
    Cache.del(mobile);
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: '회원 가입에 성공하였습니다.',
    };
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '회원 가입에 실패하였습니다.',
    };
  }
};

exports.loginByEmail = async (ctx) => {
  console.log('이메일 로그인');
  const { body } = ctx.request;
  console.log(body);
  const validate = Validate.validateLoginByEmail(body);
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
    const { email, pw } = body;
    const user = await models.User.loginForEamil(email, pw);
    if (!user) {
      console.log(user);
      ctx.status = 404;
      ctx.body = {
        status: 404,
        message: '입력 정보와 일치하는 회원이 존재하지 않습니다.',
      };
      return;
    }
    const login = await Cache.get(user.idx);
    if (login == config.user) {
      ctx.status = 403;
      ctx.body = {
        status: 403,
        message: '이미 로그인된 회원입니다.',
      };
      return;
    }
    Cache.put(user.idx, config.user);
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: '로그인에 성공하였습니다.',
      data: user,
    };
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '로그인에 실패하였습니다.',
    };
  }
};

exports.loginByMobile = async (ctx) => {
  console.log('휴대폰 로그인');
  const { body } = ctx.request;
  console.log(body);
  const validate = Validate.validateLoginByMobile(body);
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
    const { mobile, pw } = body;
    const user = await models.User.loginForMobile(mobile, pw);
    if (!user) {
      console.log(user);
      ctx.status = 404;
      ctx.body = {
        status: 404,
        message: '입력 정보와 일치하는 회원이 존재하지 않습니다.',
      };
      return;
    }
    const login = await Cache.get(user.idx);
    if (login == config.user) {
      ctx.status = 403;
      ctx.body = {
        status: 403,
        message: '이미 로그인된 회원입니다.',
      };
      return;
    }
    Cache.put(user.idx, config.user);
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: '로그인에 성공하였습니다.',
      data: user
    };
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '로그인에 실패하였습니다.',
    };
  }
};

exports.logout = async (ctx) => {
  console.log('로그아웃');
  try {
    const { _idx } = ctx.params;
    console.log(_idx);
    const user = await models.User.findByPk(_idx);
    if (!user) {
      console.log(user);
      ctx.status = 404;
      ctx.body = {
        status: 404,
        message: '존재하지 않는 회원입니다.',
      };
      return;
    }
    const login = await Cache.get(_idx);
    if (login != config.user) {
      ctx.status = 403;
      ctx.body = {
        status: 403,
        message: '로그인하지 않은 회원입니다.',
      };
      return;
    }
    Cache.del(_idx);
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: '로그아웃에 성공하였습니다.',
    };
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '로그인에 실패하였습니다.',
    };
  }
};

exports.changePassword = async (ctx) => {
  console.log('비밀번호 재설정');
  const { body } = ctx.request;
  console.log(body);
  const validate = Validate.validateLoginByMobile(body);
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
    const { mobile, pw } = body;
    const user = await models.User.findByMobile(mobile);
    if (!user) {
      ctx.satuts = 404;
      ctx.body = {
        status: 404,
        message: '존재하지 않는 회원입니다.',
      };
      return;
    }
    const verified = await Cache.get(mobile);
    if (verified != config.auth) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: '전화번호 인증을 진행해 주세요.',
      };
      return;
    }
    await models.User.changePassword(user.idx, pw);
    Cache.del(mobile);
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: '회원 수정에 성공하였습니다.',
    };
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '회원 수정에 실패하였습니다.',
    };
  }
};

exports.searchAll = async (ctx) => {
  console.log('회원 전체 조회');
  try {
    const users = await models.User.findAllUsers();
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: '회원 전체 조회에 성공하였습니다.',
      data: users,
    };
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '회원 전체 조회에 실패하였습니다.',
    };
  }
};

exports.search = async (ctx) => {
  console.log('회원 조회');
  const { _idx } = ctx.params;
  console.log(_idx);
  try {
    const user = await models.User.findByPk(_idx);
    console.log(user);
    if (!user) {
      ctx.status = 404;
      ctx.body = {
        status: 404,
        message: '존재하지 않는 회원입니다.',
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        status: 200,
        message: '회원 조회에 성공하였습니다.',
        data: user,
      };
    }
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '회원 조회에 실패하였습니다.',
    };
  }
}

exports.remove = async (ctx) => {
  console.log('회원 탈퇴');
  const { _idx } = ctx.params;
  console.log(_idx);
  try {
    const user = await models.User.findByPk(_idx);
    console.log(user);
    if (!user) {
      ctx.status = 404;
      ctx.body = {
        status: 404,
        message: '존재하지 않는 회원입니다.',
      };
    } else {
      await models.User.removeUser(_idx);
      Cache.del(_idx);
      ctx.status = 200;
      ctx.body = {
        status: 200,
        message: '회원 탈퇴에 성공하였습니다.',
      };
    }
  } catch (error) {
    console.log(error.message);
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '회원 탈퇴에 실패하였습니다.',
    };
  }
};