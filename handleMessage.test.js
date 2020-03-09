var controller = require('./controller.js');

const mockedGetUserData = jest.spyOn(controller, 'getUserData');
const mockedUpdateUserName = jest.spyOn(controller, 'updateUserName');
const mockedUpdateBirthDate = jest.spyOn(controller, 'updateBirthDate');
const mockedUpdateStep = jest.spyOn(controller, 'updateStep');
const mockedAddNewUser = jest.spyOn(controller, 'addNewUser');
const mockedAddMessage = jest.spyOn(controller, 'addMessage');
const mockedCallSendAPI = jest.spyOn(controller, 'callSendAPI');
const mockedGetDaysBetween = jest.spyOn(controller, 'getDaysBetween');

const sampleSenderId = '101';
const sampleText = 'TEST_MESSAGE';
const sampleName = 'first_name';
const sampleBirthDate = '2000-03-10';
const sampleWrongBirthDate = '1999-02-30';

describe('testing chat flow', function() {
  beforeEach(() => {
    mockedGetUserData.mockReset();
    mockedUpdateUserName.mockReset();
    mockedUpdateBirthDate.mockReset();
    mockedUpdateStep.mockReset();
    mockedAddNewUser.mockReset();
    mockedAddMessage.mockReset();
    mockedCallSendAPI.mockReset();
    mockedGetDaysBetween.mockReset();
  });

  it('process message is null', async () => {
    mockedGetUserData.mockResolvedValue();
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = null;

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).not.toBeCalled();
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).not.toBeCalled();
    expect(mockedCallSendAPI).not.toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
  });

  it('process message.text is null', async () => {
    mockedGetUserData.mockResolvedValue();
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: null };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).not.toBeCalled();
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).not.toBeCalled();
    expect(mockedCallSendAPI).not.toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
  });

  it('process send api failed', async () => {
    mockedGetUserData.mockResolvedValue();
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockRejectedValue();
    mockedGetDaysBetween.mockResolvedValue(0);

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
    expect(mockedGetDaysBetween).not.toBeCalled();
  });

  it('process new user', async () => {
    mockedGetUserData.mockResolvedValue();
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleText };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
  });

  it('process user step 1: update name', async () => {
    mockedGetUserData.mockResolvedValue({ user_id: sampleSenderId, curr_step: 1 });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleName };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
  });

  it('process user step 2: invalid birth date', async () => {
    mockedGetUserData.mockResolvedValue({ user_id: sampleSenderId, name: sampleName, curr_step: 2 });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleWrongBirthDate };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
  });

  it('process user step 2: valid birth date', async () => {
    mockedGetUserData.mockResolvedValue({ user_id: sampleSenderId, name: sampleName, curr_step: 2 });
    mockedUpdateUserName.mockResolvedValue();
    mockedUpdateBirthDate.mockResolvedValue();
    mockedUpdateStep.mockResolvedValue();
    mockedAddNewUser.mockResolvedValue();
    mockedAddMessage.mockResolvedValue({});
    mockedCallSendAPI.mockResolvedValue();
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: sampleBirthDate };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).toBeCalledWith(sampleSenderId, sampleBirthDate);
    expect(mockedUpdateStep).not.toBeCalled();
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
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
    mockedGetDaysBetween.mockResolvedValue(0);

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

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).toBeCalledWith(sampleBirthDate);
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
    mockedGetDaysBetween.mockResolvedValue(0);

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

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalledWith();
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
    mockedGetDaysBetween.mockResolvedValue(0);

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

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).toBeCalledWith(sampleBirthDate);
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
    mockedGetDaysBetween.mockResolvedValue(0);

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

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
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
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: 'update' };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 1);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
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
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: 'count' };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 3);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
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
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: 'nevermind' };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 5);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
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
    mockedGetDaysBetween.mockResolvedValue(0);

    const sender_psid = sampleSenderId;
    const message = { text: 'Hi' };

    await controller.handleMessage(sender_psid, message);

    expect.assertions(8);
    expect(mockedGetUserData).toBeCalledWith(sampleSenderId);
    expect(mockedUpdateUserName).not.toBeCalled();
    expect(mockedUpdateBirthDate).not.toBeCalled();
    expect(mockedUpdateStep).toBeCalledWith(sampleSenderId, 4);
    expect(mockedAddNewUser).not.toBeCalled();
    expect(mockedAddMessage).toBeCalled();
    expect(mockedCallSendAPI).toBeCalled();
    expect(mockedGetDaysBetween).not.toBeCalled();
  });
});