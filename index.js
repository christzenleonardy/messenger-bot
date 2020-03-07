'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require('./routes');
routes(app);
app.use(express.static(__dirname + '/static'));

var server = app.listen(port, () => {
  console.log('Express server is listening on port ' + port);
});

module.exports = server;
