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

export default class ResendActivation extends React.Component<Props, State> {
	state = {
		email: ''
	};

	resendActivation = () => AuthActions.requestAccountActivationEmail(this.state.email);
	back = () => createOverlay(<Login />);

	_onChange = (event: Event) => this.setState({ email: event.target.value });
	_onEnter = (event: Event) => {
		if (event.charCode === 13 && this.state.email !== '') {
			this.resendActivation();
			close(this.props.node!);
		}
	};

	render() {

		const { email } = this.state;

		return (
			<Dialog id="resendactivation" title="Aktivierungslink erneut senden" node={this.props.node} buttons={[
				{
					label: 'E-Mail anfordern',
					onClick: this.resendActivation,
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
