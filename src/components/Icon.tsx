import * as React from 'react';

export default class Icon extends React.Component<any, any> {

	static defaultProps = {
		className: 'icon'
	};

	render() {

		const { children, ...other } = this.props;

		return (
			<div {...other}>
				{children}
			</div>
		);
	}
}
