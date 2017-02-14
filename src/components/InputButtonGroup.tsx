import * as React from 'react';
import classNames from 'classnames';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export default class InputButtonGroup extends React.Component<Props, any> {
	render() {
		const { className, ...other } = this.props;
		return (
			<div className={classNames(className, 'btn-group')} {...other}>
				{this.props.children}
			</div>
		);
	}
}
