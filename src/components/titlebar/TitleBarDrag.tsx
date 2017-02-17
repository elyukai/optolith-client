import { Component } from 'react';
import * as React from 'react';

export default class TitleBarDrag extends Component<any, any> {

	render() {
		return (
			<div className="titlebar-drag">
				{this.props.children}
			</div>
		);
	}
}
