const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    port: config.port,
    timezone: 'Asia/Seoul',
    dialectOptions: {
			timezone: "local",
		},
  },
);

const models = {};

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    models[model.name] = model;
  });

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
    console.log(modelName);
  }
});

sequelize.sync().then(() => {
  console.log('Schema is synchronized');
}).catch((err) => {
  console.log('An error has occurred: ', err);
});

console.log(models.User);

models.sequelize = sequelize;
models.Sequelize = sequelize;

module.exports = models;