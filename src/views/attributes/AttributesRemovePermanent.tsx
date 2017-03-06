import * as React from 'react';
import Dialog from '../../components/Dialog';
import TextField from '../../components/TextField';

interface Props {
	node?: HTMLDivElement;
	remove(value: number): void;
}

interface State {
	value: string;
}

export default class AttributesRemovePermanent extends React.Component<Props, State> {
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
					disabled: value === '' || !Number.isInteger(Number.parseInt(value)) || Number.parseInt(value) < 1,
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
