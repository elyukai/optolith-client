import { List } from './dataUtils';

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

export const mainSectionTabs = List.of<TabId> (
  'herolist',
  'grouplist',
  'wiki',
  'faq',
  'imprint',
  'thirdPartyLicenses',
  'lastChanges',
);

export const heroSectionTabs = List.of<TabId> (
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
);

export const isMainSectionTab = mainSectionTabs.elem;
export const isHeroSectionTab = heroSectionTabs.elem;
