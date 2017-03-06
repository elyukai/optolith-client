import * as React from 'react';
import * as AuthActions from '../../actions/AuthActions';
import IconButton from '../../components/IconButton';
import InputButtonGroup from '../../components/InputButtonGroup';
import TextField from '../../components/TextField';

const ERROR_MESSAGE = 'Das Passwort muss mindestens 5 und darf maximal 20 Zeichen umfassen.';

interface State {
	newPassword: string;
}

export default class Account extends React.Component<undefined, State> {
	state = {
		newPassword: '',
	};

	handlePassword = (event: InputTextEvent) => this.setState({ newPassword: event.target.value } as State);
	changePassword = () => AuthActions.requestNewPassword(this.state.newPassword);

	render() {

		const { newPassword } = this.state;

		return (
			<div className="change change-password">
				<InputButtonGroup>
					<TextField
						hint="Passwort ändern"
						value={newPassword}
						onChange={this.handlePassword}
						/>
					<IconButton
						icon="&#xE876;"
						onClick={this.changePassword}
						disabled={newPassword === '' || newPassword.length < 5 || newPassword.length > 20}
						/>
				</InputButtonGroup>
				<div className="padding">
					{(newPassword.length < 5 || newPassword.length > 20) && newPassword !== '' ? ERROR_MESSAGE : null}
				</div>
			</div>
		);
	}
}
