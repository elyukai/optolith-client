import About from './about/About';
import Account from './account/Account';
import Attribute from './attributes/Attribute';
import DisAdv from './disadv/DisAdv';
import Grouplist from './grouplist/Grouplist';
import Herolist from './herolist/Herolist';
import Home from './home/Home';
import Items from './items/Items';
import Master from './master/Master';
import Profile from './profile/Profile';
import React, { Component, PropTypes } from 'react';
import RCP  from './rcp/RCP';
import Skills from './skills/Skills';
import TitleBar from '../layout/TitleBar';

class Content extends Component {

	static propTypes = {
		section: PropTypes.string.isRequired,
		tab: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
	}

	render() {

		var tabElement;

		switch (this.props.tab) {
			case 'home':
				tabElement = <Home />;
				break;
			case 'herolist':
				tabElement = <Herolist />;
				break;
			case 'grouplist':
				tabElement = <Grouplist />;
				break;
			case 'account':
				tabElement = <Account />;
				break;
			case 'about':
				tabElement = <About />;
				break;

			case 'rcp':
				tabElement = <RCP />;
				break;
			case 'profile':
				tabElement = <Profile />;
				break;
			case 'attributes':
				tabElement = <Attribute />;
				break;
			case 'disadv':
				tabElement = <DisAdv />;
				break;
			case 'skills':
				tabElement = <Skills />;
				break;
			case 'items':
				tabElement = <Items />;
				break;
				
			case 'master':
				tabElement = <Master />;
				break;
		}

		return (
			<main>
				<TitleBar {...this.props} />
				{tabElement}
			</main>
		);
	}
}

export default Content;
