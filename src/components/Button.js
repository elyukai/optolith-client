import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Button extends Component {

	static propTypes = {
		autoWidth: PropTypes.bool,
		className: PropTypes.any,
		disabled: PropTypes.bool,
		fullWidth: PropTypes.bool,
		onClick: PropTypes.func,
		primary: PropTypes.bool,
		round: PropTypes.bool
	};
	
	render() {
		
		const { autoWidth, className, primary, fullWidth, disabled, round, children, onClick, ...other } = this.props;

		const allClassNames = classNames({
			'btn': true,
			'btn-round': round,
			'btn-text': !round,
			'btn-primary': primary,
			'autoWidth': autoWidth,
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
