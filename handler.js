const crypto = require('crypto');

function signRequestBody(key, body) {
  return `sha1=${crypto.createHmac('sha1', key).update(body, 'utf-8').digest('hex')}`;
}

module.exports.merakiWebhookListener = (event, context, callback) => {
  var errMsg; // eslint-disable-line
  const token = process.env.MERAKI_WEBHOOK_SECRET;
  const headers = event.headers;
  const sig = headers['X-Hub-Signature'];
  const merakiEvent = headers['X-meraki-Event'];
  const id = headers['X-meraki-Delivery'];
  const calculatedSig = signRequestBody(token, event.body);

  if (typeof token !== 'string') {
    errMsg = 'Must provide a \'MERAKI_WEBHOOK_SECRET\' env variable';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  if (!sig) {
    errMsg = 'No X-Meraki-Signature found on request';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  if (!merakiEvent) {
    errMsg = 'No X-Meraki-Event found on request';
    return callback(null, {
      statusCode: 422,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  if (!id) {
    errMsg = 'No X-Meraki-Delivery found on request';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  if (sig !== calculatedSig) {
    errMsg = 'X-Meraki-Signature incorrect. Meraki webhook token doesn\'t match';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  /* eslint-disable */
  console.log('---------------------------------');
  console.log(`Meraki-Event: "${merakiEvent}" with action: "${event.body.action}"`);
  console.log('---------------------------------');
  console.log('Payload', event.body);
  /* eslint-enable */

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  };

  return callback(null, response);
};
