const moment = require('moment');
const controller = require('./controller.js');

const sampleSenderId = '101';
const sampleText = 'TEST_MESSAGE';
const sampleName = 'first_name';
const sampleBirthDate = '2000-03-10';
const sampleWrongBirthDate = '1999-02-30';

const mockedGetUserData = jest.spyOn(controller, 'getUserData');
const mockedUpdateUserName = jest.spyOn(controller, 'updateUserName');
const mockedUpdateBirthDate = jest.spyOn(controller, 'updateBirthDate');
const mockedUpdateStep = jest.spyOn(controller, 'updateStep');
const mockedAddNewUser = jest.spyOn(controller, 'addNewUser');
const mockedAddMessage = jest.spyOn(controller, 'addMessage');
const mockedCallSendAPI = jest.spyOn(controller, 'callSendAPI');
const mockedgetDaysFromNow = jest.spyOn(controller, 'getDaysFromNow');

jest.mock('./conn.js', () => {});

describe('testing chat flow', function() {
  beforeEach(() => {
    mockedGetUserData.mockReset();
    mockedUpdateUserName.mockReset();
    mockedUpdateBirthDate.mockReset();
    mockedUpdateStep.mockReset();
    mockedAddNewUser.mockReset();
    mockedAddMessage.mockReset();
    mockedCallSendAPI.mockReset();
    mockedgetDaysFromNow.mockReset();
  });

  it('process message is null', async () => {
    mockedGetUserData.mockResolvedValue();
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = null;

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).not.toBeCalled();
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).not.toBeCalled();
    expect(mockedCallSendAPI).not.toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process message.text is null', async () => {
    mockedGetUserData.mockResolvedValue();
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: null };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).not.toBeCalled();
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).not.toBeCalled();
    expect(mockedCallSendAPI).not.toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process send api failed', async () => {
    mockedGetUserData.mockResolvedValue();
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockRejectedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleText };

    expect.assertions(9);
    try {
      await controller.handleMessage(sender_psid, message);
    } catch (e) {
      expect(e).toEqual();
    }

    expect(mockedGetUserData).toBeCalled();
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process new user', async () => {
    mockedGetUserData.mockResolvedValue();
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleText };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process user step 1: update name', async () => {
    mockedGetUserData.mockResolvedValue({ user_id: sampleSenderId, curr_step: 1 });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleName };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process user step 2: invalid birth date', async () => {
    mockedGetUserData.mockResolvedValue({ user_id: sampleSenderId, name: sampleName, curr_step: 2 });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleWrongBirthDate };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process user step 2: valid birth date', async () => {
    mockedGetUserData.mockResolvedValue({ user_id: sampleSenderId, name: sampleName, curr_step: 2 });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleBirthDate };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).toBeCalledWith(sampleSenderId, sampleBirthDate);
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process user step 3: answering yes for next birthday', async () => {
    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: sampleBirthDate,
      curr_step: 3
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(10);

    const sender_psid = sampleSenderId;
    const message = {
      text: 'yes',
      nlp: {
        entities: {
          sentiment: [
            { value: 'positive' },
            { value: 'negative' },
            { value: 'neutral' }
          ]
        }
      }
    };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).toBeCalledWith(sampleBirthDate);
  });

  it('process user step 3: answering yes for next birthday and birthday is today', async () => {
    const curr_date = moment().format('YYYY-MM-DD');

    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: curr_date,
      curr_step: 3
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = {
      text: 'yes',
      nlp: {
        entities: {
          sentiment: [
            { value: 'positive' },
            { value: 'negative' },
            { value: 'neutral' }
          ]
        }
      }
    };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).toBeCalledWith(curr_date);
  });

  it('process user step 3: answering no for next birthday', async () => {
    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: sampleBirthDate,
      curr_step: 3
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = {
      text: 'no',
      nlp: {
        entities: {
          sentiment: [
            { value: 'negative' },
            { value: 'positive' },
            { value: 'neutral' }
          ]
        }
      }
    };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalledWith();
  });

  it('process user step 3: neutral but more of a yes answer for next birthday', async () => {
    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: sampleBirthDate,
      curr_step: 3
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = {
      text: 'neutral',
      nlp: {
        entities: {
          sentiment: [
            { value: 'neutral' },
            { value: 'positive' },
            { value: 'negative' }
          ]
        }
      }
    };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).toBeCalledWith(sampleBirthDate);
  });

  it('process user step 3: neutral but more of a no answer for next birthday', async () => {
    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: sampleBirthDate,
      curr_step: 3
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = {
      text: 'neutral',
      nlp: {
        entities: {
          sentiment: [
            { value: 'neutral' },
            { value: 'negative' },
            { value: 'positive' }
          ]
        }
      }
    };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process user step 4: update data', async () => {
    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: sampleBirthDate,
      curr_step: 4
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: 'update' };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 1);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process user step 4: want to get count till next birthday', async () => {
    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: sampleBirthDate,
      curr_step: 4
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: 'count' };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 3);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process user step 4: not update data or count till next birthday', async () => {
    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: sampleBirthDate,
      curr_step: 4
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: 'nevermind' };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('process user step 5: all required process done', async () => {
    mockedGetUserData.mockResolvedValue({
      user_id: sampleSenderId,
      name: sampleName,
      birth_date: sampleBirthDate,
      curr_step: 5
    });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedgetDaysFromNow.mockReturnValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: 'Hi' };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 4);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });

  it('unexpected error happen', async () => {
    mockedGetUserData.mockRejectedValue('err');

    const sender_psid = sampleSenderId;
    const message = { text: 'Hi' };

    expect.assertions(8);
    await controller.handleMessage(sender_psid, message);

    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedgetDaysFromNow).not.toBeCalled();
  });
});