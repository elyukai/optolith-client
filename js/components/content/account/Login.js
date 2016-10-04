import AccountActions from '../../../actions/AccountActions';
import TabActions from '../../../actions/TabActions';
import React, { Component } from 'react';

class Login extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
	}
	
	login = () => AccountActions.login(this.state.username, this.state.password);
	
	forgotUsername = () => TabActions.openTab('forgotUsername');
	
	forgotPassword = () => TabActions.openTab('forgotPassword');
	
	registration = () => TabActions.openTab('registration');
	
	resendActivation = () => TabActions.openTab('resendActivation');
	
	_onChange = (option, event) => this.setState({ [option]: event.target.value });
	
	_onEnter = event => {
		if (event.charCode === 13 && this.state.username != '' && this.state.password != '') this.login();
	};

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.username !== this.state.username || nextState.password !== this.state.password;
	}

	render() {
		
		return (
			<AccountContainer id="login">
				<h2 className="header">Anmelden</h2>
				<TextField
					hint="Benutzername"
					value={this.state.username}
					onChange={this._onChange.bind(null, 'username')}
					onKeyPress={this._onEnter}
					fullWidth
				/>
				<TextField
					hint="Passwort"
					value={this.state.password}
					onChange={this._onChange.bind(null, 'password')}
					onKeyPress={this._onEnter}
					type="password"
					fullWidth
				/>
				<BorderButton label="Anmelden" onClick={this.login} primary fullWidth disabled={this.state.username == '' || this.state.password == ''} />
				<p>
					<span className="link" onClick={this.forgotUsername}>
						Benutzername vergessen
					</span>
					<span className="link" onClick={this.forgotPassword}>
						Passwort vergessen
					</span>
					<span className="link" onClick={this.registration}>
						Konto erstellen
					</span>
					<span className="link" onClick={this.resendActivation}>
						Aktivierungs-E-Mail nicht erhalten?
					</span>
				</p>
			</AccountContainer>
		);
		
	}
}

export default Login;
