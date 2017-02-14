import BorderButton from '../../components/BorderButton';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import * as TabActions from '../../actions/LocationActions';
import TextField from '../../components/TextField';

export default class Grouplist extends Component<any, any> {

	filter = event => event.target.value;
	openGroup = () => TabActions.setSection('group');

	render() {
		return (
			<section id="about">
				<div className="page">
					<div className="options">
						<TextField hint="Suchen" value={''} onChange={this.filter} fullWidth disabled />
						<BorderButton label="Erstellen" disabled />
					</div>
					<Scroll className="list">
						<BorderButton label="Gruppe laden" onClick={this.openGroup} />
					</Scroll>
				</div>
			</section>
		);
	}
}
