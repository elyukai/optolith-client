import AccountActions from '../../../actions/AccountActions';
import AccountStore from '../../../stores/core/AccountStore';
import BorderButton from '../../layout/BorderButton';
import IconButton from '../../layout/IconButton';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';
import TextField from '../../layout/TextField';
import TextFieldButtonGroup from '../../layout/TextFieldButtonGroup';

class Account extends Component {

	state = {
		newName: '',
		newPassword: ''
	};

	handleName = event => this.setState({ newName: event.target.value });
	changeName = () => AccountActions.changeUsername(this.state.newName);
	handlePassword = event => this.setState({ newPassword: event.target.value });
	changePassword = () => AccountActions.changePassword(this.state.newPassword);
	delete = () => AccountActions.deleteConfirm();

	render() {
		return (
			<section id="account">
				<div className="page">
					<Scroll>
						<TextFieldButtonGroup>
							<TextField
								hint="Benutzernamen ändern"
								value={this.state.newName}
								onChange={this.handleName}
								/>
							<IconButton
								icon="&#xE876;"
								onClick={this.changeName}
								disabled={this.state.newName === '' || this.state.newName.length < 3 || this.state.newName.length > 20}
								/>
						</TextFieldButtonGroup>
						<div className="padding">
							{(this.state.newName.length < 3 || this.state.newName.length > 20) && this.state.newName !== '' ? 'Der Benutzername muss mindestens 3 und darf maximal 20 Zeichen umfassen.' : null}
						</div>
						<TextFieldButtonGroup>
							<TextField
								hint="Passwort ändern"
								value={this.state.newPassword}
								onChange={this.handlePassword}
								/>
							<IconButton
								icon="&#xE876;"
								onClick={this.changePassword}
								disabled={this.state.newPassword === '' || this.state.newPassword.length < 5 || this.state.newPassword.length > 20}
								/>
						</TextFieldButtonGroup>
						<div className="padding">
							{(this.state.newPassword.length < 5 || this.state.newPassword.length > 20) && this.state.newPassword !== '' ? 'Das Passwort muss mindestens 5 und darf maximal 20 Zeichen umfassen.' : null}
						</div>
						<BorderButton 
							label="Konto löschen"
							onClick={this.delete}
							/>
					</Scroll>
				</div>
			</section>
		);
	}
}

export default Account;
