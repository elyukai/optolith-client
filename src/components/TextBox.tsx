import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
	label: string;
	value?: string | number;
}

export default class TextBox extends React.Component<Props, undefined> {
	render() {
		const { children, label, value } = this.props;
		const className = classNames( 'textbox', this.props.className );

		return (
			<div className={className}>
				<h3>{label}</h3>
				{value ? <div>{value}</div> : children}
			</div>
		);
	}
}
