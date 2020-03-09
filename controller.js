'use strict';

const request = require('request');
const moment = require('moment');
const model = require('./model');

var response = require('./res');
const INTERNAL_ERROR = 'Internal Server Error';

function index(req, res) {
  response.ok('Hello from the Node JS RESTful side!', res);
};

function getAllMessages(req, res) {
  model.getAllMessages((err, data) => {
    if (err) {
      response.fail(INTERNAL_ERROR, res);
    } else {
      response.ok(data, res);
    }
  });
};

function getMessagesPerUser(req, res) {
  const { user_id } = req.query;

  if (user_id) {
    model.getMessagesPerUser(user_id, (err, data) => {
      if (err) {
        response.fail(INTERNAL_ERROR, res);
      } else if (data.length === 0) {
        response.notFound('user doesn\'t have any messages', res);
      } else {
        response.ok(data, res);
      }
    });
  } else {
    response.badRequest('requires user_id', res);
  }
};

function getMessage(req, res) {
  const { message_id } = req.query;

  if (message_id) {
    model.getMessage(message_id, (err, data) => {
      if (err) {
        response.fail(INTERNAL_ERROR, res);
      } else if (!data) {
        response.notFound('message not found', res);
      } else {
        response.ok(data, res);
      }
    });
  } else {
    response.badRequest('requires message_id', res);
  }
};

function deleteMessage(req, res) {
  const { message_id } = req.body;

  if (message_id) {
    model.delMessage(message_id, (err, data) => {
      if (err) {
        response.fail(INTERNAL_ERROR, res);
      } else if (data === 0) {
        response.notFound('message not found', res);
      } else {
        response.ok('message successfully deleted', res);
      }
    });
  } else {
    response.badRequest('requires message_id', res);
  }
};

function getUserData(user_id) {
  return new Promise(function(resolve, reject) {
    if (user_id) {
      model.getUserData(user_id, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    } else {
      reject('requires user_id');
    }
  });
};

function addNewUser(user_id) {
  return new Promise(function(resolve, reject) {
    if (user_id) {
      model.addUser(user_id, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(`user ${user_id} successfully added`);
          resolve();
        }
      });
    } else {
      console.log('requires user_id');
      reject('requires user_id');
    }
  });
};

function updateUserName(user_id, name) {
  if (user_id && name) {
    model.updateUserName(user_id, name, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`user ${user_id}\'s name successfully updated`);
      }
    });
  } else {
    console.log('requires user_id and name');
  }
};

function updateBirthDate(user_id, birth_date) {
  if (user_id && birth_date) {
    model.updateBirthDate(user_id, birth_date, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`user ${user_id}\'s birth date successfully updated`);
      }
    });
  } else {
    console.log('requires user_id and birth_date');
  }
};

function updateStep(user_id, new_step) {
  if (user_id && new_step) {
    model.updateStep(user_id, new_step, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`user ${user_id}\'s current step successfully updated`);
      }
    });
  } else {
    console.log('requires user_id and curr_step');
  }
};

async function addMessage(user_id, content) {
  return new Promise(function(resolve, reject) {
    if (user_id && content) {
      model.addMessage(user_id, content, (err) => {
        if (err) {
          console.log(err);
          reject();
        } else {
          console.log(`user ${user_id}\'s message successfully added`);
          resolve();
        }
      });
    } else {
      console.log('requires user_id and content');
      reject();
    }
  });
};

function getDaysBetween(end_date) {
  const start_date = moment(moment().format('YYYY-MM-DD'));
  const date = end_date.toString().split('-');
  const next_birthday = [moment().format('YYYY'), parseInt(date[1], 10) - 1, date[2]];

  if (start_date.isSame(moment(next_birthday))) {
    return 0;
  } else if (start_date.isBefore(moment(next_birthday))) {
    return moment(next_birthday).diff(start_date, 'days');
  } else {
    return moment([next_birthday + 1, next_birthday[1], next_birthday[2]]).diff(start_date, 'days');
  }
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
              const days = exports.getDaysBetween(user_data.birth_date);
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
      console.log(err);
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
        console.error('Unable to send message:' + err);
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
module.exports.verifyWebhook = verifyWebhook;
module.exports.handleWebhookEvent = handleWebhookEvent;
module.exports.handleMessage = handleMessage;
module.exports.callSendAPI = callSendAPI;
