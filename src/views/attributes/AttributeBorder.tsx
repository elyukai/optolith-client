import * as React from 'react';
import classNames from 'classnames';
import TooltipToggle from '../../components/TooltipToggle';

interface Props {
	className?: string;
	label?: string;
	tooltip?: JSX.Element;
	tooltipMargin?: number;
	value: number | string;
}

export default class AttributeBorder extends React.Component<Props, undefined> {
	render() {

		const className = classNames( 'attr', this.props.className );

		const valueElement = this.props.tooltip ? (
			<TooltipToggle content={this.props.tooltip} margin={this.props.tooltipMargin}>
				<div className="value"><div className="value-inner"><div>{this.props.value}</div></div></div>
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
