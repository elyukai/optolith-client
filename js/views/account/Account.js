import AccountActions from '../../actions/AccountActions';
import AccountChangeName from './AccountChangeName';
import AccountChangePassword from './AccountChangePassword';
import BorderButton from '../../components/BorderButton';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';

export default class Account extends Component {

	delete = () => AccountActions.deleteConfirm();

	render() {
		return (
			<section id="account">
				<div className="page">
					<Scroll>
						<AccountChangeName />
						<AccountChangePassword />
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
