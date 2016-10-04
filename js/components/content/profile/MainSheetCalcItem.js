import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class MainSheetCalcItem extends Component {

	static propTypes = {
		add: PropTypes.number,
		calc: PropTypes.string.isRequired,
		empty: PropTypes.bool,
		label: PropTypes.string.isRequired,
		max: PropTypes.number,
		purchased: PropTypes.number,
		subArray: PropTypes.array,
		subLabel: PropTypes.string,
		value: PropTypes.number
	};

	constructor(props) {
		super(props);
	}

	render() {

		var max = this.props.empty ? '-' : this.props.value + this.props.add;
		if (!this.props.empty) {
			if (this.props.purchased !== null) max += this.props.purchased;
			if (this.props.max) max += this.props.max;
		}

		return (
			<div>
				<div className="label">
					<h3>{this.props.label}</h3>
					<span className="calc">{this.props.calc}</span>
					{
						this.props.subLabel ? (
							<span className="sub">{this.props.subLabel}:</span>
						) : null
					}
				</div>
				<div className="values">
					<div className="base">{this.props.empty ? '-' : this.props.value}</div>
					<div className="add">{this.props.empty ? '-' : this.props.add}</div>
					<div className={classNames(
						'purchased',
						this.props.purchased === null && 'blocked'
					)}>{ this.props.purchased === null ? '\uE14B' : this.props.empty ? '-' : this.props.purchased}</div>
					<div className="max">{max}</div>
					{
						this.props.subArray ? this.props.subArray.map(
							(value, index) => <div key={this.props.label + index} className="sub">{this.props.empty ? '-' : value}</div>
						) : null
					}
				</div>
			</div>
		);
	}
}

export default MainSheetCalcItem;
