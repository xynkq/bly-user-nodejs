require('dotenv').config();
const env = process.env;

module.exports = {
  user: env.CACHE_USER,
  auth: env.CACHE_AUTH,
}