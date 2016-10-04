import AccountActions from '../../../actions/AccountActions';
import TabActions from '../../../actions/TabActions';
import React, { Component } from 'react';

class ResendActivation extends Component {
	
	constructor(props) {
		super(props);
		this.state = { email: '' };
	}
	
	resendActivation = () => AccountActions.resendActivation(this.state.email);
	
	back = () => TabActions.openTab('login');
	
	_onChange = (option, event) => this.setState({ [option]: event.target.value });
	
	_onEnter = event => {
		if (event.charCode === 13 && this.state.email != '') this.resendActivation();
	};

	render() {
		return (
			<AccountContainer id="resendactivation">
				<h2 className="header">Aktivierungs-E-Mail erneut senden</h2>
				<TextField
					hint="Registrierte E-Mail-Adresse"
					value={this.state.email}
					onChange={this._onChange}
					onKeyPress={this._onEnter}
					fullWidth
					type="email"
				/>
				<BorderButton label="E-Mail anfordern" onClick={this.resendActivation} primary fullWidth disabled={this.state.email == ''} />
				<p>
					<span className="link" onClick={this.back}>
						Zurück zur Anmeldeseite
					</span>
				</p>
			</AccountContainer>
		);
	}
}

export default ResendActivation;
