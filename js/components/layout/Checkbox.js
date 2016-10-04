import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Checkbox extends Component {

	static propTypes = {
		className: PropTypes.any,
		checked: PropTypes.bool.isRequired,
		label: PropTypes.string,
		onClick: PropTypes.func.isRequired,
		disabled: PropTypes.bool
	};

	constructor(props) {
		super(props);
	}

	render() {

		const className = classNames('checkbox', this.props.checked && 'checked', this.props.disabled && 'disabled', this.props.className);

		return (
			<div className={className} onClick={this.props.onClick}>
				<div className="icon">
					<div className="border"></div>
					<div className="hook"></div>
				</div>
				<label>{this.props.label || this.props.children}</label>
			</div>
		);
	}
}

export default Checkbox;
