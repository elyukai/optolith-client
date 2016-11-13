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
import React from 'react';
import RCP  from './rcp/RCP';
import Skills from './skills/Skills';

export default props => {
	const { id } = props;
	switch (id) {
		case 'home':
			return <Home />;
		case 'herolist':
			return <Herolist />;
		case 'grouplist':
			return <Grouplist />;
		case 'account':
			return <Account />;
		case 'about':
			return <About />;
		case 'rcp':
			return <RCP />;
		case 'profile':
			return <Profile />;
		case 'attributes':
			return <Attribute />;
		case 'disadv':
			return <DisAdv />;
		case 'skills':
			return <Skills />;
		case 'items':
			return <Items />;
		case 'master':
			return <Master />;
		default:
			return null;
	}
};
