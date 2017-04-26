import * as React from 'react';
import { About } from './about/About';
import { Account } from './account/Account';
import { AttributesController } from './attributes/AttributesController';
import { Belongings } from './belongings/Belongings';
import { DisAdv } from './disadv/DisAdv';
import { Grouplist } from './grouplist/Grouplist';
import { Herolist } from './herolist/Herolist';
import { Home } from './home/Home';
// import { Master } from './master/Master';
import { Profile } from './profile/Profile';
import { RCP } from './rcp/RCP';
import { Skills } from './skills/Skills';

export interface RouteProps {
	id: string;
}

type TabId = 'home' | 'herolist' | 'grouplist' | 'account' | 'about' | 'rcp' | 'profile' | 'attributes' | 'disadv' | 'skills' | 'belongings';

export function Route(props: RouteProps) {
	const VIEWS = {
		home: <Home />,
		herolist: <Herolist />,
		grouplist: <Grouplist />,
		account: <Account />,
		about: <About />,

		rcp: <RCP />,
		profile: <Profile />,
		attributes: <AttributesController />,
		disadv: <DisAdv />,
		skills: <Skills />,
		belongings: <Belongings />

		// master: <Master />
	};

	return VIEWS[props.id as TabId] || null;
}
