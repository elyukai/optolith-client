export type TabId = 'herolist' | 'grouplist' | 'wiki' | 'faq' | 'imprint' | 'thirdPartyLicenses' | 'lastChanges' | 'profile' | 'personalData' | 'characterSheet' | 'pact' | 'rules' | 'races' | 'cultures' | 'professions' | 'attributes' | 'advantages' | 'disadvantages' | 'skills' | 'combatTechniques' | 'specialAbilities' | 'spells' | 'liturgicalChants' | 'equipment' | 'zoneArmor' | 'pets';

export const mainSectionTabs: TabId[] = ['herolist', 'grouplist', 'wiki', 'faq', 'imprint', 'thirdPartyLicenses', 'lastChanges'];
export const heroSectionTabs: TabId[] = ['profile', 'personalData', 'characterSheet', 'pact', 'rules', 'races', 'cultures', 'professions', 'attributes', 'advantages', 'disadvantages', 'skills', 'combatTechniques', 'specialAbilities', 'spells', 'liturgicalChants', 'equipment', 'zoneArmor', 'pets'];

export function isMainSectionTab(tab: TabId) {
	return mainSectionTabs.includes(tab);
}

export function isHeroSectionTab(tab: TabId) {
	return heroSectionTabs.includes(tab);
}
