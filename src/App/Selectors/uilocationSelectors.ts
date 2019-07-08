import { ident } from "../../Data/Function";
import { fmapF } from "../../Data/Functor";
import { any, elem, insertAt, List, snocF } from "../../Data/List";
import { Just, Maybe, maybe, Nothing } from "../../Data/Maybe";
import { SubTab } from "../Models/Hero/heroTypeHelpers";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { isHeroSectionTab, isMainSectionTab, TabId } from "../Utilities/LocationUtils";
import { pipe_ } from "../Utilities/pipe";
import { isBookEnabled } from "../Utilities/RulesUtils";
import { NavigationBarTabProps } from "../Views/NavBar/NavigationBarTabs";
import { getIsLiturgicalChantsTabAvailable } from "./liturgicalChantsSelectors";
import { getIsRemovingEnabled } from "./phaseSelectors";
import { EnabledSourceBooks, getRuleBooksEnabled } from "./rulesSelectors";
import { getIsSpellsTabAvailable } from "./spellsSelectors";
import { getCurrentCultureId, getCurrentRaceId, getCurrentTab, getLocaleAsProp, getPhase } from "./stateSelectors";

export const getIsMainSection = createMaybeSelector (
  getCurrentTab,
  isMainSectionTab
)

export const getIsHeroSection = createMaybeSelector (
  getCurrentTab,
  isHeroSectionTab
)

export const getTabs = createMaybeSelector (
  getIsMainSection,
  getIsHeroSection,
  getLocaleAsProp,
  getPhase,
  getIsRemovingEnabled,
  (isMainSection, isHeroSection, l10n, phase, isRemovingEnabled): List<NavigationBarTabProps> => {
    if (isMainSection) {
      return List<NavigationBarTabProps> (
        {
          id: TabId.Herolist,
          label: translate (l10n) ("heroes"),
        },
        {
          id: TabId.Grouplist,
          label: translate (l10n) ("groups"),
          disabled: true,
        },
        {
          id: TabId.Wiki,
          label: translate (l10n) ("wiki"),
        },
        {
          id: TabId.Faq,
          label: translate (l10n) ("faq"),
        },
        {
          id: TabId.Imprint,
          label: translate (l10n) ("about"),
          subTabs: List (TabId.Imprint, TabId.ThirdPartyLicenses, TabId.LastChanges),
        }
      )
    }

    if (isHeroSection) {
      if (Maybe.elem (1) (phase)) {
        return List<NavigationBarTabProps> (
          {
            id: TabId.Profile,
            label: translate (l10n) ("profile"),
            subTabs: List (TabId.Profile, TabId.PersonalData, TabId.Pact, TabId.Rules),
          },
          {
            id: TabId.Races,
            label: translate (l10n) ("racecultureandprofession"),
            subTabs: List (TabId.Races, TabId.Cultures, TabId.Professions),
          }
        )
      }

      if (isRemovingEnabled) {
        return List<NavigationBarTabProps> (
          {
            id: TabId.Profile,
            label: translate (l10n) ("profile"),
            subTabs: List (
              TabId.Profile,
              TabId.PersonalData,
              TabId.CharacterSheet,
              TabId.Pact,
              TabId.Rules
            ),
          },
          {
            id: TabId.Attributes,
            label: translate (l10n) ("attributes"),
          },
          {
            id: TabId.Advantages,
            label: translate (l10n) ("advantagesanddisadvantages"),
            subTabs: List (TabId.Advantages, TabId.Disadvantages),
          },
          {
            id: TabId.Skills,
            label: translate (l10n) ("abilities"),
            subTabs: List (
              TabId.Skills,
              TabId.CombatTechniques,
              TabId.SpecialAbilities,
              TabId.Spells,
              TabId.LiturgicalChants
            ),
          },
          {
            id: TabId.Equipment,
            label: translate (l10n) ("belongings"),
            subTabs: List (TabId.Equipment, TabId.ZoneArmor, TabId.Pets),
          }
        )
      }

      return List<NavigationBarTabProps> (
        {
          id: TabId.Profile,
          label: translate (l10n) ("profile"),
          subTabs: List (
            TabId.Profile,
            TabId.PersonalData,
            TabId.CharacterSheet,
            TabId.Pact,
            TabId.Rules
          ),
        },
        {
          id: TabId.Attributes,
          label: translate (l10n) ("attributes"),
        },
        {
          id: TabId.Skills,
          label: translate (l10n) ("abilities"),
          subTabs: List (
            TabId.Skills,
            TabId.CombatTechniques,
            TabId.SpecialAbilities,
            TabId.Spells,
            TabId.LiturgicalChants
          ),
        },
        {
          id: TabId.Equipment,
          label: translate (l10n) ("belongings"),
          subTabs: List (TabId.Equipment, TabId.ZoneArmor, TabId.Pets),
        }
      )
    }

    return List<NavigationBarTabProps> ()
  }
)

export const getSubtabs = createMaybeSelector (
  getCurrentTab,
  getIsMainSection,
  getIsHeroSection,
  getLocaleAsProp,
  getPhase,
  getCurrentRaceId,
  getCurrentCultureId,
  getIsSpellsTabAvailable,
  getIsLiturgicalChantsTabAvailable,
  getRuleBooksEnabled,
  (
    tab,
    isMainSection,
    isHeroSection,
    locale,
    phase,
    raceId,
    cultureId,
    isSpellsTabAvailable,
    isLiturgicalChantsTabAvailable,
    mruleBooksEnabled
  ): Maybe<List<SubTab>> => {
    if (isMainSection) {
      const aboutSubTabs = List (TabId.Imprint, TabId.ThirdPartyLicenses, TabId.LastChanges)

      if (elem (tab) (aboutSubTabs)) {
        return Just (List<SubTab> (
          {
            id: TabId.Imprint,
            label: translate (locale) ("imprint"),
            disabled: false,
          },
          {
            id: TabId.ThirdPartyLicenses,
            label: translate (locale) ("thirdpartylicenses"),
            disabled: false,
          },
          {
            id: TabId.LastChanges,
            label: translate (locale) ("lastchanges"),
            disabled: false,
          }
        ))
      }
    }
    else if (isHeroSection) {
      if (Maybe.elem (1) (phase)) {
        const profileSubTabs = List (TabId.Profile, TabId.PersonalData, TabId.Pact, TabId.Rules)
        const rcpSubTabs = List (TabId.Races, TabId.Cultures, TabId.Professions)

        if (elem (tab) (profileSubTabs)) {
          const tabs = List<SubTab> (
            {
              id: TabId.Profile,
              label: translate (locale) ("overview"),
              disabled: false,
            },
            {
              id: TabId.PersonalData,
              label: translate (locale) ("personaldata"),
              disabled: true,
            },
            {
              id: TabId.Rules,
              label: translate (locale) ("rules"),
              disabled: false,
            }
          )

          if (maybe (false)
                    ((ruleBooksEnabled: EnabledSourceBooks) =>
                      any (isBookEnabled (ruleBooksEnabled))
                          (List ("US25102", "US25008")))
                    (mruleBooksEnabled)) {
            return Just (insertAt (2)
                                  <SubTab>
                                  ({
                                    id: TabId.Pact,
                                    label: translate (locale) ("pact"),
                                    disabled: false,
                                  })
                                  (tabs))
          }
          else {
            return Just (tabs)
          }
        }

        if (elem (tab) (rcpSubTabs)) {
          const racesTab: SubTab = {
            id: TabId.Races,
            label: translate (locale) ("race"),
            disabled: false,
          }

          const culturesTab: SubTab = {
            id: TabId.Cultures,
            label: translate (locale) ("culture"),
            disabled: false,
          }

          const professionsTab: SubTab = {
            id: TabId.Professions,
            label: translate (locale) ("profession"),
            disabled: false,
          }

          if (Maybe.isJust (cultureId)) {
            return Just (List<SubTab> (
              racesTab,
              culturesTab,
              professionsTab
            ))
          }

          if (Maybe.isJust (raceId)) {
            return Just (List<SubTab> (
              racesTab,
              culturesTab
            ))
          }

          return Just (List<SubTab> (
            racesTab
          ))
        }
      }
      else {
        const profileSubTabs = List (
          TabId.Profile,
          TabId.PersonalData,
          TabId.CharacterSheet,
          TabId.Pact,
          TabId.Rules
        )

        const abilitiesSubTabs = List (
          TabId.Skills,
          TabId.CombatTechniques,
          TabId.SpecialAbilities,
          TabId.Spells,
          TabId.LiturgicalChants
        )

        const disadvSubTabs = List (TabId.Advantages, TabId.Disadvantages)
        const belongingsSubTabs = List (TabId.Equipment, TabId.ZoneArmor, TabId.Pets)

        if (elem (tab) (profileSubTabs)) {
          return pipe_ (
            List<SubTab> (
              {
                id: TabId.Profile,
                label: translate (locale) ("overview"),
                disabled: false,
              },
              {
                id: TabId.PersonalData,
                label: translate (locale) ("personaldata"),
                disabled: true,
              },
              {
                id: TabId.Rules,
                label: translate (locale) ("rules"),
                disabled: false,
              }
            ),
            Maybe.elem (3) (phase)
              ? insertAt (2)
                         <SubTab> ({
                           id: TabId.CharacterSheet,
                           label: translate (locale) ("charactersheet"),
                           disabled: false,
                         })
              : ident,
            maybe (false)
                  ((ruleBooksEnabled: EnabledSourceBooks) =>
                    any (isBookEnabled (ruleBooksEnabled))
                        (List ("US25102", "US25008")))
                  (mruleBooksEnabled)
              ? insertAt (Maybe.elem (3) (phase) ? 3 : 2)
                         <SubTab> ({
                           id: TabId.Pact,
                           label: translate (locale) ("pact"),
                           disabled: false,
                         })
              : ident,
            Just
          )
        }

        if (elem (tab) (disadvSubTabs)) {
          return Just (List<SubTab> (
            {
              id: TabId.Advantages,
              label: translate (locale) ("advantages"),
              disabled: false,
            },
            {
              id: TabId.Disadvantages,
              label: translate (locale) ("disadvantages"),
              disabled: false,
            }
          ))
        }

        if (elem (tab) (abilitiesSubTabs)) {
          return Just (
            pipe_ (
              List<SubTab> (
                {
                  id: TabId.Skills,
                  label: translate (locale) ("skills"),
                  disabled: false,
                },
                {
                  id: TabId.CombatTechniques,
                  label: translate (locale) ("combattechniques"),
                  disabled: false,
                },
                {
                  id: TabId.SpecialAbilities,
                  label: translate (locale) ("specialabilities"),
                  disabled: false,
                }
              ),
              isSpellsTabAvailable
                ? snocF<SubTab> ({
                    id: TabId.Spells,
                    label: translate (locale) ("spells"),
                    disabled: false,
                  })
                : ident,
              isLiturgicalChantsTabAvailable
                ? snocF<SubTab> ({
                    id: TabId.LiturgicalChants,
                    label: translate (locale) ("liturgicalchants"),
                    disabled: false,
                  })
                : ident
            )
          )
        }

        if (elem (tab) (belongingsSubTabs)) {
          const baseTabs = List<SubTab> (
            {
              id: TabId.Equipment,
              label: translate (locale) ("equipment"),
              disabled: false,
            },
            {
              id: TabId.Pets,
              label: translate (locale) ("pets"),
              disabled: false,
            }
          )

          if (Maybe.elem (true)
                         (fmapF (mruleBooksEnabled)
                                (ruleBooksEnabled => isBookEnabled (ruleBooksEnabled)
                                                                   ("US25208")))) {
            return Just (insertAt (1)
                                  <SubTab> ({
                                    id: TabId.ZoneArmor,
                                    label: translate (locale) ("hitzonearmor"),
                                    disabled: false,
                                  })
                                  (baseTabs))
          }

          return Just (baseTabs)
        }
      }
    }

    return Nothing
  }
)
