import RadioButton from './RadioButton';
import React, { Component, PropTypes } from 'react';

class RadioButtonGroup extends Component {

	static props = {
		active: PropTypes.any,
		disabled: PropTypes.bool,
		onClick: PropTypes.func.isRequired,
		array: PropTypes.array.isRequired
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

export default RadioButtonGroup;
