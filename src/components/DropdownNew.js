import DropdownOption from './DropdownOption';
import DropdownPosition from './DropdownPosition';
import DropdownToggle from './DropdownToggle';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Dropdown extends Component {

	static propTypes = {
		className: PropTypes.any,
		hint: PropTypes.any,
		onChange: PropTypes.func,
		options: PropTypes.array,
		value: PropTypes.any
	};

	onChange = option => this.props.onChange(option);

	render() {

		const { hint, label, options, value: selected } = this.props;

		const className = classNames( 'dropdown', this.state.isOpen && 'active', this.props.fullWidth && 'fullWidth', this.props.disabled && 'disabled', this.state.position, this.props.className );

		const labelTextElement = this.props.label ? (
			<label>{this.props.label}</label>
		) : this.props.children;

		const style = this.state.isOpen ? (this.props.options.length < 6 ? this.props.options.length * 33 + 1 : 166) : 0;
		
		const current = this.props.options.filter(arr => arr[1] == this.props.value);
		const valueText = current.length === 0 ? (this.props.hint ? this.props.hint : '') : current[0][0];

		const downElement = (
			<div style={{ height: style }} className="down">
				<div style={{ height: (style - 2) }}>
					<GeminiScrollbar>
					</GeminiScrollbar>
				</div>
			</div>
		);

		const dropElement = (
			<div>
				{
					this.props.options.map(option => {
						const [ label, value ] = option;
						return (
							<DropdownOption
								key={value}
								label={label}
								onClick={this.onChange}
								selected={selected}
								/>
						);
					})
				}
			</div>
		);

		return (
			<DropdownToggle
				label={label}
				hint={hint}
				>
			</DropdownToggle>
		);
	}
}
			// <div className={className} ref="container">
			// 	{labelTextElement}
			// 	<DropdownPosition
			// 		dropElement={dropElement}
			// 		isOpen={isOpen}
			// 		onMouseDown={this.insideFocus}
			// 		onMouseUp={this.insideBlur}
			// 		onTouchStart={this.insideFocus}
			// 		onTouchEnd={this.insideBlur}
			// 		position={position}
			// 		trigger={<div onClick={this.switch} className="value">{valueText}</div>}
			// 		/>
			// </div>
