import React, { Component } from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';

class AccountContainer extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		return (
			<main className="center">
				<GeminiScrollbar className="account-scroll">
					<section className="account" id={this.props.id}>
						<div className="account-inner">
							{this.props.children}
						</div>
					</section>
				</GeminiScrollbar>
			</main>
		);
	}
}

export default AccountContainer;
