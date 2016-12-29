import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
	label: string;
	max: number;
	min: number;
	onChange: () => void;
	value: number;
}

export default class Slider extends Component<Props, any> {

	static propTypes = {
		className: PropTypes.any,
		label: PropTypes.string.isRequired,
		max: PropTypes.number.isRequired,
		min: PropTypes.number.isRequired,
		onChange: PropTypes.func.isRequired,
		value: PropTypes.number.isRequired
	};

	render() {

		const className = classNames('slider', this.props.className);

		return (
			<div className={className}>
				<label>
					<span>{this.props.label}</span>
					<span>{this.props.value}</span>
				</label>
				<input
					type="range"
					value={this.props.value}
					onChange={this.props.onChange}
					min={this.props.min}
					max={this.props.max}
					step={1}
				/>
			</div>
		);
	}
}
