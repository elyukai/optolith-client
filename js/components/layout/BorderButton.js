import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class BorderButton extends Component {

	static propTypes = {
		className: PropTypes.any,
		primary: PropTypes.bool,
		fullWidth: PropTypes.bool,
		disabled: PropTypes.bool,
		label: PropTypes.string
	};

	render() {

		const { primary, fullWidth, disabled, label, children, onClick } = this.props;

		const className = classNames('btn', primary && 'btn-primary', fullWidth && 'fullWidth', disabled && 'disabled', this.props.className);

		const labelTextElement = label ? (
			<span>{label}</span>
		) : children;

		return (
			<div className={className} onClick={disabled ? undefined : onClick}>
				{labelTextElement}
			</div>
		);
	}
}

export default BorderButton;
