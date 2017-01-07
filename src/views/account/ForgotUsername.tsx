import AccountActions from '../../_actions/AccountActions';
import createOverlay, { close } from '../../utils/createOverlay';
import Dialog from '../../components/Dialog';
import Login from './Login';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	email: string;
}

export default class ForgotUsername extends Component<Props, State> {

	static propTypes = {
		node: PropTypes.any
	};

	state = {
		email: ''
	};

	forgotUsername = () => AccountActions.forgotUsername(this.state.email);
	back = () => createOverlay(<Login />);

	_onChange = event => this.setState({ email: event.target.value });
	_onEnter = event => {
		if (event.charCode === 13 && this.state.email !== '') {
			this.forgotUsername();
			close(this.props.node);
		}
	};

	render() {

		const { email } = this.state;

		return (
			<Dialog id="forgotusername" title="Benutzername vergessen" node={this.props.node} buttons={[
				{
					label: 'E-Mail anfordern',
					onClick: this.forgotUsername,
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
