import React, {Component} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {change, formValueSelector} from "redux-form";
import {connect} from "react-redux";
import renderField from "../../renderField";
import {map as _map} from "lodash";

class OneOfChoiceWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: 0,
            oneOfProp: ""
        };
        this.renderOption = this.renderOption.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    componentDidMount() {
        const {fieldName, prefix, state, schema, context} = this.props;
        const selector = formValueSelector(context.formName);
        const val = selector(state, prefix + fieldName);
        if (val) {
            const index = schema.oneOf.findIndex(o => o.properties[fieldName].default === val[fieldName]);
            this.setState({choice: index});
        }
    }

    render() {
        const field = this.props;
        const className = classNames(["form-group"]);
        const schema = field.schema;
        const options = schema.oneOf;

        return (
            <div className={className}>
                <label className="control-label" htmlFor={"field-" + field.fieldName}>
                    {schema.title ? schema.title : field.fieldName}
                </label>
                {!field.readOnly && (
                    <select
                        className="form-control"
                        onChange={this.selectItem.bind(this)}
                        id={field.context.formName + "-field-" + field.fieldName}
                        required={field.required}
                        multiple={false}
                        value={this.state.choice}
                    >
                        {_map(options, (item, idx) => {
                            return (
                                <option key={options.indexOf(item)} value={idx}>
                                    {item.title || idx}
                                </option>
                            );
                        })}
                    </select>
                )}
                {field.readOnly && (
                    <p className="form-control-static">{options[this.state.choice].title}</p>
                )}
                <div>{this.renderOption()}</div>
                {field.description && (
                    <span className="help-block">{field.description}</span>
                )}
            </div>
        );
    }

    renderOption() {
        const field = this.props;
        const schema = field.schema.oneOf[this.state.choice];

        if (schema.properties && Object.keys(schema.properties).length === 1 && schema.properties[this.props.fieldName])
            return;
        //if (schema.properties && schema.properties.length > 0)
        return renderField(
            schema,
            field.fieldName,
            field.readOnly,
            field.theme,
            field.prefix,
            field.context,
            field.required,
        );
    }

    selectItem(e) {
        //FIXME
        const {schema, context, dispatch, prefix} = this.props;
        for (let property in schema.oneOf[this.state.choice].properties) {
            if (property === "@type") {
                dispatch(change(context.formName, prefix + property, schema.oneOf[e.target.value].properties["@type"]["default"]));
            } else
                dispatch(change(context.formName, prefix + property, null));
        }
        this.setState({choice: e.target.value});
    }
}

OneOfChoiceWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    fieldName: PropTypes.string,
    label: PropTypes.string,
    theme: PropTypes.object,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool
};

export default connect(state => {
    return {state: state}
})(OneOfChoiceWidget);
