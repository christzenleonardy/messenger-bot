'use strict';

var response = require('./res');

exports.index = function(req, res) {
  response.ok('Hello from the Node JS RESTful side!', res);
};
