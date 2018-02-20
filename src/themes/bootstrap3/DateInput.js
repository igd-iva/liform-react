import React from 'react';

export class DateInput extends React.Component {
    focus = () => {
        this.input.focus();
    }

    render() {
        return (
            <div className="input-group">
                <input
                    {...this.props}
                    ref={el => (this.input = el)}
                    type="text"
                    className="form-control"
                />
                <span className="input-group-addon"><span className={"fa fa-calendar"}/></span>
            </div>
        );
    }
}