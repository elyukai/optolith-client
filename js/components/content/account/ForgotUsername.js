import AccountActions from '../../../actions/AccountActions';
import TabActions from '../../../actions/TabActions';
import React, { Component } from 'react';

class ForgotUsername extends Component {
	
	constructor(props) {
		super(props);
		this.state = { email: '' };
	}
	
	forgotUsername = () => AccountActions.forgotUsername(this.state.email);
	
	back = () => TabActions.openTab('login');
	
	_onChange = event => this.setState({ email: event.target.value });
	
	_onEnter = event => {
		if (event.charCode === 13 && this.state.email != '') this.forgotUsername();
	};

	render() {
		return (
			<AccountContainer id="forgotusername">
				<h2 className="header">Benutzername vergessen</h2>
				<TextField
					hint="Registrierte E-Mail-Adresse"
					value={this.state.email}
					onChange={this._onChange}
					onKeyPress={this._onEnter}
					fullWidth
					type="email"
				/>
				<BorderButton label="E-Mail anfordern" onClick={this.forgotUsername} primary fullWidth disabled={this.state.email == ''} />
				<p>
					<span className="link" onClick={this.back}>
						Zurück zur Anmeldeseite
					</span>
				</p>
			</AccountContainer>
		);
	}
}

export default ForgotUsername;
