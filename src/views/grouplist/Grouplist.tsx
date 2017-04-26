import * as React from 'react';
import * as LocationActions from '../../actions/LocationActions';
import { BorderButton } from '../../components/BorderButton';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data.d';

export class Grouplist extends React.Component<undefined, undefined> {

	filter = (event: InputTextEvent) => event.target.value;
	openGroup = () => LocationActions.setSection('group');

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
