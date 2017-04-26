import * as React from 'react';
import * as AuthActions from '../../actions/AuthActions';
import { Dialog } from '../../components/Dialog';
import { TextField } from '../../components/TextField';
import { InputKeyEvent, InputTextEvent } from '../../types/data.d';
import { close, createOverlay } from '../../utils/createOverlay';
import { Login } from './Login';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	email: string;
}

export class ResendActivation extends React.Component<Props, State> {
	state = {
		email: '',
	};

	resendActivation = () => AuthActions.requestAccountActivationEmail(this.state.email);
	back = () => createOverlay(<Login />);

	_onChange = (event: InputTextEvent) => this.setState({email: event.target.value } as State);
	_onEnter = (event: InputKeyEvent) => {
		if (event.charCode === 13 && this.state.email !== '') {
			this.resendActivation();
			close(this.props.node!);
		}
	}

	render() {

		const { email } = this.state;

		return (
			<Dialog id="resendactivation" title="Aktivierungslink erneut senden" node={this.props.node} buttons={[
				{
					disabled: email === '',
					label: 'E-Mail anfordern',
					onClick: this.resendActivation,
					primary: true,
				},
				{
					label: 'Zurück',
					onClick: this.back,
				},
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
