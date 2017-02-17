import { Component } from 'react';
import * as React from 'react';
import * as LocationActions from '../../actions/LocationActions';
import TitleBarBackArrow from './TitleBarBackArrow';

export default class TitleBarBack extends Component<any, any> {

	back = () => LocationActions.setSection('main');

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
