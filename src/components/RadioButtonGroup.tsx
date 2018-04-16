import * as React from 'react';
import { RadioButton } from './RadioButton';

export type OptionValue = string | number | undefined;

export interface Option<T extends OptionValue> {
	className?: string;
	disabled?: boolean;
	name: string;
	value: T;
}

export interface RadioButtonGroupProps<T extends OptionValue> {
	active: T;
	array: Option<T>[];
	disabled?: boolean;
	onClick(option?: T): void;
}

export function RadioButtonGroup<T extends OptionValue>(props: RadioButtonGroupProps<T>) {
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
