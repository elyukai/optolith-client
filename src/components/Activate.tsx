import classNames from 'classnames';
import * as React from 'react';

interface Props {
	active: boolean;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	value?: string | number | null;
	onClick(): void;
}

export default function Activate(props: Props) {
	const { active, className, disabled, onClick, value, ...other } = props;

	return (
		<div
			{...other}
			className={classNames(className, {
				'active': active,
				'disabled': disabled
			})}
			onClick={disabled ? undefined : onClick.bind(null, value)}
			/>
	);
}
