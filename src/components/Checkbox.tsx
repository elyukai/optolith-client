import * as classNames from 'classnames';
import * as React from 'react';
import { Activate } from './Activate';
import { Icon } from './Icon';
import { Text } from './Text';

export interface CheckboxProps {
	checked: boolean;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	label?: string;
	onClick: () => void;
}

export function Checkbox(props: CheckboxProps) {
	const { checked, children, className, label, onClick, ...other } = props;

	return (
		<Activate {...other} active={checked} className={classNames('checkbox', className)} onClick={onClick}>
			<Icon>
				<div className="border"></div>
				<div className="hook"></div>
			</Icon>
			<Text>
				{label || children}
			</Text>
		</Activate>
	);
}
