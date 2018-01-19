import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {Field} from "redux-form";
import {zipObject as _zipObject, map as _map} from "lodash";

class RenderSelect extends React.Component {
    componentDidMount() {
        const optionNames = this.props.schema.enum_titles || this.props.schema.enum;
        if ((!this.props.input.value || (optionNames.length === 1 && optionNames[0] !== this.props.input.value)) && this.props.schema.default)
            this.props.input.onChange(this.props.schema.default);
    }

    render() {
        const className = classNames([
            "form-group",
            {"has-error": this.props.meta.touched && this.props.meta.error}
        ]);
        const options = this.props.schema.enum;
        const optionNames = this.props.schema.enum_titles || options;

        const selectOptions = _zipObject(options, optionNames);

        if (options.length === 1 && optionNames[0] === this.props.schema.default)
            return ('');
        return (
            <div className={className}>
                <label className="control-label" htmlFor={"field-" + this.props.name}>
                    {this.props.label}
                </label>
                <select
                    {...this.props.input}
                    className="form-control"
                    id={"field-" + this.props.name}
                    required={this.props.required}
                    multiple={this.props.multiple}
                    readOnly={this.props.readOnly}
                >
                    {!this.props.multiple && !this.props.schema.default && (
                        <option key={""} value={""}>
                            {this.props.placeholder}
                        </option>
                    )}
                    {_map(selectOptions, (name, value) => {
                        return (
                            <option key={value} value={value}>
                                {name}
                            </option>
                        );
                    })}
                </select>

                {this.props.meta.touched &&
                this.props.meta.error && (
                    <span className="help-block">{this.props.meta.error}</span>
                )}
                {this.props.description && (
                    <span className="help-block">{this.props.description}</span>
                )}
            </div>
        );
    }
}

const ChoiceWidget = props => {
    return (
        <Field
            component={(field) => <RenderSelect {...field}/>}
            label={props.label}
            name={props.fieldName}
            required={props.required}
            id={"field-" + props.fieldName}
            placeholder={props.schema.default}
            description={props.schema.description}
            schema={props.schema}
            multiple={props.multiple}
            readOnly={props.readOnly}
        />
    );
};

ChoiceWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    fieldName: PropTypes.string,
    label: PropTypes.string,
    theme: PropTypes.object,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool
};

export default ChoiceWidget;
