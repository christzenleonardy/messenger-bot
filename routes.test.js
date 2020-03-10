const request = require('supertest');
const server = require('./index.js');
const controller = require('./controller.js');
const model = require('./model.js');

const INTERNAL_ERROR = 'Internal Server Error';

const mockedGetAllMessages = jest.spyOn(model, 'getAllMessages');
const mockedGetMessagesPerUser = jest.spyOn(model, 'getMessagesPerUser');
const mockedGetMessage = jest.spyOn(model, 'getMessage');
const mockedDeleteMessage = jest.spyOn(model, 'delMessage');
const mockedHandleMessage = jest.spyOn(controller, 'handleMessage');

jest.mock('./conn');

describe('test index', function() {
  it('should always return true', async () => {
    expect.assertions(6);
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
    expect.assertions(2);
    const res = await request(server)
      .get('/webhook?hub.verify_token=interview-messenger-bot' +
        '&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe');

    expect(res.status).toEqual(200);
    expect(res.text).toBe('CHALLENGE_ACCEPTED');
  });

  it('should not accept if mode !== subscribe or token !== verification_token', async () => {
    expect.assertions(1);
    const res = await request(server)
      .get('/webhook?hub.verify_token=hello-bot' +
        '&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=not-subscribe');

    expect(res.status).toEqual(403);
  });

  it('should not accept if mode is empty or token is empty', async () => {
    expect.assertions(1);
    const res = await request(server)
      .get('/webhook?hub.challenge=CHALLENGE_ACCEPTED');

    expect(res.status).toEqual(403);
  });
});

describe('handleWebhookEvent', function() {
  beforeEach(() => {
    mockedHandleMessage.mockReset();
  })

  it('should receive event and call handle message if object === page and message exists', async () => {
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

    expect.assertions(3);
    const res = await request(server)
      .post('/webhook')
      .send(data);

    expect(res.status).toEqual(200);
    expect(res.text).toBe('EVENT_RECEIVED');
    expect(mockedHandleMessage).toBeCalled();
  });

  it('should receive event but not call handle message if object === page and message doesn\'t exist', async () => {
    const data = {
      "object": "page",
      "entry": [{
        "messaging": [{
          "sender": {
            "id": "4205658219460506"
          }
        }]
      }]
    };

    expect.assertions(3);
    const res = await request(server)
      .post('/webhook')
      .send(data);

    expect(res.status).toEqual(200);
    expect(res.text).toBe('EVENT_RECEIVED');
    expect(mockedHandleMessage).not.toBeCalled();
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

    expect.assertions(2);
    const res = await request(server)
      .post('/webhook')
      .send(data);

    expect(res.status).toEqual(404);
    expect(mockedHandleMessage).not.toBeCalled();
  });
});

describe('all messages endpoint', function () {
  beforeEach(() => {
    mockedGetAllMessages.mockReset();
  });

  it('should return all messages', async () => {
    mockedGetAllMessages.mockResolvedValue([
      {
        message_id: 1,
        user_id: "4205658219460506",
        timestamp: "2020-03-07T17:16:43.000Z",
        content: "Hi"
      }, {
        message_id: 2,
        user_id: "4205658219460506",
        timestamp: "2020-03-07T17:16:48.000Z",
        content: "Zen"
      }
    ]);

    expect.assertions(9);
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
    expect(mockedGetAllMessages).toBeCalled();
  });

  it('should return internal server error', async () => {
    mockedGetAllMessages.mockRejectedValue(INTERNAL_ERROR);

    expect.assertions(6);
    const res = await request(server)
      .get('/messages');

    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(500);
    expect(res.body.values).toEqual(INTERNAL_ERROR);
    expect(Array.isArray(res.body.values)).toBe(false);
  });
});

describe('all messages per user endpoint', function () {
  beforeEach(() => {
    mockedGetMessagesPerUser.mockReset();
  });

  it('should create a new get', async () => {
    mockedGetMessagesPerUser.mockResolvedValue([
      {
        message_id: 1,
        user_id: "4205658219460506",
        timestamp: "2020-03-07T17:16:43.000Z",
        content: "Hi"
      }, {
        message_id: 2,
        user_id: "4205658219460506",
        timestamp: "2020-03-07T17:16:48.000Z",
        content: "Zen"
      }
    ]);

    expect.assertions(8);
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
    mockedGetMessagesPerUser.mockResolvedValue([]);

    expect.assertions(4);
    const res = await request(server)
      .get('/user/messages?user_id=0');

    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(404);
  });

  it('should return require user_id', async () => {
    expect.assertions(4);
    const res = await request(server)
      .get('/user/messages');

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(400);
  });

  it('should return internal server error', async () => {
    mockedGetMessagesPerUser.mockRejectedValue(INTERNAL_ERROR);

    expect.assertions(5);
    const res = await request(server)
      .get('/user/messages?user_id=0');

    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(500);
    expect(res.body.values).toEqual(INTERNAL_ERROR);
  });
});

describe('get message by id endpoint', function () {
  beforeEach(() => {
    mockedGetMessage.mockReset();
  });

  it('should create a new get', async () => {
    mockedGetMessage.mockResolvedValue({
      message_id: 1,
      user_id: "4205658219460506",
      timestamp: "2020-03-07T17:17:05.000Z",
      content: "Hi"
    });

    expect.assertions(9);
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
    mockedGetMessage.mockResolvedValue();

    expect.assertions(4);
    const res = await request(server)
      .get('/message?message_id=0');

    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(404);
  });

  it('should return require message_id', async () => {
    expect.assertions(4);
    const res = await request(server)
      .get('/message');

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(400);
  });

  it('should return internal server error', async () => {
    mockedGetMessage.mockRejectedValue(INTERNAL_ERROR);

    expect.assertions(5);
    const res = await request(server)
      .get('/message?message_id=0');

    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(500);
    expect(res.body.values).toEqual(INTERNAL_ERROR);
  });
});

describe('get message by id endpoint', function () {
  beforeEach(() => {
    mockedDeleteMessage.mockReset();
  });

  it('should return success', async () => {
    mockedDeleteMessage.mockResolvedValue(1);

    expect.assertions(5);
    const res = await request(server)
      .delete('/message')
      .send({ message_id: '1'});

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(200);
    expect(res.body.values).toEqual('message successfully deleted');
  });

  it('should return not found', async () => {
    mockedDeleteMessage.mockResolvedValue(0);

    expect.assertions(5);
    const res = await request(server)
      .delete('/message')
      .send({ message_id: '0'});

    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(404);
    expect(res.body.values).toEqual('message not found');
  });

  it('should return require message_id', async () => {
    mockedDeleteMessage.mockRejectedValue(INTERNAL_ERROR);

    expect.assertions(5);
    const res = await request(server)
      .delete('/message');

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(400);
    expect(res.body.values).toEqual('requires message_id');
  });

  it('should return internal server error', async () => {
    mockedDeleteMessage.mockRejectedValue(INTERNAL_ERROR);

    expect.assertions(5);
    const res = await request(server)
      .delete('/message')
      .send({ message_id: '1'});

    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('values');
    expect(res.body.status).toEqual(500);
    expect(res.body.values).toEqual(INTERNAL_ERROR);
  });
});