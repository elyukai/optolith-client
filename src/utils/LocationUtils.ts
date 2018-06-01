export type TabId =
  'herolist' |
  'grouplist' |
  'wiki' |
  'faq' |
  'imprint' |
  'thirdPartyLicenses' |
  'lastChanges' |
  'profile' |
  'personalData' |
  'characterSheet' |
  'pact' |
  'rules' |
  'races' |
  'cultures' |
  'professions' |
  'attributes' |
  'advantages' |
  'disadvantages' |
  'skills' |
  'combatTechniques' |
  'specialAbilities' |
  'spells' |
  'liturgicalChants' |
  'equipment' |
  'zoneArmor' |
  'pets';

export const mainSectionTabs: ReadonlyArray<TabId> = [
  'herolist',
  'grouplist',
  'wiki',
  'faq',
  'imprint',
  'thirdPartyLicenses',
  'lastChanges',
];

export const heroSectionTabs: ReadonlyArray<TabId> = [
  'profile',
  'personalData',
  'characterSheet',
  'pact',
  'rules',
  'races',
  'cultures',
  'professions',
  'attributes',
  'advantages',
  'disadvantages',
  'skills',
  'combatTechniques',
  'specialAbilities',
  'spells',
  'liturgicalChants',
  'equipment',
  'zoneArmor',
  'pets',
];

export const isMainSectionTab = (tab: TabId) => mainSectionTabs.includes(tab);
export const isHeroSectionTab = (tab: TabId) => heroSectionTabs.includes(tab);
