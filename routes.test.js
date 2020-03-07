const request = require('supertest');
var server;

describe('index', function() {
  beforeEach(function () {
    server = require('./index.js');
  });
  afterEach(function () {
    server.close();
  });

  it('should create a new get', async () => {
    const res = await request(server)
      .get('/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(200);
    expect(Array.isArray(res.body.values)).toBe(false);
  });
});

describe('verifyWebhook', function() {
  beforeEach(function () {
    server = require('./index.js');
  });
  afterEach(function () {
    server.close();
  });

  it('should accept challenge', async () => {
    const res = await request(server)
      .get('/webhook?hub.verify_token=interview-messenger-bot' +
        '&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe');
    expect(res.status).toEqual(200);
    expect(res.text).toBe('CHALLENGE_ACCEPTED');
  });
});

describe('handleWebhookEvent', function() {
  beforeEach(function () {
    server = require('./index.js');
  });
  afterEach(function () {
    server.close();
  });

  it('should receive event', async () => {
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
});

describe('all messages endpoint', function () {
  beforeEach(function () {
    server = require('./index.js');
  });
  afterEach(function () {
    server.close();
  });

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
  beforeEach(function () {
    server = require('./index.js');
  });
  afterEach(function () {
    server.close();
  });

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
  beforeEach(function () {
    server = require('./index.js');
  });
  afterEach(function () {
    server.close();
  });

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
  beforeEach(function () {
    server = require('./index.js');
  });
  afterEach(function () {
    server.close();
  });

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