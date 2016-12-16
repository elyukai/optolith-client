import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Button extends Component {

	static propTypes = {
		className: PropTypes.any,
		disabled: PropTypes.bool,
		fullWidth: PropTypes.bool,
		onClick: PropTypes.func,
		primary: PropTypes.bool,
		round: PropTypes.bool
	};
	
	render() {
		
		const { className, primary, fullWidth, disabled, round, children, onClick, ...other } = this.props;

		const allClassNames = classNames({
			'btn': true,
			'btn-round': round,
			'btn-text': !round,
			'btn-primary': primary,
			'fullWidth': fullWidth,
			'disabled': disabled,
			[className]: className
		});

		return (
			<div {...other} className={allClassNames} onClick={disabled ? undefined : onClick}>
				{children}
			</div>
		);
	}
}
