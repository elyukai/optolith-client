import * as React from 'react';
import * as AuthActions from '../../actions/AuthActions';
import { Dialog } from '../../components/Dialog';
import { TextField } from '../../components/TextField';
import { InputKeyEvent, InputTextEvent } from '../../types/data.d';
import { close, createOverlay } from '../../utils/createOverlay';
import { Login } from './Login';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	displayName: string;
	email: string;
	email2: string;
	username: string;
	password: string;
	password2: string;
}

function _validateEmail(email: string): boolean {
	const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

export class Register extends React.Component<Props, State> {
	state = {
		displayName: '',
		email: '',
		email2: '',
		password: '',
		password2: '',
		username: '',
	};

	register = () => AuthActions.requestRegistration(this.state.email, this.state.username, this.state.displayName, this.state.password);
	back = () => createOverlay(<Login />);

	changeDisplayName = (event: InputTextEvent) => this.setState({ displayName: event.target.value } as State);
	changeEmail = (event: InputTextEvent) => this.setState({ email: event.target.value } as State);
	changeEmailConfirm = (event: InputTextEvent) => this.setState({ email2: event.target.value } as State);
	changeUsername = (event: InputTextEvent) => this.setState({ username: event.target.value } as State);
	changePassword = (event: InputTextEvent) => this.setState({ password: event.target.value } as State);
	changePasswordConfirm = (event: InputTextEvent) => this.setState({ password2: event.target.value } as State);
	_onEnter = (event: InputKeyEvent) => {
		const { email, email2, username, password, password2, displayName } = this.state;
		if (event.charCode === 13 &&
			email !== '' &&
			_validateEmail(email) &&
			email === email2 &&
			username !== '' &&
			username.length >= 3 &&
			username.length <= 20 &&
			displayName !== '' &&
			displayName.length >= 3 &&
			displayName.length <= 20 &&
			password !== '' &&
			password.length >= 5 &&
			password.length <= 20 &&
			password === password2) {
			this.register();
			close(this.props.node!);
		}
	}

	render() {

		const { email, email2, username, password, password2, displayName } = this.state;

		return (
			<Dialog id="login" title="Registrieren" node={this.props.node} buttons={[
				{
					disabled:
						email === '' ||
						!_validateEmail(email) ||
						email !== email2 ||
						username === '' ||
						username.length < 3 ||
						username.length > 20 ||
						displayName === '' ||
						displayName.length < 3 ||
						displayName.length > 20 ||
						password === '' ||
						password.length < 5 ||
						password.length > 20 ||
						password !== password2,
					label: 'Registrieren',
					onClick: this.register,
					primary: true,
				},
				{
					label: 'Zurück',
					onClick: this.back,
				},
			]}>
				<TextField
					hint="E-Mail-Adresse"
					value={email}
					onChange={this.changeEmail}
					onKeyDown={this._onEnter}
					fullWidth
					type="email"
				/>
				{email !== '' && !_validateEmail(email) ? <p>Es wurde keine gültige Email-Adresse eingegeben!</p> : null}
				<TextField
					hint="E-Mail-Adresse bestätigen"
					value={email2}
					onChange={this.changeEmailConfirm}
					onKeyDown={this._onEnter}
					fullWidth
					type="email"
				/>
				{(email !== email2 && email2 !== '') ? <p>Die E-Mail-Adressen sind nicht identisch!</p> : null}
				<TextField
					hint="Benutzername"
					value={username}
					onChange={this.changeUsername}
					onKeyDown={this._onEnter}
					fullWidth
				/>
				{(username.length > 0 && (username.length < 3 || username.length > 20)) ? <p>Der Benutzername muss zwischen 3 und 20 Zeichen lang sein!</p> : null}
				<TextField
					hint="Anzeigename"
					value={displayName}
					onChange={this.changeDisplayName}
					onKeyDown={this._onEnter}
					fullWidth
				/>
				{(displayName.length > 0 && (displayName.length < 3 || displayName.length > 20)) ? <p>Der Anzeigename muss zwischen 3 und 20 Zeichen lang sein!</p> : null}
				<TextField
					hint="Passwort"
					value={password}
					onChange={this.changePassword}
					onKeyDown={this._onEnter}
					fullWidth
					type="password"
				/>
				{(password.length > 0 && (password.length < 5 || password.length > 20)) ? <p>Das Passwort muss zwischen 5 und 20 Zeichen lang sein!</p> : null}
				<TextField
					hint="Passwort bestätigen"
					value={password2}
					onChange={this.changePasswordConfirm}
					onKeyDown={this._onEnter}
					fullWidth
					type="password"
				/>
				{(password !== password2 && password2 !== '') ? <p>Die Passwörter sind nicht identisch!</p> : null}
			</Dialog>
		);

	}
}
