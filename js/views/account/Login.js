import AccountActions from '../../actions/AccountActions';
import Dialog from '../../components/Dialog';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';
import { close } from '../../utils/createOverlay';

class Login extends Component {

	static props = { 
		node: PropTypes.any
	};

	state = {
		username: '',
		password: ''
	};
	
	login = () => AccountActions.login(this.state.username, this.state.password);
	forgotUsername = () => { AccountActions.showForgotName(); close(this.props.node); };
	forgotPassword = () => { AccountActions.showForgotPassword(); close(this.props.node); };
	register = () => AccountActions.showRegister();
	resendActivation = () => { AccountActions.showResend(); close(this.props.node); };
	
	_onChange = (option, event) => this.setState({ [option]: event.target.value });
	_onEnter = event => {
		if (event.charCode === 13 && this.state.username !== '' && this.state.password !== '') {
			this.login();
			close(this.props.node);
		}
	};

	render() {

		const { username, password } = this.state;

		return (
			<Dialog id="login" title="Anmelden" node={this.props.node} buttons={[
				{
					label: 'Anmelden',
					onClick: this.login,
					primary: true,
					disabled: username === '' || password === ''
				},
				{
					label: 'Registrieren',
					onClick: this.register
				}
			]}>
				<TextField
					hint="Benutzername"
					value={username}
					onChange={this._onChange.bind(null, 'username')}
					onKeyPress={this._onEnter}
					fullWidth
				/>
				<TextField
					hint="Passwort"
					value={password}
					onChange={this._onChange.bind(null, 'password')}
					onKeyPress={this._onEnter}
					type="password"
					fullWidth
				/>
				<p>
					<span className="link" onClick={this.forgotUsername}>
						Benutzername vergessen
					</span>
					<span className="link" onClick={this.forgotPassword}>
						Passwort vergessen
					</span>
					<span className="link" onClick={this.resendActivation}>
						Aktivierungs-E-Mail nicht erhalten?
					</span>
				</p>
			</Dialog>
		);
		
	}
}

export default Login;
