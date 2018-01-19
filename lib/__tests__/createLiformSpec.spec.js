"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _testUtils = require("react-dom/test-utils");

var _testUtils2 = _interopRequireDefault(_testUtils);

var _ = require("../");

var _2 = _interopRequireDefault(_);

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reduxForm = require("redux-form");

var _enzyme = require("enzyme");

var _testUtils3 = require("./test-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("createLiform", function () {
  var schema = {
    title: "A schema",
    properties: {
      name: {
        type: "string"
      }
    }
  };

  //const schemaWrong = {
  //    title: 'A schema',
  //    properties: {
  //        'name' : {
  //            type: 'asdf',
  //        }
  //    }
  //}

  it("should render a form", function () {
    var Component = _react2.default.createElement(
      _testUtils3.FormFrame,
      null,
      _react2.default.createElement(_2.default, { schema: schema })
    );
    var wrapper = (0, _enzyme.render)(Component);
    (0, _expect2.default)(wrapper.find("input").length).toEqual(1);
  });

  it("can pass a context", function () {
    var CustomString = function CustomString(field) {
      var fun = field.context.fun;

      fun();
      return _react2.default.createElement("input", _extends({}, field.input, { className: "form-control", type: "email" }));
    };
    var CustomWidget = function CustomWidget(props) {
      return _react2.default.createElement(_reduxForm.Field, {
        component: CustomString,
        name: props.fieldName,
        context: props.context
      });
    };
    var myTheme = _extends({}, _.DefaultTheme, { string: CustomWidget });

    var fun = jest.fn();

    var Component = _react2.default.createElement(
      _testUtils3.FormFrame,
      null,
      _react2.default.createElement(_2.default, { schema: schema, context: { fun: fun }, theme: myTheme })
    );
    var wrapper = (0, _enzyme.render)(Component);
    (0, _expect2.default)(fun).toHaveBeenCalled();
    (0, _expect2.default)(wrapper.find("input").length).toEqual(1);
  });
});