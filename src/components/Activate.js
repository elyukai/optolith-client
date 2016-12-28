import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Activate extends Component {

	static propTypes = {
		active: PropTypes.bool.isRequired,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		onClick: PropTypes.func.isRequired,
		value: PropTypes.any
	};
	
	render() {
		
		let { active, className, disabled, children, onClick, value, ...other } = this.props;

		className = classNames(className, {
			'active': active,
			'disabled': disabled
		});

		return (
			<div {...other} className={className} onClick={disabled ? undefined : onClick.bind(null, value)}>
				{children}
			</div>
		);
	}
}
