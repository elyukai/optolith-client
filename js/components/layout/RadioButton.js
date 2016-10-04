import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class RadioButton extends Component {

	static propTypes = {
		active: PropTypes.bool,
		disabled: PropTypes.bool,
		onClick: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
	}

	render() {

		const className = classNames('radiobutton', this.props.active && 'active', this.props.disabled && 'disabled');

		return (
			<div className={className} onClick={this.props.onClick}>
				<div className="icon">
					<div className="border"></div>
					<div className="dot"></div>
				</div>
				<label>{this.props.children}</label>
			</div>
		);
	}
}

export default RadioButton;
