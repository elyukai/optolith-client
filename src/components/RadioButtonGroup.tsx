import * as React from 'react';
import { RadioButton } from './RadioButton';

export interface Option {
	className?: string;
	disabled?: boolean;
	name: string;
	value?: string | number;
}

export interface RadioButtonGroupProps {
	active?: number | string;
	array: Option[];
	disabled?: boolean;
	onClick: (option?: string | number) => void;
}

export function RadioButtonGroup(props: RadioButtonGroupProps) {
	const { active, array, disabled, onClick } = props;

	return (
		<div className="radiobutton-group">
			{array.map(option => (
				<RadioButton
					key={option.value || '__default__'}
					value={option.value}
					active={active === option.value}
					onClick={onClick.bind(null, option.value)}
					disabled={option.disabled || disabled}
				>
					{option.name}
				</RadioButton>
			))}
		</div>
	);
}
