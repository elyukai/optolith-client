import * as AuthActions from '../../actions/AuthActions';
import * as React from 'react';
import createOverlay, { close } from '../../utils/createOverlay';
import Dialog from '../../components/Dialog';
import ForgotPassword from './ForgotPassword';
import ForgotUsername from './ForgotUsername';
import Register from './Register';
import ResendActivation from './ResendActivation';
import TextField from '../../components/TextField';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	username: string;
	password: string;
}

export default class Login extends React.Component<Props, State> {
	state = {
		username: '',
		password: ''
	};

	login = () => AuthActions.requestLogin(this.state.username, this.state.password);
	forgotUsername = () => { createOverlay(<ForgotUsername />); close(this.props.node!); };
	forgotPassword = () => { createOverlay(<ForgotPassword />); close(this.props.node!); };
	register = () => createOverlay(<Register />);
	resendActivation = () => { createOverlay(<ResendActivation />); close(this.props.node!); };

	_onChange = (option: 'username' | 'password', event: InputTextEvent) => this.setState({ [option]: event.target.value } as State);
	_onEnter = (event: InputKeyEvent) => {
		if (event.charCode === 13 && this.state.username !== '' && this.state.password !== '') {
			this.login();
			close(this.props.node!);
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
					onKeyDown={this._onEnter}
					fullWidth
				/>
				<TextField
					hint="Passwort"
					value={password}
					onChange={this._onChange.bind(null, 'password')}
					onKeyDown={this._onEnter}
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
