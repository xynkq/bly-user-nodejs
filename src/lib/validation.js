const Joi = require('joi');

exports.validateUser = (body) => {
  const schema = Joi.object().keys({
    email: Joi.string().required().email().max(320),
    mobile: Joi.string().required().length(11).pattern(/^[0-9]+$/),
    pw: Joi.string().required().min(8).max(20),
    name: Joi.string().required().min(2).max(20),
    nickname: Joi.string().required().min(2).max(20),
  });
  try {
    return schema.validate(body);
  } catch (error) {
    throw error;
  }
};

exports.validateLoginByEmail = (body) => {
  const schema = Joi.object().keys({
    email: Joi.string().required().email(),
    pw: Joi.string().required().min(8).max(20),
  });
  try {
    return schema.validate(body);
  } catch (error) {
    throw error;
  }
};

exports.validateLoginByMobile = (body) => {
  const schema = Joi.object().keys({
    mobile: Joi.string().required().length(11).pattern(/^[0-9]+$/),
    pw: Joi.string().required().min(8).max(20),
  });
  try {
    return schema.validate(body);
  } catch (error) {
    throw error;
  }
};

exports.validateVerifyCode = (body) => {
  const schema = Joi.object().keys({
    mobile: Joi.string().required().length(11).pattern(/^[0-9]+$/),
    code: Joi.number().integer().required(),
  });
  try {
    return schema.validate(body);
  } catch (error) {
    throw error;
  }
};

exports.validateCreateCode = (body) => {
  const schema = Joi.object().keys({
    mobile: Joi.string().required().length(11).pattern(/^[0-9]+$/),
  });
  try {
    return schema.validate(body);
  } catch (error) {
    throw error;
  }
};
