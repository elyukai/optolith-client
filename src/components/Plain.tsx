import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className: string;
	label: string;
	value?: string | number;
}

export default class Plain extends React.Component<Props, undefined> {
	render() {
		const className = classNames( 'plain', this.props.className );
		return (
			<div className={className}>
				<div className="label">{this.props.label}</div>
				<div className="value">{this.props.value}</div>
			</div>
		);
	}
}
