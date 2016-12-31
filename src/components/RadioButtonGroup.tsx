import { Component, PropTypes } from 'react';
import * as React from 'react';
import RadioButton from './RadioButton';

interface Option {
	className?: string;
	disabled?: boolean;
	name: string;
	value: string | number;
}

interface Props {
	active: number | string | boolean;
	array: Option[],
	disabled?: boolean;
	onClick: (option: string | number | boolean) => void;
}

export default class RadioButtonGroup extends Component<Props, any> {

	static propTypes = {
		active: PropTypes.any,
		array: PropTypes.array.isRequired,
		disabled: PropTypes.bool,
		onClick: PropTypes.func.isRequired
	};

	render() {

		const { active, array, disabled, onClick } = this.props;

		return (
			<div className="radiobutton-group">
				{array.map((option) => (
					<RadioButton
						key={option.value}
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
}
