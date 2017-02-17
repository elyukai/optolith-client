import * as React from 'react';

export default class Text extends React.Component<any, any> {
	static defaultProps = {
		className: 'text'
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
