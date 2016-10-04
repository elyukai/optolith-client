import TabActions from '../../../actions/TabActions';
import React, { Component } from 'react';

class RegistrationConfirm extends Component {
	
	constructor(props) {
		super(props);
		this._back = this._back.bind(this);
	}
	
	_back = () => TabActions.openTab('login');
	
	render() {
		return (
			<AccountContainer id="confirmregistration">
				<h2 className="header">Konto bestätigen</h2>
				<p>
					Wir haben dir eine E-Mail an die angegebene Adresse geschickt. Dort wirst du einen Bestätigungslink finden, dem du einfach nur zu folgen brauchst, um dein Konto zu aktivieren.
				</p>
				<p>
					<span className="link" onClick={this._back}>
						Zurück zur Anmeldeseite
					</span>
				</p>
			</AccountContainer>
		);
	}
}

export default RegistrationConfirm;
