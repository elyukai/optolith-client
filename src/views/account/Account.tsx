import * as React from 'react';
import * as AuthActions from '../../actions/AuthActions';
import { BorderButton } from '../../components/BorderButton';
import { Scroll } from '../../components/Scroll';
import { AccountChangeName } from './AccountChangeName';
import { AccountChangePassword } from './AccountChangePassword';

export class Account extends React.Component<{}, undefined> {
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
