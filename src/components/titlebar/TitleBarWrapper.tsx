import { Component } from 'react';
import * as React from 'react';
import TitleBarControls from './TitleBarControls';
import TitleBarDrag from './TitleBarDrag';

export default class TitleBarWrapper extends Component<any, any> {

	render() {
		return (
			<div className="titlebar">
				<TitleBarDrag>
					<TitleBarControls />
				</TitleBarDrag>
				<div className="titlebar-inner">
					{this.props.children}
				</div>
			</div>
		);
	}
}
