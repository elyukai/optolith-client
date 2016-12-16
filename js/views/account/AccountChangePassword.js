import AccountActions from '../../actions/AccountActions';
import IconButton from '../../components/IconButton';
import React, { Component } from 'react';
import TextField from '../../components/TextField';
import InputButtonGroup from '../../components/InputButtonGroup';

const ERROR_MESSAGE = 'Das Passwort muss mindestens 5 und darf maximal 20 Zeichen umfassen.';

export default class Account extends Component {

	state = {
		newPassword: ''
	};

	handlePassword = event => this.setState({ newPassword: event.target.value });
	changePassword = () => AccountActions.changePassword(this.state.newPassword);

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
