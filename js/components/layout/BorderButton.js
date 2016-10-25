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

		const className = classNames('btn', this.props.primary && 'btn-primary', this.props.fullWidth && 'fullWidth', this.props.disabled && 'disabled', this.props.className);

		const labelTextElement = this.props.label ? (
			<span>{this.props.label}</span>
		) : this.props.children;

		return (
			<div className={className} onClick={this.props.onClick}>
				{labelTextElement}
			</div>
		);
	}
}

export default BorderButton;
