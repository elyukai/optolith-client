import Dialog from '../../components/Dialog';
import ProfileActions from '../../actions/ProfileActions';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

export default class OverviewAddAP extends Component {

	static propTypes = { 
		node: PropTypes.any
	};

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
