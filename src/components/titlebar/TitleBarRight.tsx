import { Component } from 'react';
import * as React from 'react';

export default class TitleBarRight extends Component<any, any> {

	render() {
		return (
			<div className="titlebar-right">
				{this.props.children}
			</div>
		);
	}
}
