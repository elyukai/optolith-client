import Dialog from '../../components/Dialog';
import ProfileActions from '../../_actions/ProfileActions';
import * as React from 'react';
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

	onChange = e => this.setState({ value: e.target.value });
	addAP = () => ProfileActions.addAP(parseInt(this.state.value));

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
