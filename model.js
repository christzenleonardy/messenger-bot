'use strict';

var connection = require('./conn');

exports.getUserData = function(user_id, callback) {
  connection.query(`SELECT user_id, name, birth_date, curr_step
    FROM users
    WHERE user_id = ?`, [user_id], function(err, rows, fields) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, rows[0]);
    }
  });
};

exports.addUser = function(user_id, callback) {
  connection.query(`INSERT INTO users (user_id)
    VALUES (?)`, [user_id], function(err, rows, fields) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

exports.updateUserName = function(user_id, name, callback) {
  connection.query(`UPDATE users
    SET name = ?, curr_step = 2
    WHERE user_id = ?`, [name, user_id], function(err, rows, fields) {
    if (err) {
      return callback(err);
    }
    return callback(null);
  });
};

exports.updateBirthDate = function(user_id, birth_date, callback) {
  connection.query(`UPDATE users
    SET birth_date = ?, curr_step = 3
    WHERE user_id = ?`, [birth_date, user_id], function(err, rows, fields) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

exports.updateStep = function(user_id, new_step, callback) {
  connection.query(`UPDATE users
    SET curr_step = ?
    WHERE user_id = ?`, [new_step, user_id], function(err, rows, fields) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

exports.addMessage = function(user_id, content, callback) {
  connection.query(`INSERT INTO messages (user_id, content)
    VALUES (?, ?)`, [user_id, content], function(err, rows, fields) {
    if (err) {
      console.log(err);
      return callback(err);
    } else {
      console.log(`user ${user_id}\'s message successfully added`);
      return callback(null);
    }
  });
};

exports.getAllMessages = function(callback) {
  connection.query(`SELECT message_id, user_id, timestamp, content
    FROM messages`, [], function(err, rows, fields) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    return callback(null, rows);
  });
};

exports.getMessagesPerUser = function(user_id, callback) {
  connection.query(`SELECT message_id, timestamp, content
    FROM messages
    WHERE user_id = ?`, [user_id], function(err, rows, fields) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    return callback(null, rows);
  });
};

exports.getMessage = function(message_id, callback) {
  connection.query(`SELECT message_id, user_id, timestamp, content
    FROM messages
    WHERE message_id = ?`, [message_id], function(err, rows, fields) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    return callback(null, rows[0]);
  });
};

exports.delMessage = function(message_id, callback) {
  connection.query(`DELETE FROM messages
    WHERE message_id = ?`, [message_id], function(err, rows, fields) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    return callback(null, rows.affectedRows);
  });
};
