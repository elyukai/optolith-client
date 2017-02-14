import * as AuthActions from '../../actions/AuthActions';
import * as React from 'react';
import IconButton from '../../components/IconButton';
import TextField from '../../components/TextField';
import InputButtonGroup from '../../components/InputButtonGroup';

const ERROR_MESSAGE = 'Das Passwort muss mindestens 5 und darf maximal 20 Zeichen umfassen.';

interface State {
	newPassword: string;
}

export default class Account extends React.Component<undefined, State> {
	state = {
		newPassword: ''
	};

	handlePassword = (event: Event) => this.setState({ newPassword: event.target.value });
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
