import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data.d';

export class Grouplist extends React.Component {
	filter = (event: InputTextEvent) => event.target.value;

	render() {
		return (
			<Page>
				<Options>
					<TextField hint="Suchen" value={''} onChange={this.filter} fullWidth disabled />
					<BorderButton label="Erstellen" disabled />
				</Options>
				<Scroll className="list">
					<BorderButton label="Gruppe laden" />
				</Scroll>
			</Page>
		);
	}
}
