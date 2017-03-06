import * as React from 'react';
import * as AuthActions from '../../actions/AuthActions';
import Dialog from '../../components/Dialog';
import TextField from '../../components/TextField';
import createOverlay, { close } from '../../utils/createOverlay';
import ForgotPassword from './ForgotPassword';
import ForgotUsername from './ForgotUsername';
import Register from './Register';
import ResendActivation from './ResendActivation';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	username: string;
	password: string;
}

export default class Login extends React.Component<Props, State> {
	state = {
		password: '',
		username: '',
	};

	login = () => AuthActions.requestLogin(this.state.username, this.state.password);
	forgotUsername = () => { createOverlay(<ForgotUsername />); close(this.props.node!); };
	forgotPassword = () => { createOverlay(<ForgotPassword />); close(this.props.node!); };
	register = () => createOverlay(<Register />);
	resendActivation = () => { createOverlay(<ResendActivation />); close(this.props.node!); };

	changeUsername = (event: InputTextEvent) => this.setState({ username: event.target.value } as State);
	changePassword = (event: InputTextEvent) => this.setState({ password: event.target.value } as State);
	_onEnter = (event: InputKeyEvent) => {
		if (event.charCode === 13 && this.state.username !== '' && this.state.password !== '') {
			this.login();
			close(this.props.node!);
		}
	}

	render() {

		const { username, password } = this.state;

		return (
			<Dialog
				id="login"
				title="Anmelden"
				node={this.props.node}
				buttons={[
					{
						disabled: username === '' || password === '',
						label: 'Anmelden',
						onClick: this.login,
						primary: true,
					},
					{
						label: 'Registrieren',
						onClick: this.register,
					},
				]}
				>
				<TextField
					hint="Benutzername"
					value={username}
					onChange={this.changeUsername}
					onKeyDown={this._onEnter}
					fullWidth
					/>
				<TextField
					hint="Passwort"
					value={password}
					onChange={this.changePassword}
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
