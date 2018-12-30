import { elem_, fromElements } from './structures/List';

export type TabId = 'herolist'
                  | 'grouplist'
                  | 'wiki'
                  | 'faq'
                  | 'imprint'
                  | 'thirdPartyLicenses'
                  | 'lastChanges'
                  | 'profile'
                  | 'personalData'
                  | 'characterSheet'
                  | 'pact'
                  | 'rules'
                  | 'races'
                  | 'cultures'
                  | 'professions'
                  | 'attributes'
                  | 'advantages'
                  | 'disadvantages'
                  | 'skills'
                  | 'combatTechniques'
                  | 'specialAbilities'
                  | 'spells'
                  | 'liturgicalChants'
                  | 'equipment'
                  | 'zoneArmor'
                  | 'pets'

export const mainSectionTabs =
  fromElements<TabId> (
    'herolist',
    'grouplist',
    'wiki',
    'faq',
    'imprint',
    'thirdPartyLicenses',
    'lastChanges'
  )

export const heroSectionTabs =
  fromElements<TabId> (
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
    'pets'
  )

export const isMainSectionTab = elem_ (mainSectionTabs)
export const isHeroSectionTab = elem_ (heroSectionTabs)
