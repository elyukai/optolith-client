import { Component } from 'react';
import * as React from 'react';

export default class TitleBarWrapper extends Component<any, any> {

	render() {
		return (
			<div className="titlebar">
				<div className="titlebar-inner">
					{this.props.children}
				</div>
			</div>
		);
	}
}
