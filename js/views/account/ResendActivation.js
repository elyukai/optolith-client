import AccountActions from '../../actions/AccountActions';
import Dialog from '../../components/Dialog';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';
import { close } from '../../utils/createOverlay';

export default class ResendActivation extends Component {

	static propTypes = { 
		node: PropTypes.any
	};

	state = {
		email: ''
	};
	
	resendActivation = () => AccountActions.resendActivation(this.state.email);
	back = () => AccountActions.showLogin();
	
	_onChange = event => this.setState({ email: event.target.value });
	_onEnter = event => {
		if (event.charCode === 13 && this.state.email !== '') {
			this.resendActivation();
			close(this.props.node);
		}
	};

	render() {

		const { email } = this.state;

		return (
			<Dialog id="resendactivation" title="Aktivierungslink erneut senden" node={this.props.node} buttons={[
				{
					label: 'E-Mail anfordern',
					onClick: this.resendActivation,
					primary: true,
					disabled: email === ''
				},
				{
					label: 'Zurück',
					onClick: this.back
				}
			]}>
				<TextField
					hint="Registrierte E-Mail-Adresse"
					value={email}
					onChange={this._onChange}
					onKeyPress={this._onEnter}
					type="email"
					fullWidth
				/>
			</Dialog>
		);
		
	}
}
