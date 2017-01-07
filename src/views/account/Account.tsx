import AccountActions from '../../_actions/AccountActions';
import AccountChangeName from './AccountChangeName';
import AccountChangePassword from './AccountChangePassword';
import BorderButton from '../../components/BorderButton';
import * as React from 'react';
import { Component } from 'react';
import Scroll from '../../components/Scroll';

export default class Account extends Component<any, any> {

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
