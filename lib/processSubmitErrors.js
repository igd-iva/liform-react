"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isEmpty3 = require("lodash/isEmpty");

var _isEmpty4 = _interopRequireDefault(_isEmpty3);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxForm = require("redux-form");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// added for empty check

var convertToReduxFormErrors = function convertToReduxFormErrors(obj) {
  var objectWithoutChildrenAndFalseErrors = {};
  Object.keys(obj).map(function (name) {
    if (name === "children") {
      objectWithoutChildrenAndFalseErrors = _extends({}, objectWithoutChildrenAndFalseErrors, convertToReduxFormErrors(obj[name]));
    } else {
      if (obj[name].hasOwnProperty("children")) {
        // if children, take field from it and set them directly as own field
        objectWithoutChildrenAndFalseErrors[name] = convertToReduxFormErrors(obj[name]);
      } else {
        if (obj[name].hasOwnProperty("errors") && !(0, _isEmpty4.default)(obj[name]["errors"])) {
          // using lodash for empty error check, dont add them if empty
          objectWithoutChildrenAndFalseErrors[name] = obj[name]["errors"];
        }
      }
    }
    return null;
  });
  return objectWithoutChildrenAndFalseErrors;
};

var processSubmitErrors = function processSubmitErrors(errors) {
  if (errors.hasOwnProperty("errors")) {
    errors = convertToReduxFormErrors(errors.errors);
    throw new _reduxForm.SubmissionError(errors);
  }
};

exports.default = processSubmitErrors;