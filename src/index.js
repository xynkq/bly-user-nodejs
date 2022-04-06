require('dotenv').config();

const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');
const Body = require('koa-body')({ multipart: true });
const Http = require('http');
const api = require('./api');

const { PORT: port } = process.env;

const app = new Koa();
const router = new Router();
const server = Http.createServer(app.callback());

router.use(api.routes());

app.use(router.allowedMethods());
app.use(cors());
app.use(Body);
app.use(router.routes());

server.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});

module.exports = server;