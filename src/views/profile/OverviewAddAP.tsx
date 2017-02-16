import * as ProfileActions from '../../actions/ProfileActions';
import * as React from 'react';
import Dialog from '../../components/Dialog';
import TextField from '../../components/TextField';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	value: string;
}

export default class OverviewAddAP extends React.Component<Props, State> {
	state = {
		value: ''
	};

	onChange = (event: InputTextEvent) => this.setState({ value: event.target.value });
	addAP = () => ProfileActions.addAdventurePoints(parseInt(this.state.value));

	render() {

		const { value } = this.state;

		return (
			<Dialog id="overview-add-ap" title="AP hinzufügen" node={this.props.node} buttons={[
				{
					label: 'Hinzufügen',
					onClick: this.addAP,
					disabled: value === '' || !Number.isInteger(parseInt(value))
				},
				{
					label: 'Abbrechen'
				}
			]}>
				<TextField
					hint="Abenteuerpunkte"
					value={value}
					onChange={this.onChange}
					fullWidth
					/>
			</Dialog>
		);
	}
}
