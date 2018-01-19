"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setError = undefined;

var _set3 = require("lodash/set");

var _set4 = _interopRequireDefault(_set3);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setError = function setError(error, schema) {
  // convert property accessor (.xxx[].xxx) notation to jsonPointers notation
  if (error.dataPath.charAt(0) === ".") {
    error.dataPath = error.dataPath.replace(/[.[]/gi, "/");
    error.dataPath = error.dataPath.replace(/[\]]/gi, "");
  }
  var dataPathParts = error.dataPath.split("/").slice(1);
  var dataPath = error.dataPath.slice(1).replace(/\//g, ".");
  var type = findTypeInSchema(schema, dataPathParts);

  var errorToSet = void 0;
  if (type === "array" || type === "allOf" || type === "oneOf") {
    errorToSet = { _error: error.message };
  } else {
    errorToSet = error.message;
  }

  var errors = {};
  (0, _set4.default)(errors, dataPath, errorToSet);
  return errors;
};

var findTypeInSchema = function findTypeInSchema(schema, dataPath) {
  if (!schema) {
    return;
  } else if (dataPath.length === 0 && schema.hasOwnProperty("type")) {
    return schema.type;
  } else {
    if (schema.type === "array") {
      return findTypeInSchema(schema.items, dataPath.slice(1));
    } else if (schema.hasOwnProperty("allOf")) {
      if (dataPath.length === 0) return "allOf";
      schema = _extends({}, schema, _deepmerge2.default.all(schema.allOf));
      delete schema.allOf;
      return findTypeInSchema(schema, dataPath);
    } else if (schema.hasOwnProperty("oneOf")) {
      if (dataPath.length === 0) return "oneOf";
      schema.oneOf.forEach(function (item) {
        var type = findTypeInSchema(item, dataPath);
        if (type) {
          return type;
        }
      });
    } else {
      return findTypeInSchema(schema.properties[dataPath[0]], dataPath.slice(1));
    }
  }
};

var buildSyncValidation = function buildSyncValidation(schema) {
  var ajvParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var ajv = ajvParam;
  if (ajv === null) {
    ajv = new _ajv2.default({
      errorDataPath: "property",
      allErrors: true,
      jsonPointers: false
    });
  }
  return function (values) {
    var valid = ajv.validate(schema, values);
    if (valid) {
      return {};
    }
    var ajvErrors = ajv.errors;

    var errors = ajvErrors.map(function (error) {
      return setError(error, schema);
    });
    // We need at least two elements
    errors.push({});
    errors.push({});
    return _deepmerge2.default.all(errors);
  };
};

exports.default = buildSyncValidation;
exports.setError = setError;