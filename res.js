'use strict';

exports.ok = function(values, res) {
  var data = {
    status: 200,
    values: values,
  };
  res.status(200).json(data);
  res.end();
};

exports.badRequest = function(values, res) {
  var resp = {
    status: 400,
    values: values,
  };
  res.status(400).json(resp);
  res.end();
};

exports.notFound = function(values, res) {
  var resp = {
    status: 404,
    values: values,
  };
  res.status(404).json(resp);
  res.end();
};

exports.fail = function(values, res) {
  var resp = {
    status: 500,
    values: values,
  };
  res.status(500).json(resp);
  res.end();
};
