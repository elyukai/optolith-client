import * as React from 'react';
import { AttributesContainer } from '../containers/Attributes';
import { HerolistContainer } from '../containers/Herolist';
import { ProfileContainer } from '../containers/Profile';
import { SkillsContainer } from '../containers/Skills';
import { UIMessages } from '../types/ui';
import { About } from './about/About';
import { Belongings } from './belongings/Belongings';
import { AdvantagesDisadvantages } from './disadv/DisAdv';
import { Grouplist } from './grouplist/Grouplist';
// import { Master } from './master/Master';
import { RCP } from './rcp/RCP';

export interface RouteProps {
	id: string;
	locale: UIMessages;
}

export function Route(props: RouteProps) {
	const { id, locale } = props;

	const VIEWS = {
		herolist: <HerolistContainer locale={locale} />,
		grouplist: <Grouplist />,
		about: <About locale={locale} />,

		rcp: <RCP />,
		profile: <ProfileContainer locale={locale} />,
		attributes: <AttributesContainer locale={locale} />,
		disadv: <AdvantagesDisadvantages locale={locale} />,
		skills: <SkillsContainer locale={locale} />,
		belongings: <Belongings />

		// master: <Master />
	};

	return VIEWS[id as keyof typeof VIEWS] || null;
}
