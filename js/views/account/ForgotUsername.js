import AccountActions from '../../actions/AccountActions';
import Dialog from '../../components/Dialog';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';
import { close } from '../../utils/createOverlay';

class ForgotUsername extends Component {

	static props = { 
		node: PropTypes.any
	};

	state = {
		email: ''
	};
	
	forgotUsername = () => AccountActions.forgotUsername(this.state.email);
	back = () => AccountActions.showLogin();
	
	_onChange = event => this.setState({ email: event.target.value });
	_onEnter = event => {
		if (event.charCode === 13 && this.state.email !== '') {
			this.forgotUsername();
			close(this.props.node);
		}
	};

	render() {

		const { email } = this.state;

		return (
			<Dialog id="forgotusername" title="Benutzername vergessen" node={this.props.node} buttons={[
				{
					label: 'E-Mail anfordern',
					onClick: this.forgotUsername,
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

export default ForgotUsername;
