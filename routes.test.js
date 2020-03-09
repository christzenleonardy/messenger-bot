const request = require('supertest');
var server = require('./index.js');

describe('test index', function() {
  it('should always return true', async () => {
    const res = await request(server)
      .get('/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(200);
    expect(res.body.values).toEqual('Hello from the Node JS RESTful side!');
    expect(Array.isArray(res.body.values)).toBe(false);
  });
});

describe('testing verifyWebhook', function() {
  it('should accept challenge if mode === subscribe and token === verification_token', async () => {
    const res = await request(server)
      .get('/webhook?hub.verify_token=interview-messenger-bot' +
        '&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe');
    expect(res.status).toEqual(200);
    expect(res.text).toBe('CHALLENGE_ACCEPTED');
  });

  it('should not accept if mode !== subscribe or token !== verification_token', async () => {
    const res = await request(server)
      .get('/webhook?hub.verify_token=hello-bot' +
        '&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=not-subscribe');
    expect(res.status).toEqual(403);
  });

  it('should not accept if mode is empty or token is empty', async () => {
    const res = await request(server)
      .get('/webhook?hub.challenge=CHALLENGE_ACCEPTED');
    expect(res.status).toEqual(403);
  });
});

describe('handleWebhookEvent', function() {
  it('should receive event if object === page', async () => {
    const data = {
      "object": "page",
      "entry": [{
        "messaging": [{
          "sender": {
            "id": "4205658219460506"
          },
          "message": "TEST_MESSAGE"
        }]
      }]
    };
    const res = await request(server)
      .post('/webhook')
      .send(data);
    expect(res.status).toEqual(200);
    expect(res.text).toBe('EVENT_RECEIVED');
  });

  it('should return not found if object !== page', async () => {
    const data = {
      "object": "not page",
      "entry": [{
        "messaging": [{
          "sender": {
            "id": "4205658219460506"
          },
          "message": "TEST_MESSAGE"
        }]
      }]
    };
    const res = await request(server)
      .post('/webhook')
      .send(data);
    expect(res.status).toEqual(404);
  });
});

describe('all messages endpoint', function () {
  it('should create a new get', async () => {
    const res = await request(server)
      .get('/messages');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(200);
    expect(Array.isArray(res.body.values)).toBe(true);
    expect(res.body.values[0]).toHaveProperty('message_id');
    expect(res.body.values[0]).toHaveProperty('timestamp');
    expect(res.body.values[0]).toHaveProperty('content');
  });
});

describe('all messages per user endpoint', function () {
  it('should create a new get', async () => {
    const res = await request(server)
      .get('/user/messages?user_id=4205658219460506');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(200);
    expect(Array.isArray(res.body.values)).toBe(true);
    expect(res.body.values[0]).toHaveProperty('message_id');
    expect(res.body.values[0]).toHaveProperty('timestamp');
    expect(res.body.values[0]).toHaveProperty('content');
  });

  it('should return not found', async () => {
    const res = await request(server)
      .get('/user/messages?user_id=0');
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(404);
  });

  it('should return require user_id', async () => {
    const res = await request(server)
      .get('/user/messages');
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(400);
  });
});

describe('get message by id endpoint', function () {
  it('should create a new get', async () => {
    const res = await request(server)
      .get('/message?message_id=1');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(200);
    expect(Array.isArray(res.body.values)).toBe(false);
    expect(res.body.values).toHaveProperty('message_id');
    expect(res.body.values).toHaveProperty('user_id');
    expect(res.body.values).toHaveProperty('timestamp');
    expect(res.body.values).toHaveProperty('content');
  });

  it('should return not found', async () => {
    const res = await request(server)
      .get('/message?message_id=0');
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(404);
  });

  it('should return require message_id', async () => {
    const res = await request(server)
      .get('/message');
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(400);
  });
});

describe('get message by id endpoint', function () {
  it('should return not found', async () => {
    const res = await request(server)
      .delete('/message')
      .send({ message_id: '0'});
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(404);
  });

  it('should return require message_id', async () => {
    const res = await request(server)
      .delete('/message');
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(400);
  });
});