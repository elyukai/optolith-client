import * as React from 'react';
import { Dialog } from '../../components/Dialog';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data.d';
import { isInteger } from '../../utils/RegexUtils';

export interface AttributesRemovePermanentProps {
	node?: HTMLDivElement;
	remove(value: number): void;
}

interface State {
	value: string;
}

export class AttributesRemovePermanent extends React.Component<AttributesRemovePermanentProps, State> {
	state = {
		value: '',
	};

	onChange = (event: InputTextEvent) => this.setState({ value: event.target.value } as State);
	remove = () => this.props.remove(Number.parseInt(this.state.value));

	render() {

		const { value } = this.state;

		return (
			<Dialog id="overview-add-ap" title="Permanenter Verlust" node={this.props.node} buttons={[
				{
					disabled: !isInteger(this.state.value),
					label: 'Hinzufügen',
					onClick: this.remove,
				},
				{
					label: 'Abbrechen',
				},
			]}>
				<TextField
					hint="Wie viele permanente Punkte sollen entfernt werden?"
					value={value}
					onChange={this.onChange}
					fullWidth
					autoFocus
					/>
			</Dialog>
		);
	}
}
