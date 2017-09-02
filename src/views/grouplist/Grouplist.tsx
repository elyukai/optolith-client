import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data.d';

export class Grouplist extends React.Component<{}, undefined> {

	filter = (event: InputTextEvent) => event.target.value;

	render() {
		return (
			<section id="about">
				<div className="page">
					<div className="options">
						<TextField hint="Suchen" value={''} onChange={this.filter} fullWidth disabled />
						<BorderButton label="Erstellen" disabled />
					</div>
					<Scroll className="list">
						<BorderButton label="Gruppe laden" />
					</Scroll>
				</div>
			</section>
		);
	}
}
