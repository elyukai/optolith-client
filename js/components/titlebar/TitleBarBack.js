import React, { Component } from 'react';
import TabActions from '../../actions/TabActions';
import TitleBarBackArrow from './TitleBarBackArrow';

export default class TitleBarBack extends Component {

	back = () => TabActions.showSection('main');

	render() {
		return (
			<div className="titlebar-back">
				<div className="titlebar-back-inner" onClick={this.back}>
					<TitleBarBackArrow />				
				</div>
			</div>
		);
	}
}
