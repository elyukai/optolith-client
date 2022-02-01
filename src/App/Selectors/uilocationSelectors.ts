import { ident } from "../../Data/Function"
import { fmapF } from "../../Data/Functor"
import { any, elem, insertAt, List, snocF } from "../../Data/List"
import { Just, Maybe, maybe, Nothing } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { uncurry3 } from "../../Data/Tuple/Curry"
import { SubTab } from "../Models/Hero/heroTypeHelpers"
import { NavigationBarTabOptions } from "../Models/View/NavigationBarTabOptions"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { translate } from "../Utilities/I18n"
import { isHeroSectionTab, isMainSectionTab, TabId } from "../Utilities/LocationUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { isBookEnabled, sourceBooksPairToTuple } from "../Utilities/RulesUtils"
import { getIsLiturgicalChantsTabAvailable } from "./liturgicalChantsSelectors"
import { getIsRemovingEnabled } from "./phaseSelectors"
import { getRuleBooksEnabledM } from "./rulesSelectors"
import { getIsSpellsTabAvailable } from "./spellsSelectors"
import { getCurrentCultureId, getCurrentPhase, getCurrentTab, getRaceIdM, getWiki } from "./stateSelectors"

export const getIsMainSection = createMaybeSelector (
  getCurrentTab,
  isMainSectionTab
)

export const getIsHeroSection = createMaybeSelector (
  getCurrentTab,
  isHeroSectionTab
)

export const PHASE_1_PROFILE_TABS =
  List (TabId.Profile, TabId.PersonalData, TabId.Pact, TabId.Rules)

export const PHASE_1_RCP_TABS =
  List (TabId.Races, TabId.Cultures, TabId.Professions)

export const getTabs = createMaybeSelector (
  getWiki,
  getIsMainSection,
  getIsHeroSection,
  getCurrentPhase,
  getIsRemovingEnabled,
  (
    staticData,
    isMainSection,
    isHeroSection,
    phase,
    isRemovingEnabled
  ): List<Record<NavigationBarTabOptions>> => {
    if (isMainSection) {
      return List<Record<NavigationBarTabOptions>> (
        NavigationBarTabOptions ({
          id: TabId.Herolist,
          label: translate (staticData) ("header.tabs.heroes"),
          subTabs: List (),
        }),
        // NavigationBarTabOptions ({
        //   id: TabId.Grouplist,
        //   label: translate (staticData) ("header.tabs.groups"),
        //   subTabs: List (),
        // }),
        NavigationBarTabOptions ({
          id: TabId.Wiki,
          label: translate (staticData) ("header.tabs.wiki"),
          subTabs: List (),
        }),
        NavigationBarTabOptions ({
          id: TabId.Faq,
          label: translate (staticData) ("header.tabs.faq"),
          subTabs: List (),
        }),
        NavigationBarTabOptions ({
          id: TabId.Imprint,
          label: translate (staticData) ("header.tabs.about"),
          subTabs: List (TabId.Imprint, TabId.ThirdPartyLicenses, TabId.LastChanges),
        })
      )
    }

    if (isHeroSection) {
      if (Maybe.elem (1) (phase)) {
        return List<Record<NavigationBarTabOptions>> (
          NavigationBarTabOptions ({
            id: TabId.Profile,
            label: translate (staticData) ("header.tabs.profile"),
            subTabs: PHASE_1_PROFILE_TABS,
          }),
          NavigationBarTabOptions ({
            id: TabId.Races,
            label: translate (staticData) ("header.tabs.racecultureandprofession"),
            subTabs: PHASE_1_RCP_TABS,
          })
        )
      }

      if (isRemovingEnabled) {
        return List<Record<NavigationBarTabOptions>> (
          NavigationBarTabOptions ({
            id: TabId.Profile,
            label: translate (staticData) ("header.tabs.profile"),
            subTabs: List (
              TabId.Profile,
              TabId.PersonalData,
              TabId.CharacterSheet,
              TabId.Pact,
              TabId.Rules
            ),
          }),
          NavigationBarTabOptions ({
            id: TabId.Attributes,
            label: translate (staticData) ("header.tabs.attributes"),
            subTabs: List (),
          }),
          NavigationBarTabOptions ({
            id: TabId.Advantages,
            label: translate (staticData) ("header.tabs.advantagesanddisadvantages"),
            subTabs: List (TabId.Advantages, TabId.Disadvantages),
          }),
          NavigationBarTabOptions ({
            id: TabId.Skills,
            label: translate (staticData) ("header.tabs.abilities"),
            subTabs: List (
              TabId.Skills,
              TabId.CombatTechniques,
              TabId.SpecialAbilities,
              TabId.Spells,
              TabId.LiturgicalChants
            ),
          }),
          NavigationBarTabOptions ({
            id: TabId.Equipment,
            label: translate (staticData) ("header.tabs.belongings"),
            subTabs: List (TabId.Equipment, TabId.ZoneArmor, TabId.Pets),
          })
        )
      }

      return List<Record<NavigationBarTabOptions>> (
        NavigationBarTabOptions ({
          id: TabId.Profile,
          label: translate (staticData) ("header.tabs.profile"),
          subTabs: List (
            TabId.Profile,
            TabId.PersonalData,
            TabId.CharacterSheet,
            TabId.Pact,
            TabId.Rules
          ),
        }),
        NavigationBarTabOptions ({
          id: TabId.Attributes,
          label: translate (staticData) ("header.tabs.attributes"),
          subTabs: List (),
        }),
        NavigationBarTabOptions ({
          id: TabId.Skills,
          label: translate (staticData) ("header.tabs.abilities"),
          subTabs: List (
            TabId.Skills,
            TabId.CombatTechniques,
            TabId.SpecialAbilities,
            TabId.Spells,
            TabId.LiturgicalChants
          ),
        }),
        NavigationBarTabOptions ({
          id: TabId.Equipment,
          label: translate (staticData) ("header.tabs.belongings"),
          subTabs: List (TabId.Equipment, TabId.ZoneArmor, TabId.Pets),
        })
      )
    }

    return List<Record<NavigationBarTabOptions>> ()
  }
)

export const getSubtabs = createMaybeSelector (
  getWiki,
  getCurrentTab,
  getIsMainSection,
  getIsHeroSection,
  getCurrentPhase,
  getRaceIdM,
  getCurrentCultureId,
  getIsSpellsTabAvailable,
  getIsLiturgicalChantsTabAvailable,
  getRuleBooksEnabledM,
  (
    staticData,
    tab,
    isMainSection,
    isHeroSection,
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
            label: translate (staticData) ("header.tabs.imprint"),
            disabled: false,
          },
          {
            id: TabId.ThirdPartyLicenses,
            label: translate (staticData) ("header.tabs.thirdpartylicenses"),
            disabled: false,
          },
          {
            id: TabId.LastChanges,
            label: translate (staticData) ("header.tabs.lastchanges"),
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
              label: translate (staticData) ("header.tabs.overview"),
              disabled: false,
            },
            // {
            //   id: TabId.PersonalData,
            //   label: translate (staticData) ("header.tabs.personaldata"),
            //   disabled: true,
            // },
            {
              id: TabId.Rules,
              label: translate (staticData) ("header.tabs.rules"),
              disabled: false,
            }
          )

          if (maybe (false)
                    (pipe (
                      sourceBooksPairToTuple,
                      ruleBooksEnabled =>
                      any (uncurry3 (isBookEnabled) (ruleBooksEnabled))
                          (List ("US25102", "US25008"))
                    ))
                    (mruleBooksEnabled)) {
            return Just (insertAt (2)
                                  <SubTab>
                                  ({
                                    id: TabId.Pact,
                                    label: translate (staticData) ("header.tabs.pact"),
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
            label: translate (staticData) ("header.tabs.race"),
            disabled: false,
          }

          const culturesTab: SubTab = {
            id: TabId.Cultures,
            label: translate (staticData) ("header.tabs.culture"),
            disabled: false,
          }

          const professionsTab: SubTab = {
            id: TabId.Professions,
            label: translate (staticData) ("header.tabs.profession"),
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
                label: translate (staticData) ("header.tabs.overview"),
                disabled: false,
              },
              // {
              //   id: TabId.PersonalData,
              //   label: translate (staticData) ("header.tabs.personaldata"),
              //   disabled: true,
              // },
              {
                id: TabId.Rules,
                label: translate (staticData) ("header.tabs.rules"),
                disabled: false,
              }
            ),
            Maybe.elem (3) (phase)
              ? insertAt (1)
                         <SubTab> ({
                           id: TabId.CharacterSheet,
                           label: translate (staticData) ("header.tabs.charactersheet"),
                           disabled: false,
                         })
              : ident,
            maybe (false)
                  (pipe (
                    sourceBooksPairToTuple,
                    ruleBooksEnabled =>
                    any (uncurry3 (isBookEnabled) (ruleBooksEnabled))
                        (List ("US25102", "US25008"))
                  ))
                  (mruleBooksEnabled)
              ? insertAt (Maybe.elem (3) (phase) ? 2 : 1)
                         <SubTab> ({
                           id: TabId.Pact,
                           label: translate (staticData) ("header.tabs.pact"),
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
              label: translate (staticData) ("header.tabs.advantages"),
              disabled: false,
            },
            {
              id: TabId.Disadvantages,
              label: translate (staticData) ("header.tabs.disadvantages"),
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
                  label: translate (staticData) ("header.tabs.skills"),
                  disabled: false,
                },
                {
                  id: TabId.CombatTechniques,
                  label: translate (staticData) ("header.tabs.combattechniques"),
                  disabled: false,
                },
                {
                  id: TabId.SpecialAbilities,
                  label: translate (staticData) ("header.tabs.specialabilities"),
                  disabled: false,
                }
              ),
              isSpellsTabAvailable
                ? snocF<SubTab> ({
                    id: TabId.Spells,
                    label: translate (staticData) ("header.tabs.spells"),
                    disabled: false,
                  })
                : ident,
              isLiturgicalChantsTabAvailable
                ? snocF<SubTab> ({
                    id: TabId.LiturgicalChants,
                    label: translate (staticData) ("header.tabs.liturgicalchants"),
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
              label: translate (staticData) ("header.tabs.equipment"),
              disabled: false,
            },
            {
              id: TabId.Pets,
              label: translate (staticData) ("header.tabs.pets"),
              disabled: false,
            }
          )

          if (Maybe.elem (true)
                         (fmapF (mruleBooksEnabled)
                                (pipe (
                                  sourceBooksPairToTuple,
                                  ruleBooksEnabled =>
                                    any (uncurry3 (isBookEnabled) (ruleBooksEnabled))
                                        (List ("US25208", "US25208E"))
                                )))) {
            return Just (insertAt (1)
                                  <SubTab> ({
                                    id: TabId.ZoneArmor,
                                    label: translate (staticData) ("header.tabs.hitzonearmor"),
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
