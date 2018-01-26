"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extractDateToken = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _reduxForm = require("redux-form");

var _DateSelector = require("./DateSelector");

var _DateSelector2 = _interopRequireDefault(_DateSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// produces an array [start..end-1]
var range = function range(start, end) {
    return Array.from({ length: end - start }, function (v, k) {
        return k + start;
    });
};

// produces an array [start..end-1] padded with zeros, (two digits)
var rangeZeroPad = function rangeZeroPad(start, end) {
    return Array.from({ length: end - start }, function (v, k) {
        return ("0" + (k + start)).slice(-2);
    });
};

var extractYear = function extractYear(value) {
    return extractDateToken(value, 0);
};
var extractMonth = function extractMonth(value) {
    return extractDateToken(value, 1);
};
var extractDay = function extractDay(value) {
    return extractDateToken(value, 2);
};

var extractDateToken = function extractDateToken(value, index) {
    if (!value) {
        return "";
    }
    var tokens = value.split(/-/);
    if (tokens.length !== 3) {
        return "";
    }
    return tokens[index];
};

var CompatibleDate = function (_React$Component) {
    _inherits(CompatibleDate, _React$Component);

    function CompatibleDate(props, context) {
        _classCallCheck(this, CompatibleDate);

        var _this = _possibleConstructorReturn(this, (CompatibleDate.__proto__ || Object.getPrototypeOf(CompatibleDate)).call(this, props, context));

        _this.state = {
            year: null,
            month: null,
            day: null
        };
        _this.onBlur = _this.onBlur.bind(_this);
        return _this;
    }

    _createClass(CompatibleDate, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            if (!this.props.input.value && this.props.schema.default) {
                this.props.input.value = this.props.schema.default;
                this.setState({
                    year: extractYear(this.props.schema.default),
                    month: extractMonth(this.props.schema.default),
                    day: extractDay(this.props.schema.default)
                }, function () {
                    _this2.props.input.onChange(_this2.buildRfc3339Date());
                });
            }
        }

        // Produces a RFC 3339 full-date from the state

    }, {
        key: "buildRfc3339Date",
        value: function buildRfc3339Date() {
            var year = this.state.year || "";
            var month = this.state.month || "";
            var day = this.state.day || "";
            return year + "-" + month + "-" + day;
        }
    }, {
        key: "getStaticFieldText",
        value: function getStaticFieldText() {
            if (this.state.year === null || this.state.month === null || this.state.day === null) return "";
            return this.state.year + "." + this.state.month + "." + this.state.day;
        }
    }, {
        key: "onChangeField",
        value: function onChangeField(field, e) {
            var _this3 = this;

            var value = e.target.value;
            var changeset = {};
            changeset[field] = value;
            this.setState(changeset, function () {
                _this3.props.input.onChange(_this3.buildRfc3339Date());
            });
        }
    }, {
        key: "onBlur",
        value: function onBlur() {
            this.props.input.onBlur(this.buildRfc3339Date());
        }
    }, {
        key: "render",
        value: function render() {
            var field = this.props;
            var className = (0, _classnames2.default)(["form-group", { "has-error": field.meta.touched && field.meta.error }]);
            return _react2.default.createElement(
                "div",
                { className: className },
                _react2.default.createElement(
                    "label",
                    { className: "control-label", htmlFor: field.id },
                    field.label
                ),
                field.readOnly && _react2.default.createElement(
                "p",
                {className: "form-control-static"},
                this.getStaticFieldText()
                ),
                !field.readOnly && _react2.default.createElement(
                    "ul",
                    { className: "list-inline", readOnly: field.readOnly },
                    _react2.default.createElement(
                        "li",
                        null,
                        _react2.default.createElement(_DateSelector2.default, _extends({
                            extractField: extractYear,
                            range: range(field.startYear, field.endYear),
                            emptyOption: "year",
                            onBlur: this.onBlur,
                            onChange: this.onChangeField.bind(this, "year"),
                            idx: this.props.id + "-year"
                        }, field))
                    ),
                    _react2.default.createElement(
                        "li",
                        null,
                        _react2.default.createElement(_DateSelector2.default, _extends({
                            extractField: extractMonth,
                            range: rangeZeroPad(1, 13),
                            emptyOption: "month",
                            onBlur: this.onBlur,
                            onChange: this.onChangeField.bind(this, "month"),
                            idx: this.props.id + "-month"
                        }, field))
                    ),
                    _react2.default.createElement(
                        "li",
                        null,
                        _react2.default.createElement(_DateSelector2.default, _extends({
                            extractField: extractDay,
                            range: rangeZeroPad(1, 32),
                            emptyOption: "day",
                            onBlur: this.onBlur,
                            onChange: this.onChangeField.bind(this, "day"),
                            idx: this.props.id + "-day"
                        }, field))
                    )
                ),
                field.meta.touched && field.meta.error && _react2.default.createElement(
                    "span",
                    { className: "help-block" },
                    field.meta.error
                ),
                field.description && _react2.default.createElement(
                    "span",
                    { className: "help-block" },
                    field.description
                )
            );
        }
    }]);

    return CompatibleDate;
}(_react2.default.Component);

var CompatibleDateWidget = function CompatibleDateWidget(props) {
    return _react2.default.createElement(_reduxForm.Field, {
        component: CompatibleDate,
        label: props.label,
        name: props.fieldName,
        required: props.required,
        id: "field-" + props.fieldName,
        placeholder: props.schema.default,
        description: props.schema.description,
        startYear: props.schema["start-year"] || 1900,
        endYear: props.schema["end-year"] || new Date().getFullYear() + 5,
        type: props.type,
        readOnly: props.readOnly,
        schema: props.schema
    });
};

exports.default = CompatibleDateWidget;

// Only for testing purposes

exports.extractDateToken = extractDateToken;