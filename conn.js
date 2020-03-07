'use strict';

var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zen_personal_assistant',
});

con.connect(function(err) {
  if (err) throw err;
});

module.exports = con;
