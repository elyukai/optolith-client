import { ident } from "../../Data/Function";
import { fmapF } from "../../Data/Functor";
import { elem, insertAt, List, snocF } from "../../Data/List";
import { Just, Maybe, Nothing } from "../../Data/Maybe";
import { SubTab } from "../Models/Hero/heroTypeHelpers";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { isHeroSectionTab, isMainSectionTab, TabId } from "../Utilities/LocationUtils";
import { pipe_ } from "../Utilities/pipe";
import { isBookEnabled } from "../Utilities/RulesUtils";
import { NavigationBarTabProps } from "../Views/NavBar/NavigationBarTabs";
import { getIsLiturgicalChantsTabAvailable } from "./liturgicalChantsSelectors";
import { getIsRemovingEnabled } from "./phaseSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
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
          id: "herolist",
          label: translate (l10n) ("heroes"),
        },
        {
          id: "grouplist",
          label: translate (l10n) ("groups"),
          disabled: true,
        },
        {
          id: "wiki",
          label: translate (l10n) ("wiki"),
        },
        {
          id: "faq",
          label: translate (l10n) ("faq"),
        },
        {
          id: "imprint",
          label: translate (l10n) ("about"),
          subTabs: List<TabId> ("imprint", "thirdPartyLicenses", "lastChanges"),
        }
      )
    }

    if (isHeroSection) {
      if (Maybe.elem (1) (phase)) {
        return List<NavigationBarTabProps> (
          {
            id: "profile",
            label: translate (l10n) ("profile"),
            subTabs: List<TabId> ("profile", "personalData", "pact", "rules"),
          },
          {
            id: "races",
            label: translate (l10n) ("racecultureandprofession"),
            subTabs: List<TabId> ("races", "cultures", "professions"),
          }
        )
      }

      if (isRemovingEnabled) {
        return List<NavigationBarTabProps> (
          {
            id: "profile",
            label: translate (l10n) ("profile"),
            subTabs: List<TabId> ("profile", "personalData", "characterSheet", "pact", "rules"),
          },
          {
            id: "attributes",
            label: translate (l10n) ("attributes"),
          },
          {
            id: "advantages",
            label: translate (l10n) ("advantagesanddisadvantages"),
            subTabs: List<TabId> ("advantages", "disadvantages"),
          },
          {
            id: "skills",
            label: translate (l10n) ("skills"),
            subTabs: List<TabId> (
              "skills",
              "combatTechniques",
              "specialAbilities",
              "spells",
              "liturgicalChants"
            ),
          },
          {
            id: "equipment",
            label: translate (l10n) ("belongings"),
            subTabs: List<TabId> ("equipment", "zoneArmor", "pets"),
          }
        )
      }

      return List<NavigationBarTabProps> (
        {
          id: "profile",
          label: translate (l10n) ("profile"),
          subTabs: List<TabId> ("profile", "personalData", "characterSheet", "pact", "rules"),
        },
        {
          id: "attributes",
          label: translate (l10n) ("attributes"),
        },
        {
          id: "skills",
          label: translate (l10n) ("skills"),
          subTabs: List<TabId> (
            "skills",
            "combatTechniques",
            "specialAbilities",
            "spells",
            "liturgicalChants"
          ),
        },
        {
          id: "equipment",
          label: translate (l10n) ("belongings"),
          subTabs: List<TabId> ("equipment", "zoneArmor", "pets"),
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
      const aboutSubTabs = List<TabId> ("imprint", "thirdPartyLicenses", "lastChanges")

      if (elem (tab) (aboutSubTabs)) {
        return Just (List<SubTab> (
          {
            id: "imprint",
            label: translate (locale) ("imprint"),
            disabled: false,
          },
          {
            id: "thirdPartyLicenses",
            label: translate (locale) ("thirdpartylicenses"),
            disabled: false,
          },
          {
            id: "lastChanges",
            label: translate (locale) ("lastchanges"),
            disabled: false,
          }
        ))
      }
    }
    else if (isHeroSection) {
      if (Maybe.elem (1) (phase)) {
        const profileSubTabs = List<TabId> ("profile", "personalData", "pact", "rules")
        const rcpSubTabs = List<TabId> ("races", "cultures", "professions")

        if (elem (tab) (profileSubTabs)) {
          return Just (List<SubTab> (
            {
              id: "profile",
              label: translate (locale) ("overview"),
              disabled: false,
            },
            {
              id: "personalData",
              label: translate (locale) ("personaldata"),
              disabled: true,
            },
            {
              id: "pact",
              label: translate (locale) ("pact"),
              disabled: Maybe.elem (true)
                                   (fmapF (mruleBooksEnabled)
                                          (ruleBooksEnabled => isBookEnabled (ruleBooksEnabled)
                                                                             ("US25102")
                                                               || isBookEnabled (ruleBooksEnabled)
                                                                                ("US25008"))),
            },
            {
              id: "rules",
              label: translate (locale) ("rules"),
              disabled: false,
            }
          ))
        }
        if (elem (tab) (rcpSubTabs)) {
          const racesTab: SubTab = {
            id: "races",
            label: translate (locale) ("race"),
            disabled: false,
          }

          const culturesTab: SubTab = {
            id: "cultures",
            label: translate (locale) ("culture"),
            disabled: false,
          }

          const professionsTab: SubTab = {
            id: "professions",
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
        const profileSubTabs = List<TabId> (
          "profile", "personalData", "characterSheet", "pact", "rules"
        )

        const abilitiesSubTabs = List<TabId> (
          "skills", "combatTechniques", "specialAbilities", "spells", "liturgicalChants"
        )

        const disadvSubTabs = List<TabId> ("advantages", "disadvantages")
        const belongingsSubTabs = List<TabId> ("equipment", "zoneArmor", "pets")

        if (elem (tab) (profileSubTabs)) {
          const baseTabs = List<SubTab> (
            {
              id: "profile",
              label: translate (locale) ("overview"),
              disabled: false,
            },
            {
              id: "personalData",
              label: translate (locale) ("personaldata"),
              disabled: true,
            },
            {
              id: "pact",
              label: translate (locale) ("pact"),
              disabled: Maybe.elem (true)
                                   (fmapF (mruleBooksEnabled)
                                          (ruleBooksEnabled => isBookEnabled (ruleBooksEnabled)
                                                                             ("US25102")
                                                               || isBookEnabled (ruleBooksEnabled)
                                                                                ("US25008"))),
            },
            {
              id: "rules",
              label: translate (locale) ("rules"),
              disabled: false,
            }
          )

          if (Maybe.elem (3) (phase)) {
            return Just (insertAt (2)
                                  <SubTab> ({
                                    id: "characterSheet",
                                    label: translate (locale) ("charactersheet"),
                                    disabled: false,
                                  })
                                  (baseTabs))
          }

          return Just (baseTabs)
        }

        if (elem (tab) (disadvSubTabs)) {
          return Just (List<SubTab> (
            {
              id: "advantages",
              label: translate (locale) ("advantages"),
              disabled: false,
            },
            {
              id: "disadvantages",
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
                  id: "skills",
                  label: translate (locale) ("skills"),
                  disabled: false,
                },
                {
                  id: "combatTechniques",
                  label: translate (locale) ("combattechniques"),
                  disabled: false,
                },
                {
                  id: "specialAbilities",
                  label: translate (locale) ("specialabilities"),
                  disabled: false,
                }
              ),
              isSpellsTabAvailable
                ? snocF<SubTab> ({
                    id: "spells",
                    label: translate (locale) ("spells"),
                    disabled: false,
                  })
                : ident,
              isLiturgicalChantsTabAvailable
                ? snocF<SubTab> ({
                    id: "liturgicalChants",
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
              id: "equipment",
              label: translate (locale) ("equipment"),
              disabled: false,
            },
            {
              id: "pets",
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
                                    id: "zoneArmor",
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
