import * as React from 'react';
import classNames from 'classnames';

interface Props {
	active: boolean;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	onClick: () => void;
	value?: string | number;
}

export default (props: Props) => {
	const { active, disabled, children, onClick, value, ...other } = props;
	let { className } = props;

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
