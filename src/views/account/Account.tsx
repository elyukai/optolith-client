import * as AuthActions from '../../actions/AuthActions';
import * as React from 'react';
import AccountChangeName from './AccountChangeName';
import AccountChangePassword from './AccountChangePassword';
import BorderButton from '../../components/BorderButton';
import Scroll from '../../components/Scroll';

export default class Account extends React.Component<undefined, undefined> {
	delete = () => AuthActions.requestUserDeletion();

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
