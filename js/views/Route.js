import About from './about/About';
import Account from './account/Account';
import Attribute from './attributes/AttributesController';
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

export default class Route extends Component {

	static propTypes = {
		id: PropTypes.string.isRequired
	};

	render() {

		const VIEWS = {
			home: <Home />,
			herolist: <Herolist />,
			grouplist: <Grouplist />,
			account: <Account />,
			about: <About />,
			
			rcp: <RCP />,
			profile: <Profile />,
			attributes: <Attribute />,
			disadv: <DisAdv />,
			skills: <Skills />,
			items: <Items />,

			master: <Master />
		};

		return VIEWS[this.props.id] || null;
	}
}
