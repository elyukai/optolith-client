import * as AuthActions from '../../actions/AuthActions';
import * as React from 'react';
import createOverlay, { close } from '../../utils/createOverlay';
import Dialog from '../../components/Dialog';
import Login from './Login';
import TextField from '../../components/TextField';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	email: string;
}

export default class ForgotPassword extends React.Component<Props, State> {
	state = {
		email: ''
	};

	forgotPassword = () => AuthActions.requestPasswordReset(this.state.email);
	back = () => createOverlay(<Login />);

	_onChange = (event: InputTextEvent) => this.setState({ email: event.target.value } as State);
	_onEnter = (event: InputKeyEvent) => {
		if (event.charCode === 13 && this.state.email !== '') {
			this.forgotPassword();
			close(this.props.node!);
		}
	};

	render() {

		const { email } = this.state;

		return (
			<Dialog id="forgotpassword" title="Passwort vergessen" node={this.props.node} buttons={[
				{
					label: 'E-Mail anfordern',
					onClick: this.forgotPassword,
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
					onKeyDown={this._onEnter}
					type="email"
					fullWidth
				/>
			</Dialog>
		);

	}
}
