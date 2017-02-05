import * as React from 'react';
import classNames from 'classnames';

interface Props {
	autoWidth?: boolean;
	className?: string;
	disabled?: boolean;
	flat?: boolean;
	fullWidth?: boolean;
	onClick?: () => void;
	primary?: boolean;
	round?: boolean;
	[id: string]: any;
}

export default class Button extends React.Component<Props, undefined> {
	render() {
		const { autoWidth, className, primary, flat, fullWidth, disabled, round, children, onClick, ...other } = this.props;

		const allClassNames = classNames(className, {
			'btn': true,
			'btn-round': round,
			'btn-text': !round,
			'btn-primary': primary,
			'btn-flat': flat,
			'autoWidth': autoWidth,
			'fullWidth': fullWidth,
			'disabled': disabled
		});

		return (
			<div {...other} className={allClassNames} onClick={disabled ? undefined : onClick}>
				{children}
			</div>
		);
	}
}
