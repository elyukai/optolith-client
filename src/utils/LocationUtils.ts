import { List } from './dataUtils';
import { flip } from './flip';

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

export const isMainSectionTab = flip<TabId, List<TabId>, boolean> (List.elem) (mainSectionTabs);
export const isHeroSectionTab = flip<TabId, List<TabId>, boolean> (List.elem) (heroSectionTabs);
