import AccountActions from '../../../actions/AccountActions';
import TabActions from '../../../actions/TabActions';
import React, { Component } from 'react';

class ChangeAccount extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			value1: '',
			value2: ''
		};
	}
	
	changeUsername = () => AccountActions.changeUsername(this.state.value1);
	
	changePassword = () => AccountActions.changePassword(this.state.value1);
	
	back = () => TabActions.openTab('list');
	
	_onChange = (option, event) => this.setState({ [option]: event.target.value });
	
	_change = () => {
		if (this.props.type == 'username') {
			this.changeUsername();
		}
		else if (this.props.type == 'password') {
			this.changePassword();
		}
	};
	
	_onEnter = event => {
		if (event.charCode === 13 && this.state.value1 != '' && this.state.value1 == this.state.value2) this._change();
	};

	render() {
		return (
			<AccountContainer id="changeaccount">
				<h2 className="header">{this.props.type == 'username' ? 'Kontonamen ändern' : 'Passwort ändern'}</h2>
				<TextField
					hint={this.props.type == 'username' ? 'Benutzername' : 'Passwort'}
					value={this.state.value1}
					onChange={this._onChange.bind(null, 'value1')}
					onKeyPress={this._onEnter}
					type={this.props.type == 'password' ? 'password' : undefined}
					fullWidth
				/>
				<TextField
					hint={this.props.type == 'username' ? 'Benutzernamen bestätigen' : 'Passwort bestätigen'}
					value={this.state.value2}
					onChange={this._onChange.bind(null, 'value2')}
					onKeyPress={this._onEnter}
					type={this.props.type == 'password' ? 'password' : undefined}
					fullWidth
				/>
				<BorderButton label="Ändern" onClick={this._change} primary fullWidth disabled={!equal(this.state.value1, this.state.value2)}
				/>
				{this.state.value1 !== this.state.value2 && this.state.value2 !== '' ? <p key="change-account-warning">{this.props.type == 'username' ? 'Die Benutzernamen sind nicht identisch!' : 'Die Passwörter sind nicht identisch!'}</p> : null}
				<p>
					<span className="link" onClick={this.back}>
						Zurück
					</span>
				</p>
			</AccountContainer>
		);
	}
}

ChangeAccount.propTypes = {
	type: React.PropTypes.string.isRequired
};

export default ChangeAccount;
