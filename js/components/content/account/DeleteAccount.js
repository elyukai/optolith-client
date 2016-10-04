import AccountActions from '../../../actions/AccountActions';
import TabActions from '../../../actions/TabActions';
import React, { Component } from 'react';

class DeleteAccount extends Component {
	
	constructor(props) {
		super(props);
	}
	
	deleteAccount = () => AccountActions.deleteAccount();
	
	back = () => TabActions.openTab('list');
	
	render() {
		return (
			<AccountContainer id="deleteaccount">
				<h2 className="header">Konto löschen</h2>
				<p>
					Du bist dabei, dein Konto zu löschen.
				</p>
				<p>
					Diese Aktion kann NICHT rückgängig gemacht werden! Durch das Löschen des Kontos werden alle Helden und Gruppen, die diesem Konto gehören, ebenfalls gelöscht!
				</p>
				<p>
					Bist du dir GANZ sicher, dass du fortfahren möchtest?
				</p>
				<BorderButton label="Konto löschen" onClick={this.deleteAccount} primary fullWIdth />
				<p>
					<span className="link" onClick={this.back}>
						Zurück
					</span>
				</p>
			</AccountContainer>
		);
	}
}

export default DeleteAccount;
