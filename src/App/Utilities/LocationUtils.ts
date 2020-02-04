import { elemF, filter, List, notElemF } from "../../Data/List"

export enum TabId {
  Herolist,
  Grouplist,
  Wiki,
  Faq,
  Imprint,
  ThirdPartyLicenses,
  LastChanges,
  Profile,
  PersonalData,
  CharacterSheet,
  Pact,
  Rules,
  Races,
  Cultures,
  Professions,
  Attributes,
  Advantages,
  Disadvantages,
  Skills,
  CombatTechniques,
  SpecialAbilities,
  Spells,
  LiturgicalChants,
  Equipment,
  ZoneArmor,
  Pets,
}

export const mainSectionTabs =
  List (
    TabId.Herolist,
    TabId.Grouplist,
    TabId.Wiki,
    TabId.Faq,
    TabId.Imprint,
    TabId.ThirdPartyLicenses,
    TabId.LastChanges
  )

export const heroSectionTabs =
  List (
    TabId.Profile,
    TabId.PersonalData,
    TabId.CharacterSheet,
    TabId.Pact,
    TabId.Rules,
    TabId.Races,
    TabId.Cultures,
    TabId.Professions,
    TabId.Attributes,
    TabId.Advantages,
    TabId.Disadvantages,
    TabId.Skills,
    TabId.CombatTechniques,
    TabId.SpecialAbilities,
    TabId.Spells,
    TabId.LiturgicalChants,
    TabId.Equipment,
    TabId.ZoneArmor,
    TabId.Pets
  )

export const generalHeroSectionTabs =
  List<TabId> (
    TabId.Profile,
    TabId.PersonalData,
    TabId.CharacterSheet,
    TabId.Pact,
    TabId.Rules
  )

export const phase1ExclusiveTabs =
  List<TabId> (
    TabId.Cultures,
    TabId.Professions,
    TabId.Races
  )

export const phase23Tabs =
  filter ((tab: TabId) => notElemF (generalHeroSectionTabs) (tab)
                          && notElemF (phase1ExclusiveTabs) (tab))
         (heroSectionTabs)

export const isMainSectionTab = elemF (mainSectionTabs)
export const isHeroSectionTab = elemF (heroSectionTabs)
