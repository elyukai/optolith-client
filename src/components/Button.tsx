import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';

interface Props {
	autoWidth?: boolean;
	className?: string;
	disabled?: boolean;
	fullWidth?: boolean;
	onClick?: () => void;
	primary?: boolean;
	round?: boolean;
}

export default class Button extends Component<Props, any> {

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
