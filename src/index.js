import React from "react";
import PropTypes from "prop-types";
import DefaultTheme from "./themes/bootstrap3";
import {reduxForm} from "redux-form";
import renderFields from "./renderFields";
import renderField from "./renderField";
import processSubmitErrors from "./processSubmitErrors";
import buildSyncValidation from "./buildSyncValidation";
import {setError} from "./buildSyncValidation";
import compileSchema from "./compileSchema";

const BaseForm = props => {
    const {schema, handleSubmit, theme, error, submitting, context, readOnly} = props;
    return (
        <form onSubmit={handleSubmit}>
            {renderField(schema, null, readOnly, theme, "", context)}
            <div>{error && <strong>{error}</strong>}</div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
                Submit
            </button>
        </form>
    );
};

class Liform extends React.Component {

    render() {
        this.props.schema.showLabel = false;
        const schema = compileSchema(this.props.schema);
        const formName = this.props.formKey || this.props.schema.title || "form";
        const FinalForm = reduxForm({
            form: this.props.formKey || this.props.schema.title || "form",
            validate: this.props.syncValidation || buildSyncValidation(schema, this.props.ajv),
            initialValues: this.props.initialValues,
            context: {...this.props.context, formName},
            readOnly: this.props.readOnly,
            destroyOnUnmount: false
        })(this.props.baseForm || BaseForm);
        return (
            <FinalForm
                ref={(form) => this.form = form}
                renderFields={renderField.bind(this)}
                {...this.props}
                schema={schema}
            />
        );
    }

    values() {
        return this.form.values;
    }
}

Liform.propTypes = {
    schema: PropTypes.object,
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    syncValidation: PropTypes.func,
    formKey: PropTypes.string,
    baseForm: PropTypes.func,
    context: PropTypes.object,
    ajv: PropTypes.object,
    typeIdentifier: PropTypes.string
};

export default Liform;

export {
    renderFields,
    renderField,
    processSubmitErrors,
    DefaultTheme,
    setError
};
