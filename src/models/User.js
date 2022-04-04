const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      field: 'email',
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      field: 'mobile',
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    pw: {
      field: 'pw',
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      field: 'name',
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nickname: {
      field: 'nickname',
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    created: {
      field: 'created',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated: {
      field: 'updated',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user',
    timestamps: false,
  });

  User.findAllForCheck = (email, mobile) => User.findOne({ // 회원 가입 시 중복 데이터 확인
    attributes: ['idx', 'email', 'pw', 'name', 'nickname', 'mobile'],
    where: {
      [Op.or]: [
        { email },
        { mobile },
      ]
    },
    raw: true,
  });

  User.loginForEamil = (email, pw) => User.findOne({
    attributes: ['idx', 'email', 'pw', 'name', 'nickname', 'mobile'],
    where: {
      email,
      pw,
    },
    raw: true,
  });

  User.loginForMobile = (mobile, pw) => User.findOne({
    attributes: ['idx', 'email', 'pw', 'name', 'nickname', 'mobile'],
    where: {
      mobile,
      pw,
    },
    raw: true,
  });

  User.findByMobile = (mobile) => User.findOne({
    attributes: ['idx', 'email', 'pw', 'name', 'nickname', 'mobile'],
    where: { mobile },
    raw: true,
  });

  User.changePassword = (idx, pw) => User.update({
    pw,
    updated: sequelize.literal('CURRENT_TIMESTAMP'),
  }, {
    where: {
      idx,
    },
  });

  User.findAllUsers = () => User.findAll({
    attributes: ['idx', 'email', 'pw', 'name', 'nickname', 'mobile'],
    order: [
      ['idx', 'ASC'],
    ],
    nest: true,
    raw: true,
  });

  User.removeUser = (idx) => User.destroy({
    where: {
      idx,
    },
  });

  return User;
};