import * as React from 'react';
import { AdvantagesContainer } from '../containers/Advantages';
import { ArmorZonesContainer } from '../containers/ArmorZones';
import { AttributesContainer } from '../containers/Attributes';
import { CombatTechniquesContainer } from '../containers/CombatTechniques';
import { CulturesContainer } from '../containers/Cultures';
import { DisadvantagesContainer } from '../containers/Disadvantages';
import { EquipmentContainer } from '../containers/Equipment';
import { HelpContainer } from '../containers/HelpContainer';
import { HerolistContainer } from '../containers/Herolist';
import { LiturgiesContainer } from '../containers/Liturgies';
import { PersonalDataContainer } from '../containers/PersonalData';
import { PetsContainer } from '../containers/Pets';
import { ProfessionsContainer } from '../containers/Professions';
import { RacesContainer } from '../containers/Races';
import { RulesContainer } from '../containers/Rules';
import { SheetsContainer } from '../containers/Sheets';
import { SpecialAbilitiesContainer } from '../containers/SpecialAbilities';
import { SpellsContainer } from '../containers/Spells';
import { TalentsContainer } from '../containers/Talents';
import { WikiContainer } from '../containers/Wiki';
import { UIMessages } from '../types/ui';
import { TabId } from '../utils/LocationUtils';
import { Imprint } from './about/Imprint';
import { LastChanges } from './about/LastChanges';
import { ThirdPartyLicenses } from './about/ThirdPartyLicenses';
import { Grouplist } from './grouplist/Grouplist';
// import { Master } from './master/Master';

export interface RouteProps {
	id: TabId;
	locale: UIMessages;
	setTab(id: TabId): void;
}

export function Route(props: RouteProps) {
	const { id, locale, setTab } = props;

	const VIEWS = {
		herolist: <HerolistContainer locale={locale} />,
		grouplist: <Grouplist />,
		wiki: <WikiContainer locale={locale} />,
		faq: <HelpContainer locale={locale} />,
		imprint: <Imprint locale={locale} />,
		thirdPartyLicenses: <ThirdPartyLicenses />,
		lastChanges: <LastChanges />,

		profile: <PersonalDataContainer locale={locale} />,
		personalData: <PersonalDataContainer locale={locale} />,
		characterSheet: <SheetsContainer locale={locale} />,
		rules: <RulesContainer locale={locale} />,

		races: <RacesContainer locale={locale} switchToCultures={() => setTab('cultures')} />,
		cultures: <CulturesContainer locale={locale} switchToProfessions={() => setTab('professions')} />,
		professions: <ProfessionsContainer locale={locale} />,

		attributes: <AttributesContainer locale={locale} />,

		advantages: <AdvantagesContainer locale={locale} />,
		disadvantages: <DisadvantagesContainer locale={locale} />,

		skills: <TalentsContainer locale={locale} />,
		combatTechniques: <CombatTechniquesContainer locale={locale} />,
		specialAbilities: <SpecialAbilitiesContainer locale={locale} />,
		spells: <SpellsContainer locale={locale} />,
		liturgicalChants: <LiturgiesContainer locale={locale} />,

		equipment: <EquipmentContainer locale={locale} />,
		zoneArmor: <ArmorZonesContainer locale={locale} />,
		pets: <PetsContainer locale={locale} />,

		// master: <Master />
	};

	return VIEWS[id] || null;
}
