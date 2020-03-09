const moment = require('moment');
const model = require('./model.js');
const controller = require('./controller.js');

const sampleSenderId = '101';
const sampleText = 'TEST_MESSAGE';
const sampleName = 'first_name';
const sampleUpcomingBirthDate = '2000-03-10';
const samplePastBirthDate = '2000-02-22';
const sampleCurrDate = '2020-03-01';

const mockedGetUserData = jest.spyOn(model, 'getUserData');
const mockedAddNewUser = jest.spyOn(model, 'addUser');
const mockedUpdateUserName = jest.spyOn(model, 'updateUserName');
const mockedUpdateBirthDate = jest.spyOn(model, 'updateBirthDate');
const mockedUpdateStep = jest.spyOn(model, 'updateStep');
const mockedAddMessage = jest.spyOn(model, 'addMessage');

jest.mock('request', () => {
  return function(options, callback) {
    if (options.json.message) {
      callback(null, 'dummy data');
    } else {
      callback('err');
    }
  }
});

describe('testing controller', function() {
  beforeEach(() => {
    mockedGetUserData.mockReset();
  })

  it('success getting user data', async function() {
    mockedGetUserData.mockResolvedValue({
      name: 'first_name',
      birth_date: '2000-03-10',
      curr_step: 1
    });

    expect.assertions(1);
    await controller.getUserData(sampleSenderId);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
  });

  it('failed getting user data because missing user_id', async function() {
    expect.assertions(2);
    try {
      await controller.getUserData();
    } catch (e) {
      expect(e).toEqual('requires user_id');
    }

    expect(mockedGetUserData).not.toBeCalled();
  });

  it('failed getting user data because missing user_id', async function() {
    mockedGetUserData.mockRejectedValue('err');

    expect.assertions(2);
    try {
      await controller.getUserData(sampleSenderId);
    } catch (e) {
      expect(e).toEqual('err');
    }

    expect(mockedGetUserData).toBeCalled();
  });
});

describe('addNewUser', function() {
  beforeEach(() => {
    mockedAddNewUser.mockReset();
  });

  it('should add new user with id', function() {
    mockedAddNewUser.mockResolvedValue();

    controller.addNewUser(sampleSenderId);

    expect(mockedGetUserData).toBeCalled();
  });

  it('should not add new user without id', async function() {
    expect.assertions(2);
    try {
      await controller.addNewUser();
    } catch (e) {
      expect(e).toEqual('requires user_id');
    }

    expect(mockedAddNewUser).not.toBeCalled();
  });

  it('should not add new user without id', async function() {
    mockedAddNewUser.mockRejectedValue('err');

    expect.assertions(2);
    try {
      await controller.addNewUser(sampleSenderId);
    } catch (e) {
      expect(e).toEqual('err');
    }

    expect(mockedAddNewUser).toBeCalled();
  });
});

describe('updateUserName', function() {
  beforeEach(() => {
    mockedUpdateUserName.mockReset();
  });

  it('should update name', function() {
    mockedUpdateUserName.mockResolvedValue();

    controller.updateUserName(sampleSenderId, sampleName);

    expect(mockedUpdateUserName).toBeCalled();
  });

  it('should return err', function() {
    mockedUpdateUserName.mockRejectedValue('err');

    controller.updateUserName(sampleSenderId, sampleName);

    expect(mockedUpdateUserName).toBeCalled();
  });

  it('should not update name without user_id or name', function() {
    controller.updateUserName();

    expect(mockedUpdateUserName).not.toBeCalled();
  });
});

describe('updateBirthDate', function() {
  beforeEach(() => {
    mockedUpdateBirthDate.mockReset();
  });

  it('should update birth date', function() {
    mockedUpdateBirthDate.mockResolvedValue();

    controller.updateBirthDate(sampleSenderId, samplePastBirthDate);

    expect(mockedUpdateBirthDate).toBeCalled();
  });

  it('should return err', function() {
    mockedUpdateBirthDate.mockRejectedValue('err');

    controller.updateBirthDate(sampleSenderId, samplePastBirthDate);

    expect(mockedUpdateBirthDate).toBeCalled();
  });

  it('should not update name without user_id or birth_date', function() {
    controller.updateBirthDate();

    expect(mockedUpdateBirthDate).not.toBeCalled();
  });
});

describe('updateStep', function() {
  beforeEach(() => {
    mockedUpdateStep.mockReset();
  });

  it('should update step', function() {
    mockedUpdateStep.mockResolvedValue();

    controller.updateStep(sampleSenderId, 1);

    expect(mockedUpdateStep).toBeCalled();
  });

  it('should return err', function() {
    mockedUpdateStep.mockRejectedValue('err');

    controller.updateStep(sampleSenderId, 1);

    expect(mockedUpdateStep).toBeCalled();
  });

  it('should not update name without user_id or step', function() {
    controller.updateStep();

    expect(mockedUpdateStep).not.toBeCalled();
  });
});

describe('addMessage', function() {
  beforeEach(() => {
    mockedAddMessage.mockReset();
  });

  it('should add message', async function() {
    mockedAddMessage.mockResolvedValue();

    expect.assertions(1);
    await controller.addMessage(sampleSenderId, sampleText);

    expect(mockedAddMessage).toBeCalled();
  });

  it('should return err', async function() {
    mockedAddMessage.mockRejectedValue('err');

    expect.assertions(2);
    try {
      await controller.addMessage(sampleSenderId, sampleText);
    } catch (err) {
      expect(err).toEqual('err');
    }

    expect(mockedAddMessage).toBeCalled();
  });

  it('should not add message without user_id or content', async function() {
    expect.assertions(2);
    try {
      await controller.addMessage();
    } catch (err) {
      expect(err).toEqual('requires user_id and content');
    }

    expect(mockedAddMessage).not.toBeCalled();
  });
});

describe('getDaysBetween', function() {
  it('should return zero', function() {
    expect(controller.getDaysBetween(sampleUpcomingBirthDate, sampleUpcomingBirthDate)).toBe(0);
  });

  it('should return 9', function() {
    expect(controller.getDaysBetween(sampleCurrDate, sampleUpcomingBirthDate)).toBe(9);
  });

  it('should return 358', function() {
    expect(controller.getDaysBetween(sampleCurrDate, samplePastBirthDate)).toBe(358);
  });
});

describe('getDaysFromNow', function() {
  it('should return zero', function() {
    const end_date = moment().format('YYYY-MM-DD');

    expect(controller.getDaysFromNow(end_date)).toBe(0);
  });

  it('should return 9', function() {
    const end_date = moment().add(9, 'days').format('YYYY-MM-DD');

    expect(controller.getDaysFromNow(end_date)).toBe(9);
  });

  it('should return 358', function() {
    const end_date = moment().add(358, 'days').format('YYYY-MM-DD');

    expect(controller.getDaysFromNow(end_date)).toBe(358);
  });
});

describe('callSendAPI', function() {
  it('should resolve', async function() {
    expect.assertions(1);
    await expect(controller.callSendAPI(sampleSenderId, sampleText)).resolves.toEqual();
  });

  it('should return error', async function() {
    expect.assertions(1);
    await expect(controller.callSendAPI(sampleSenderId)).rejects.toEqual();
  });
});
