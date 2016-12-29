import { Component } from 'react';
import * as React from 'react';

export default class TitleBarLeft extends Component<any, any> {

	render() {
		return (
			<div className="titlebar-left">
				{this.props.children}
			</div>
		);
	}
}
