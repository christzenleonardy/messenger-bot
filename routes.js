'use strict';

module.exports = function(app) {
  var controller = require('./controller');

  app.route('/')
    .get(controller.index);

  app.route('/webhook')
    .get(controller.verifyWebhook);
  app.route('/webhook')
    .post(controller.handleWebhookEvent);

  app.route('/messages')
    .get(controller.getAllMessages);

  app.route('/user/messages')
    .get(controller.getMessagesPerUser);

  app.route('/message')
    .get(controller.getMessage);
  app.route('/message')
    .delete(controller.deleteMessage);
};
