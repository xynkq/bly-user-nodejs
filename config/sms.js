require('dotenv').config();
const env = process.env;

module.exports = {
  serviceId: env.SMS_SERVICE_ID,
  accessKey: env.SMS_ACCESS_KEY,
  secretKey: env.SMS_SECRET_KEY,
}