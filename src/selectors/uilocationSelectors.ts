import { createSelector } from 'reselect';
import { SubTab } from '../types/data';
import { translate } from '../utils/I18n';
import { isHeroSectionTab, isMainSectionTab, TabId } from '../utils/LocationUtils';
import { NavigationBarTabProps } from '../views/navigationbar/NavigationBarTabs';
import { isLiturgicalChantsTabAvailable } from './liturgiesSelectors';
import { isRemovingEnabled } from './phaseSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { isSpellsTabAvailable } from './spellsSelectors';
import { getCurrentCultureId, getCurrentRaceId, getCurrentTab, getLocaleMessages, getPhase } from './stateSelectors';

export const isMainSection = createSelector(
	getCurrentTab,
	tab => {
		return isMainSectionTab(tab);
	}
);

export const isHeroSection = createSelector(
	getCurrentTab,
	tab => {
		return isHeroSectionTab(tab);
	}
);

export const getTabs = createSelector(
	isMainSection,
	isHeroSection,
	getLocaleMessages,
	getPhase,
	isRemovingEnabled,
	(isMainSection, isHeroSection, locale, phase, isRemovingEnabled): NavigationBarTabProps[] => {
		if (isMainSection) {
			return [
				{
					id: 'herolist',
					label: translate(locale, 'titlebar.tabs.heroes'),
				},
				{
					id: 'grouplist',
					label: translate(locale, 'titlebar.tabs.groups'),
					disabled: true,
				},
				{
					id: 'wiki',
					label: translate(locale, 'titlebar.tabs.wiki'),
				},
				{
					id: 'faq',
					label: translate(locale, 'titlebar.tabs.faq'),
				},
				{
					id: 'imprint',
					label: translate(locale, 'titlebar.tabs.about'),
					subTabs: ['imprint', 'thirdPartyLicenses', 'lastChanges'],
				}
			];
		}
		else if (isHeroSection) {
			if (phase === 1) {
				return [
					{
						id: 'profile',
						label: translate(locale, 'titlebar.tabs.profile'),
						subTabs: ['profile', 'personalData', 'pact', 'rules'],
					},
					{
						id: 'races',
						label: translate(locale, 'titlebar.tabs.racecultureprofession'),
						subTabs: ['races', 'cultures', 'professions'],
					}
				];
			}
			else if (isRemovingEnabled) {
				return [
					{
						id: 'profile',
						label: translate(locale, 'titlebar.tabs.profile'),
						subTabs: ['profile', 'personalData', 'characterSheet', 'pact', 'rules'],
					},
					{
						id: 'attributes',
						label: translate(locale, 'titlebar.tabs.attributes'),
					},
					{
						id: 'advantages',
						label: translate(locale, 'titlebar.tabs.advantagesdisadvantages'),
						subTabs: ['advantages', 'disadvantages'],
					},
					{
						id: 'skills',
						label: translate(locale, 'titlebar.tabs.skills'),
						subTabs: ['skills', 'combatTechniques', 'specialAbilities', 'spells', 'liturgicalChants'],
					},
					{
						id: 'equipment',
						label: translate(locale, 'titlebar.tabs.belongings'),
						subTabs: ['equipment', 'zoneArmor', 'pets'],
					}
				];
			}
			return [
				{
					id: 'profile',
					label: translate(locale, 'titlebar.tabs.profile'),
					subTabs: ['profile', 'personalData', 'characterSheet', 'pact', 'rules'],
				},
				{
					id: 'attributes',
					label: translate(locale, 'titlebar.tabs.attributes'),
				},
				{
					id: 'skills',
					label: translate(locale, 'titlebar.tabs.skills'),
					subTabs: ['skills', 'combatTechniques', 'specialAbilities', 'spells', 'liturgicalChants'],
				},
				{
					id: 'equipment',
					label: translate(locale, 'titlebar.tabs.belongings'),
					subTabs: ['equipment', 'zoneArmor', 'pets'],
				}
			];
		}
		return [];
	}
);

export const getSubtabs = createSelector(
	getCurrentTab,
	isMainSection,
	isHeroSection,
	getLocaleMessages,
	getPhase,
	getCurrentRaceId,
	getCurrentCultureId,
	isSpellsTabAvailable,
	isLiturgicalChantsTabAvailable,
	getRuleBooksEnabled,
	(tab, isMainSection, isHeroSection, locale, phase, raceId, cultureId, isSpellsTabAvailable, isLiturgicalChantsTabAvailable, ruleBooksEnabled): SubTab[] | undefined => {
		let tabs: SubTab[] | undefined;

		if (locale) {
			if (isMainSection) {
				const aboutSubTabs: TabId[] = ['imprint', 'thirdPartyLicenses', 'lastChanges'];
				if (aboutSubTabs.includes(tab)) {
					tabs = [
						{
							id: 'imprint',
							label: translate(locale, 'titlebar.tabs.imprint'),
						},
						{
							id: 'thirdPartyLicenses',
							label: translate(locale, 'titlebar.tabs.thirdpartylicenses'),
						},
						{
							id: 'lastChanges',
							label: translate(locale, 'titlebar.tabs.lastchanges'),
						},
					];
				}
			}
			else if (isHeroSection) {
				if (phase === 1) {
					const profileSubTabs: TabId[] = ['profile', 'personalData', 'pact', 'rules'];
					const rcpSubTabs: TabId[] = ['races', 'cultures', 'professions'];
					if (profileSubTabs.includes(tab)) {
						tabs = [
							{
								id: 'profile',
								label: translate(locale, 'titlebar.tabs.profileoverview'),
							},
							{
								id: 'personalData',
								label: translate(locale, 'titlebar.tabs.personaldata'),
								disabled: true,
							},
							{
								id: 'pact',
								label: translate(locale, 'titlebar.tabs.pact'),
								disabled: locale.id !== 'de-DE'
							},
							{
								id: 'rules',
								label: translate(locale, 'titlebar.tabs.rules'),
							},
						];
					}
					else if (rcpSubTabs.includes(tab)) {
						tabs = [
							{
								id: 'races',
								label: translate(locale, 'titlebar.tabs.race'),
							},
						];

						if (typeof raceId === 'string') {
							tabs.push({
								id: 'cultures',
								label: translate(locale, 'titlebar.tabs.culture'),
							});
						}

						if (typeof cultureId === 'string') {
							tabs.push({
								id: 'professions',
								label: translate(locale, 'titlebar.tabs.profession'),
							});
						}
					}
				}
				else {
					const profileSubTabs: TabId[] = ['profile', 'personalData', 'characterSheet', 'pact', 'rules'];
					const disadvSubTabs: TabId[] = ['advantages', 'disadvantages'];
					const abilitiesSubTabs: TabId[] = ['skills', 'combatTechniques', 'specialAbilities', 'spells', 'liturgicalChants'];
					const belongingsSubTabs: TabId[] = ['equipment', 'zoneArmor', 'pets'];
					if (profileSubTabs.includes(tab)) {
						tabs = [
							{
								id: 'profile',
								label: translate(locale, 'titlebar.tabs.profileoverview'),
							},
							{
								id: 'personalData',
								label: translate(locale, 'titlebar.tabs.personaldata'),
								disabled: true,
							},
							{
								id: 'pact',
								label: translate(locale, 'titlebar.tabs.pact'),
								disabled: locale.id !== 'de-DE',
							},
							{
								id: 'rules',
								label: translate(locale, 'titlebar.tabs.rules'),
							},
						];

						if (phase === 3) {
							tabs.splice(2, 0, {
								id: 'characterSheet',
								label: translate(locale, 'titlebar.tabs.charactersheet'),
							});
						}
					}
					else if (disadvSubTabs.includes(tab)) {
						tabs = [
							{
								id: 'advantages',
								label: translate(locale, 'titlebar.tabs.advantages'),
							},
							{
								id: 'disadvantages',
								label: translate(locale, 'titlebar.tabs.disadvantages'),
							},
						];
					}
					else if (abilitiesSubTabs.includes(tab)) {
						tabs = [
							{
								id: 'skills',
								label: translate(locale, 'titlebar.tabs.talents'),
							},
							{
								id: 'combatTechniques',
								label: translate(locale, 'titlebar.tabs.combattechniques'),
							},
							{
								id: 'specialAbilities',
								label: translate(locale, 'titlebar.tabs.specialabilities'),
							},
						];

						if (isSpellsTabAvailable) {
							tabs.push({
								id: 'spells',
								label: translate(locale, 'titlebar.tabs.spells'),
							});
						}

						if (isLiturgicalChantsTabAvailable) {
							tabs.push({
								id: 'liturgicalChants',
								label: translate(locale, 'titlebar.tabs.liturgies'),
							});
						}
					}
					else if (belongingsSubTabs.includes(tab)) {
						tabs = [
							{
								id: 'equipment',
								label: translate(locale, 'titlebar.tabs.equipment'),
							},
							{
								id: 'pets',
								label: translate(locale, 'titlebar.tabs.pets'),
							},
						];

						if (locale.id === 'de-DE' && (ruleBooksEnabled === true || ruleBooksEnabled.has('US25208'))) {
							tabs.splice(1, 0, {
								id: 'zoneArmor',
								label: translate(locale, 'titlebar.tabs.zonearmor'),
							});
						}
					}
				}
			}
		}
		return tabs;
	}
);
