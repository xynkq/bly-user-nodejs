// const { NCPClient } = require('node-sens');
const config = require('./../../config/sms');
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');

exports.getCode = async (data) => {
  try {
    console.log(data);
    let space = ' ';
    let newLine = '\n';
    let method = 'POST';
    let url = `/sms/v2/services/${config.serviceId}/messages`;
    let timestamp = Date.now().toString();
    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, config.secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(config.accessKey);
    let hash = hmac.finalize();
    return await fetch(`https://sens.apigw.ntruss.com${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': config.accessKey,
        'x-ncp-apigw-signature-v2': hash.toString(CryptoJS.enc.Base64),
      },
      body: data,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}