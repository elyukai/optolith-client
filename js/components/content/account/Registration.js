import AccountActions from '../../../actions/AccountActions';
import TabActions from '../../../actions/TabActions';
import React, { Component } from 'react';

class Registration extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			email2: '',
			username: '',
			password: '',
			password2: ''
		};
	}
	
	register = () => AccountActions.register(this.state.email, this.state.username, this.state.password);
	
	back = () => TabActions.openTab('login');
	
	_onChange = (option, event) => this.setState({ [option]: event.target.value });
	
	_onEnter = event => {
		if (event.charCode === 13 && equal(this.state.email, this.state.email2) && equal(this.state.password, this.state.password2) && this.state.username != '') this.register();
	};

	render() {
		return (
			<AccountContainer id="registration">
				<h2 className="header">Registrieren</h2>
				<TextField
					hint="E-Mail-Adresse"
					value={this.state.email}
					onChange={this._onChange.bind(null, 'email')}
					onKeyPress={this._onEnter}
					fullWidth
					type="email"
				/>
				<TextField
					hint="E-Mail-Adresse bestätigen"
					value={this.state.email2}
					onChange={this._onChange.bind(null, 'email2')}
					onKeyPress={this._onEnter}
					fullWidth
					type="email"
				/>
				{(this.state.email != this.state.email2 && this.state.email2 != '') ? <p>Die E-Mail-Adressen sind nicht identisch!</p> : null}
				<TextField
					hint="Benutzername"
					value={this.state.username}
					onChange={this._onChange.bind(null, 'username')}
					onKeyPress={this._onEnter}
					fullWidth
				/>
				<TextField
					hint="Passwort"
					value={this.state.password}
					onChange={this._onChange.bind(null, 'password')}
					onKeyPress={this._onEnter}
					fullWidth
					type="password"
				/>
				<TextField
					hint="Passwort bestätigen"
					value={this.state.password2}
					onChange={this._onChange.bind(null, 'password2')}
					onKeyPress={this._onEnter}
					fullWidth
					type="password"
				/>
				{(this.state.password != this.state.password2 && this.state.password2 != '') ? <p>Die Passwörter sind nicht identisch!</p> : null}
				<BorderButton label="Registrieren" onClick={this.register} primary fullWidth disabled={!(equal(this.state.email, this.state.email2) && equal(this.state.password, this.state.password2) && this.state.username != '')} />
				<p>
					<span className="link" onClick={this.back}>
						Zurück zur Anmeldeseite
					</span>
				</p>
			</AccountContainer>
		);
	}
}

export default Registration;
