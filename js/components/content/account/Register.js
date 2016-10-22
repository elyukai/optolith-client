import AccountActions from '../../../actions/AccountActions';
import Dialog from '../../layout/Dialog';
import React, { Component, PropTypes } from 'react';
import TextField from '../../layout/TextField';
import { close } from '../../../utils/createOverlay';

function _validateEmail(email) {
	var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

class Register extends Component {

	static props = { 
		node: PropTypes.any
	};

	state = {
		email: '',
		email2: '',
		username: '',
		password: '',
		password2: ''
	};
	
	register = () => AccountActions.register(this.state.email, this.state.username, this.state.password);
	back = () => AccountActions.showLogin();
	
	_onChange = (option, event) => this.setState({ [option]: event.target.value });
	_onEnter = event => {
		let { email, email2, username, password, password2 } = this.state;
		if (event.charCode === 13 &&
			email !== '' &&
			_validateEmail(email) &&
			email === email2 &&
			username !== '' &&
			username.length >= 3 &&
			username.length <= 20 &&
			password !== '' &&
			password.length >= 5 &&
			password.length <= 20 &&
			password === password2) {
			this.register();
			close(this.props.node);
		}
	};

	render() {

		const { email, email2, username, password, password2 } = this.state;

		return (
			<Dialog id="login" title="Registrieren" node={this.props.node} buttons={[
				{
					label: 'Registrieren',
					onClick: this.register,
					primary: true,
					disabled: 
						email === '' ||
						!_validateEmail(email) ||
						email !== email2 ||
						username === '' ||
						username.length < 3 ||
						username.length > 20 ||
						password === '' ||
						password.length < 5 ||
						password.length > 20 ||
						password !== password2
				},
				{
					label: 'Zurück',
					onClick: this.back
				}
			]}>
				<TextField
					hint="E-Mail-Adresse"
					value={email}
					onChange={this._onChange.bind(null, 'email')}
					onKeyPress={this._onEnter}
					fullWidth
					type="email"
				/>
				{email !== '' && !_validateEmail(email) ? <p>Es wurde keine gültige Email-Adresse eingegeben!</p> : null}
				<TextField
					hint="E-Mail-Adresse bestätigen"
					value={email2}
					onChange={this._onChange.bind(null, 'email2')}
					onKeyPress={this._onEnter}
					fullWidth
					type="email"
				/>
				{(email !== email2 && email2 !== '') ? <p>Die E-Mail-Adressen sind nicht identisch!</p> : null}
				<TextField
					hint="Benutzername"
					value={username}
					onChange={this._onChange.bind(null, 'username')}
					onKeyPress={this._onEnter}
					fullWidth
				/>
				{(username.length > 0 && (username.length < 3 || username.length > 20)) ? <p>Der Benutzername muss zwischen 3 und 20 Zeichen lang sein!</p> : null}
				<TextField
					hint="Passwort"
					value={password}
					onChange={this._onChange.bind(null, 'password')}
					onKeyPress={this._onEnter}
					fullWidth
					type="password"
				/>
				{(password.length > 0 && (password.length < 5 || password.length > 20)) ? <p>Das Passwort muss zwischen 5 und 20 Zeichen lang sein!</p> : null}
				<TextField
					hint="Passwort bestätigen"
					value={password2}
					onChange={this._onChange.bind(null, 'password2')}
					onKeyPress={this._onEnter}
					fullWidth
					type="password"
				/>
				{(password !== password2 && password2 !== '') ? <p>Die Passwörter sind nicht identisch!</p> : null}
			</Dialog>
		);
		
	}
}

export default Register;
