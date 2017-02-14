import { Component } from 'react';
import * as React from 'react';
// import { remote } from 'electron';

export default class TitleBarDrag extends Component<any, any> {

	render() {
		// const window = remote.getCurrentWindow();
		const close = () => window.close();

		return (
			<div className="titlebar-controls">
				<div className="titlebar-controls-btn" onClick={close}>&#xE5CD;</div>
			</div>
		);
	}
}
