import Overview from './Overview';
import React, { Component } from 'react';
import Sheets from './Sheets';
import SubTabs from '../../layout/SubTabs';

class Profile extends Component {

	state = {
		tab: 'overview'
	};

	constructor(props) {
		super(props);
	}

	handleClick = tab => this.setState({ tab });

	render() {

		var element;

		switch (this.state.tab) {
			case 'overview':
				element = <Overview />;
				break;
			case 'sheets':
				element = <Sheets />;
				break;
		}

		return (
			<section id="profile">
				<SubTabs
					tabs={[
						{
							label: 'Übersicht',
							tag: 'overview'
						},
						// {
						// 	label: 'Hintergrund',
						// 	tag: 'background',
						// 	disabled: true
						// },
						{
							label: 'Heldenbogen',
							tag: 'sheets'
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}

export default Profile;
