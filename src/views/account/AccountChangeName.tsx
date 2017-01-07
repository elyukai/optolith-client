import AccountActions from '../../_actions/AccountActions';
import IconButton from '../../components/IconButton';
import * as React from 'react';
import { Component } from 'react';
import TextField from '../../components/TextField';
import InputButtonGroup from '../../components/InputButtonGroup';

const ERROR_MESSAGE = 'Der Benutzername muss mindestens 3 und darf maximal 20 Zeichen umfassen.';

interface State {
	newName: string;
}

export default class Account extends Component<any, State> {

	state = {
		newName: ''
	};

	handleName = event => this.setState({ newName: event.target.value });
	changeName = () => AccountActions.changeUsername(this.state.newName);

	render() {

		const { newName } = this.state;

		return (
			<div className="change change-name">
				<InputButtonGroup>
					<TextField
						hint="Benutzernamen ändern"
						value={newName}
						onChange={this.handleName}
						/>
					<IconButton
						icon="&#xE876;"
						onClick={this.changeName}
						disabled={newName === '' || newName.length < 3 || newName.length > 20}
						/>
				</InputButtonGroup>
				<div className="padding">
					{(newName.length < 3 || newName.length > 20) && newName !== '' ? ERROR_MESSAGE : null}
				</div>
			</div>
		);
	}
}
