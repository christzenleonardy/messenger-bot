'use strict';

const request = require('request');
const moment = require('moment');
const model = require('./model');
const response = require('./res');

const INTERNAL_ERROR = 'Internal Server Error';

function index(req, res) {
  response.ok('Hello from the Node JS RESTful side!', res);
};

async function getAllMessages(req, res) {
  try {
    const data = await model.getAllMessages();
    response.ok(data, res);
  } catch (err) {
    response.fail(INTERNAL_ERROR, res);
  }
};

async function getMessagesPerUser(req, res) {
  const { user_id } = req.query;

  if (user_id) {
    try {
      const data = await model.getMessagesPerUser(user_id);
      if (data.length === 0) {
        response.notFound('user doesn\'t have any messages', res);
      } else {
        response.ok(data, res);
      }
    } catch (err) {
      response.fail(INTERNAL_ERROR, res);
    }
  } else {
    response.badRequest('requires user_id', res);
  }
};

async function getMessage(req, res) {
  const { message_id } = req.query;

  if (message_id) {
    try {
      const data = await model.getMessage(message_id);
      if (!data) {
        response.notFound('message not found', res);
      } else {
        response.ok(data, res);
      }
    } catch (err) {
      response.fail(INTERNAL_ERROR, res);
    }
  } else {
    response.badRequest('requires message_id', res);
  }
};

async function deleteMessage(req, res) {
  const { message_id } = req.body;

  if (message_id) {
    try {
      const data = await model.delMessage(message_id);
      if (data === 0) {
        response.notFound('message not found', res);
      } else {
        response.ok('message successfully deleted', res);
      }
    } catch (err) {
      response.fail(INTERNAL_ERROR, res);
    }
  } else {
    response.badRequest('requires message_id', res);
  }
};

async function getUserData(user_id) {
  return new Promise(async function(resolve, reject) {
    if (user_id) {
      try {
        const data = await model.getUserData(user_id);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    } else {
      reject('requires user_id');
    }
  });
};

async function addNewUser(user_id) {
  return new Promise(async function(resolve, reject) {
    if (user_id) {
      try {
        await model.addUser(user_id);
        console.log(`user ${user_id} successfully added`);
        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      }
    } else {
      console.error('requires user_id');
      reject('requires user_id');
    }
  });
};

async function updateUserName(user_id, name) {
  if (user_id && name) {
    try {
      await model.updateUserName(user_id, name);
      console.log(`user ${user_id}\'s name successfully updated`);
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log('requires user_id and name');
  }
};

async function updateBirthDate(user_id, birth_date) {
  if (user_id && birth_date) {
    try {
      await model.updateBirthDate(user_id, birth_date);
      console.log(`user ${user_id}\'s birth date successfully updated`);
    } catch (err) {
      console.error(err);
    }
  } else {
    console.error('requires user_id and birth_date');
  }
};

async function updateStep(user_id, new_step) {
  if (user_id && new_step) {
    try {
      await model.updateStep(user_id, new_step);
      console.log(`user ${user_id}\'s current step successfully updated`);
    } catch (err) {
      console.error(err);
    }
  } else {
    console.error('requires user_id and curr_step');
  }
};

async function addMessage(user_id, content) {
  return new Promise(async function(resolve, reject) {
    if (user_id && content) {
      try {
        await model.addMessage(user_id, content);
        console.log(`user ${user_id}\'s message successfully added`);
        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      }
    } else {
      console.error('requires user_id and content');
      reject('requires user_id and content');
    }
  });
};

function getDaysBetween(start_date, end_date) {
  const moment_start_date = moment(start_date);
  const date = end_date.toString().split('-');
  const next_birthday = [parseInt(moment_start_date.format('YYYY'), 10), parseInt(date[1], 10) - 1, date[2]];

  if (moment_start_date.isSame(moment(next_birthday))) {
    return 0;
  } else if (moment_start_date.isBefore(moment(next_birthday))) {
    return moment(next_birthday).diff(moment_start_date, 'days');
  } else {
    return moment([next_birthday[0] + 1, next_birthday[1], next_birthday[2]]).diff(moment_start_date, 'days');
  }
};

function getDaysFromNow(end_date) {
  const start_date = moment().format('YYYY-MM-DD');
  return exports.getDaysBetween(start_date, end_date);
};

function verifyWebhook(req, res) {
  let VERIFY_TOKEN = 'interview-messenger-bot';

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

function handleWebhookEvent(req, res) {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;

      if (webhook_event.message) {
        exports.handleMessage(sender_psid, webhook_event.message);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};

async function handleMessage(sender_psid, received_message) {
  let response;

  if (received_message && received_message.text) {
    try {
      const user_data = await exports.getUserData(sender_psid);
      if (user_data) {
        switch (user_data.curr_step) {
          case 1:
            exports.updateUserName(sender_psid, received_message.text);
            response = {
              text: 'What a wonderful name! When is your birthday? (Answer in YYYY-MM-DD format)',
            };
            break;
          case 2:
            if (moment(received_message.text.toString()).isValid()){
              exports.updateBirthDate(sender_psid, received_message.text);
              response = {
                text: 'Do you want to know how many days until your next birthday?',
              };
            } else {
              response = {
                text: 'Please input your birthday with the following format. (Answer in YYYY-MM-DD format)',
              };
            }
            break;
          case 3:
            exports.updateStep(sender_psid, 5);
            const { sentiment } = received_message.nlp.entities;
            const yes_choice = sentiment[0].value === 'positive' ||
              (sentiment[0].value !== 'negative' && sentiment[1].value === 'positive');
            if (yes_choice) {
              const days = exports.getDaysFromNow(user_data.birth_date);
              if (days === 0) {
                response = {
                  text: `There are ${days} days left until your next birthday.` +
                    `Wow, today is your birthday! Happy Birthday, ${user_data.name}!`,
                };
              } else {
                response = {
                  text: `There are ${days} days left until your next birthday`,
                };
              }
            } else {
              response = {
                text: 'Goodbye',
              };
            }
            break;
          case 4:
            switch (received_message.text) {
              case 'update':
                exports.updateStep(sender_psid, 1);
                response = {
                  text: 'May I know your new name?',
                };
                break;
              case 'count':
                exports.updateStep(sender_psid, 3);
                response = {
                  text: 'Do you want to know how many days until your next birthday?',
                };
                break;
              default:
                exports.updateStep(sender_psid, 5);
                response = {
                  text: 'See you around',
                };
            }
            break;
          default:
            exports.updateStep(sender_psid, 4);
            response = {
              text: `Hi, ${user_data.name}! Anything I can help? (You can update your data by sending 'update'` +
                'or know how many days until your birthday by sending \'count\')',
            };
        }
      } else {
        response = {
          text: 'Hi! Looks like you\'re new. May I know your name?',
        };
        exports.addNewUser(sender_psid);
      }
    } catch (err) {
      console.error(err);
      response = {
        text: 'Oops, sorry. Can you message me again some time later?',
      };
    }

    await exports.addMessage(sender_psid, received_message.text);
    return await exports.callSendAPI(sender_psid, response);
  }
}

async function callSendAPI(sender_psid, response) {
  return new Promise(function(resolve, reject) {
    let request_body = {
      recipient: {
        id: sender_psid,
      },
      message: response,
    };

    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: request_body,
    }, (err, res, body) => {
      if (!err) {
        console.log('Message sent!');
        resolve();
      } else {
        console.error('Unable to send message: ' + err);
        reject();
      }
    });
  });
};

module.exports.index = index;
module.exports.getAllMessages = getAllMessages;
module.exports.getMessagesPerUser = getMessagesPerUser;
module.exports.getMessage = getMessage;
module.exports.deleteMessage = deleteMessage;
module.exports.getUserData = getUserData;
module.exports.addNewUser = addNewUser;
module.exports.updateUserName = updateUserName;
module.exports.updateBirthDate = updateBirthDate;
module.exports.updateStep = updateStep;
module.exports.addMessage = addMessage;
module.exports.getDaysBetween = getDaysBetween;
module.exports.getDaysFromNow = getDaysFromNow;
module.exports.verifyWebhook = verifyWebhook;
module.exports.handleWebhookEvent = handleWebhookEvent;
module.exports.handleMessage = handleMessage;
module.exports.callSendAPI = callSendAPI;
