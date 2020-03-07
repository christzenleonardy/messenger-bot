'use strict';

module.exports = function(app) {
  var controller = require('./controller');

  app.route('/')
    .get(controller.index);

  app.route('/webhook')
    .get(controller.verifyWebhook);
  app.route('/webhook')
    .post(controller.handleWebhookEvent);
};
