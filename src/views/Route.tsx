import * as React from 'react';
import About from './about/About';
import Account from './account/Account';
import Attribute from './attributes/AttributesController';
import Belongings from './belongings/Belongings';
import DisAdv from './disadv/DisAdv';
import Grouplist from './grouplist/Grouplist';
import Herolist from './herolist/Herolist';
import Home from './home/Home';
// import Master from './master/Master';
import Profile from './profile/Profile';
import RCP  from './rcp/RCP';
import Skills from './skills/Skills';

interface Props {
	id: string;
}

type TabId = 'home' | 'herolist' | 'grouplist' | 'account' | 'about' | 'rcp' | 'profile' | 'attributes' | 'disadv' | 'skills' | 'belongings';

export default class Route extends React.Component<Props, undefined> {
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
			belongings: <Belongings />

			// master: <Master />
		};

		return VIEWS[this.props.id as TabId] || null;
	}
}
