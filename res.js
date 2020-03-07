'use strict';

exports.ok = function(values, res) {
  var data = {
    status: 200,
    values: values,
  };
  res.json(data);
  res.end();
};

exports.fail = function(data, res) {
  var resp = {
    status: 500,
    data: data,
  };
  res.json(resp);
  res.end();
};
