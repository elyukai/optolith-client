import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import TooltipToggle from '../../components/TooltipToggle';

export default class AttributeBorder extends Component {

	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string.isRequired,
		tooltip: PropTypes.node,
		tooltipMargin: PropTypes.number,
		value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
	};

	render() {

		const className = classNames( 'attr', this.props.className );

		const valueElement = this.props.tooltip ? (
			<TooltipToggle className="value" content={this.props.tooltip} margin={this.props.tooltipMargin}>
				<div className="value-inner"><div>{this.props.value}</div></div>
			</TooltipToggle>
		) : (
			<div className="value"><div className="value-inner"><div>{this.props.value}</div></div></div>
		);

		return (
			<div className={className}>
				<div className="short">{this.props.label}</div>
				{valueElement}
				{this.props.children}
			</div>
		);
	}
}
