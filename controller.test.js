const moment = require('moment');

const getUserData = require('./controller.js').getUserData;
const addNewUser = require('./controller.js').addNewUser;
const updateUserName = require('./controller.js').updateUserName;
const updateBirthDate = require('./controller.js').updateBirthDate;
const updateStep = require('./controller.js').updateStep;
const addMessage = require('./controller.js').addMessage;
const getDaysBetween = require('./controller.js').getDaysBetween;
const verifyWebhook = require('./controller.js').verifyWebhook;
const handleWebhookEvent = require('./controller.js').handleWebhookEvent;
const handleMessage = require('./controller.js').handleMessage;
const callSendAPI = require('./controller.js').callSendAPI;

describe('getUserData', function() {
  it('should exist', function() {
    expect(getUserData).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof getUserData).toBe('function');
  });

  it('should create a resolved promise', async function() {
    const user_id = '4205658219460506';
    const res = await getUserData(user_id);
    expect(Array.isArray(res)).toBe(false);
    expect(res).toHaveProperty('user_id');
    expect(res).toHaveProperty('name');
    expect(res).toHaveProperty('birth_date');
    expect(res).toHaveProperty('curr_step');
  });

  it('should create a resolved promise', async function() {
    const user_id = '0';
    await expect(getUserData(user_id)).resolves.toBe(undefined);
  });

  it('should create a rejected promise', async function() {
    return expect(getUserData()).rejects.toMatch('requires user_id');
  });
});

describe('addNewUser', function() {
  it('should exist', function() {
    expect(addNewUser).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof addNewUser).toBe('function');
  });
});

describe('updateUserName', function() {
  it('should exist', function() {
    expect(updateUserName).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof updateUserName).toBe('function');
  });
});

describe('updateBirthDate', function() {
  it('should exist', function() {
    expect(updateBirthDate).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof updateBirthDate).toBe('function');
  });
});

describe('updateStep', function() {
  it('should exist', function() {
    expect(updateStep).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof updateStep).toBe('function');
  });
});

describe('addMessage', function() {
  it('should exist', function() {
    expect(addMessage).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof addMessage).toBe('function');
  });
});

describe('getDaysBetween', function() {
  it('should exist', function() {
    expect(getDaysBetween).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof getDaysBetween).toBe('function');
  });

  it('should return zero', function() {
    const end_date = moment().format('YYYY-MM-DD');
    expect(getDaysBetween(end_date)).toBe(0);
  });

  it('should return 1', function() {
    const end_date = moment().add(1, 'days').format('YYYY-MM-DD');
    expect(getDaysBetween(end_date)).toBe(1);
  });

  it('should return 5', function() {
    const end_date = moment().add(5, 'days').format('YYYY-MM-DD');
    expect(getDaysBetween(end_date)).toBe(5);
  });
});

describe('verifyWebhook', function() {
  it('should exist', function() {
    expect(verifyWebhook).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof verifyWebhook).toBe('function');
  });
});

describe('handleWebhookEvent', function() {
  it('should exist', function() {
    expect(handleWebhookEvent).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof handleWebhookEvent).toBe('function');
  });
});

describe('handleMessage', function() {
  it('should exist', function() {
    expect(handleMessage).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof handleMessage).toBe('function');
  });
});

describe('callSendAPI', function() {
  it('should exist', function() {
    expect(callSendAPI).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof callSendAPI).toBe('function');
  });
});
