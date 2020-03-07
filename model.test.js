const getUserData = require('./model.js').getUserData;
const addUser = require('./model.js').addUser;
const updateUserName = require('./model.js').updateUserName;
const updateBirthDate = require('./model.js').updateBirthDate;
const updateStep = require('./model.js').updateStep;
const addMessage = require('./model.js').addMessage;
const getAllMessages = require('./model.js').getAllMessages;
const getMessagesPerUser = require('./model.js').getMessagesPerUser;
const getMessage = require('./model.js').getMessage;
const delMessage = require('./model.js').delMessage;

describe('getUserData', function() {
  it('should exist', function() {
    expect(getUserData).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof getUserData).toBe('function');
  });
});

describe('addUser', function() {
  it('should exist', function() {
    expect(addUser).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof addUser).toBe('function');
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

describe('getAllMessages', function() {
  it('should exist', function() {
    expect(getAllMessages).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof getAllMessages).toBe('function');
  });
});

describe('getMessagesPerUser', function() {
  it('should exist', function() {
    expect(getMessagesPerUser).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof getMessagesPerUser).toBe('function');
  });
});

describe('getMessage', function() {
  it('should exist', function() {
    expect(getMessage).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof getMessage).toBe('function');
  });
});

describe('delMessage', function() {
  it('should exist', function() {
    expect(delMessage).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof delMessage).toBe('function');
  });
});