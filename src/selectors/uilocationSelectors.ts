import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { translate } from '../App/Utils/I18n';
import { isHeroSectionTab, isMainSectionTab, TabId } from '../App/Utils/LocationUtils';
import { isBookEnabled } from '../App/Utils/RulesUtils';
import { SubTab } from '../types/data';
import { Just, List, Maybe, Nothing } from '../utils/dataUtils';
import { NavigationBarTabProps } from '../views/navigationbar/NavigationBarTabs';
import { getIsLiturgicalChantsTabAvailable } from './liturgicalChantsSelectors';
import { getIsRemovingEnabled } from './phaseSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getIsSpellsTabAvailable } from './spellsSelectors';
import { getCurrentCultureId, getCurrentRaceId, getCurrentTab, getLocaleAsProp, getPhase, getWikiBooks } from './stateSelectors';

export const getIsMainSection = createMaybeSelector (
  getCurrentTab,
  isMainSectionTab
);

export const getIsHeroSection = createMaybeSelector (
  getCurrentTab,
  isHeroSectionTab
);

export const getTabs = createMaybeSelector (
  getIsMainSection,
  getIsHeroSection,
  getLocaleAsProp,
  getPhase,
  getIsRemovingEnabled,
  (isMainSection, isHeroSection, locale, phase, isRemovingEnabled): List<NavigationBarTabProps> => {
    if (isMainSection) {
      return List.of<NavigationBarTabProps> (
        {
          id: 'herolist',
          label: translate (locale, 'titlebar.tabs.heroes'),
        },
        {
          id: 'grouplist',
          label: translate (locale, 'titlebar.tabs.groups'),
          disabled: true,
        },
        {
          id: 'wiki',
          label: translate (locale, 'titlebar.tabs.wiki'),
        },
        {
          id: 'faq',
          label: translate (locale, 'titlebar.tabs.faq'),
        },
        {
          id: 'imprint',
          label: translate (locale, 'titlebar.tabs.about'),
          subTabs: List.of<TabId> ('imprint', 'thirdPartyLicenses', 'lastChanges'),
        }
      );
    }
    else if (isHeroSection) {
      if (Maybe.elem (1) (phase)) {
        return List.of<NavigationBarTabProps> (
          {
            id: 'profile',
            label: translate (locale, 'titlebar.tabs.profile'),
            subTabs: List.of<TabId> ('profile', 'personalData', 'pact', 'rules'),
          },
          {
            id: 'races',
            label: translate (locale, 'titlebar.tabs.racecultureprofession'),
            subTabs: List.of<TabId> ('races', 'cultures', 'professions'),
          }
        );
      }
      else if (isRemovingEnabled) {
        return List.of<NavigationBarTabProps> (
          {
            id: 'profile',
            label: translate (locale, 'titlebar.tabs.profile'),
            subTabs: List.of<TabId> ('profile', 'personalData', 'characterSheet', 'pact', 'rules'),
          },
          {
            id: 'attributes',
            label: translate (locale, 'titlebar.tabs.attributes'),
          },
          {
            id: 'advantages',
            label: translate (locale, 'titlebar.tabs.advantagesdisadvantages'),
            subTabs: List.of<TabId> ('advantages', 'disadvantages'),
          },
          {
            id: 'skills',
            label: translate (locale, 'titlebar.tabs.skills'),
            subTabs: List.of<TabId> (
              'skills',
              'combatTechniques',
              'specialAbilities',
              'spells',
              'liturgicalChants'
            ),
          },
          {
            id: 'equipment',
            label: translate (locale, 'titlebar.tabs.belongings'),
            subTabs: List.of<TabId> ('equipment', 'zoneArmor', 'pets'),
          }
        );
      }

      return List.of<NavigationBarTabProps> (
        {
          id: 'profile',
          label: translate (locale, 'titlebar.tabs.profile'),
          subTabs: List.of<TabId> ('profile', 'personalData', 'characterSheet', 'pact', 'rules'),
        },
        {
          id: 'attributes',
          label: translate (locale, 'titlebar.tabs.attributes'),
        },
        {
          id: 'skills',
          label: translate (locale, 'titlebar.tabs.skills'),
          subTabs: List.of<TabId> (
            'skills',
            'combatTechniques',
            'specialAbilities',
            'spells',
            'liturgicalChants'
          ),
        },
        {
          id: 'equipment',
          label: translate (locale, 'titlebar.tabs.belongings'),
          subTabs: List.of<TabId> ('equipment', 'zoneArmor', 'pets'),
        }
      );
    }

    return List.of<NavigationBarTabProps> ();
  }
);

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
  getWikiBooks,
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
    maybeRuleBooksEnabled,
    books
  ): Maybe<List<SubTab>> => {
    if (locale) {
      if (isMainSection) {
        const aboutSubTabs = List.of<TabId> ('imprint', 'thirdPartyLicenses', 'lastChanges');

        if (aboutSubTabs.elem (tab)) {
          return Just (List.of<SubTab> (
            {
              id: 'imprint',
              label: translate (locale, 'titlebar.tabs.imprint'),
            },
            {
              id: 'thirdPartyLicenses',
              label: translate (locale, 'titlebar.tabs.thirdpartylicenses'),
            },
            {
              id: 'lastChanges',
              label: translate (locale, 'titlebar.tabs.lastchanges'),
            }
          ));
        }
      }
      else if (isHeroSection) {
        if (Maybe.elem (1) (phase)) {
          const profileSubTabs = List.of<TabId> ('profile', 'personalData', 'pact', 'rules');
          const rcpSubTabs = List.of<TabId> ('races', 'cultures', 'professions');

          if (profileSubTabs.elem (tab)) {
            return Just (List.of<SubTab> (
              {
                id: 'profile',
                label: translate (locale, 'titlebar.tabs.profileoverview'),
              },
              {
                id: 'personalData',
                label: translate (locale, 'titlebar.tabs.personaldata'),
                disabled: true,
              },
              {
                id: 'pact',
                label: translate (locale, 'titlebar.tabs.pact'),
                disabled: locale.get ('id') !== 'de-DE',
              },
              {
                id: 'rules',
                label: translate (locale, 'titlebar.tabs.rules'),
              }
            ));
          }
          else if (rcpSubTabs.elem (tab)) {
            const racesTab: SubTab = {
              id: 'races',
              label: translate (locale, 'titlebar.tabs.race'),
            };

            const culturesTab: SubTab = {
              id: 'cultures',
              label: translate (locale, 'titlebar.tabs.culture'),
            };

            const professionsTab: SubTab = {
              id: 'professions',
              label: translate (locale, 'titlebar.tabs.profession'),
            };

            if (Maybe.isJust (cultureId)) {
              return Just (List.of<SubTab> (
                racesTab,
                culturesTab,
                professionsTab
              ));
            }

            if (Maybe.isJust (raceId)) {
              return Just (List.of<SubTab> (
                racesTab,
                culturesTab
              ));
            }

            return Just (List.of<SubTab> (
              racesTab
            ));
          }
        }
        else {
          const profileSubTabs = List.of<TabId> (
            'profile', 'personalData', 'characterSheet', 'pact', 'rules'
          );

          const abilitiesSubTabs = List.of<TabId> (
            'skills', 'combatTechniques', 'specialAbilities', 'spells', 'liturgicalChants'
          );

          const disadvSubTabs = List.of<TabId> ('advantages', 'disadvantages');
          const belongingsSubTabs = List.of<TabId> ('equipment', 'zoneArmor', 'pets');

          if (profileSubTabs.elem (tab)) {
            const baseTabs = List.of<SubTab> (
              {
                id: 'profile',
                label: translate (locale, 'titlebar.tabs.profileoverview'),
              },
              {
                id: 'personalData',
                label: translate (locale, 'titlebar.tabs.personaldata'),
                disabled: true,
              },
              {
                id: 'pact',
                label: translate (locale, 'titlebar.tabs.pact'),
                disabled: locale.get ('id') !== 'de-DE',
              },
              {
                id: 'rules',
                label: translate (locale, 'titlebar.tabs.rules'),
              }
            );

            if (Maybe.elem (3) (phase)) {
              return Just (baseTabs.insertAt (
                2,
                {
                  id: 'characterSheet',
                  label: translate (locale, 'titlebar.tabs.charactersheet'),
                }
              ));
            }

            return Just (baseTabs);
          }
          else if (disadvSubTabs.elem (tab)) {
            return Just (List.of<SubTab> (
              {
                id: 'advantages',
                label: translate (locale, 'titlebar.tabs.advantages'),
              },
              {
                id: 'disadvantages',
                label: translate (locale, 'titlebar.tabs.disadvantages'),
              }
            ));
          }
          else if (abilitiesSubTabs.elem (tab)) {
            return Just (
              List.of<SubTab> (
                {
                  id: 'skills',
                  label: translate (locale, 'titlebar.tabs.talents'),
                },
                {
                  id: 'combatTechniques',
                  label: translate (locale, 'titlebar.tabs.combattechniques'),
                },
                {
                  id: 'specialAbilities',
                  label: translate (locale, 'titlebar.tabs.specialabilities'),
                }
              )
                .mappend (
                  isSpellsTabAvailable
                    ? List.of<SubTab> ({
                      id: 'spells',
                      label: translate (locale, 'titlebar.tabs.spells'),
                    })
                    : List.of ()
                )
                .mappend (
                  isLiturgicalChantsTabAvailable
                    ? List.of<SubTab> ({
                      id: 'liturgicalChants',
                      label: translate (locale, 'titlebar.tabs.liturgies'),
                    })
                    : List.of ()
                )
            );
          }
          else if (belongingsSubTabs.elem (tab)) {
            const baseTabs = List.of<SubTab> (
              {
                id: 'equipment',
                label: translate (locale, 'titlebar.tabs.equipment'),
              },
              {
                id: 'pets',
                label: translate (locale, 'titlebar.tabs.pets'),
              }
            );

            if (
              maybeRuleBooksEnabled
                .fmap (ruleBooksEnabled => isBookEnabled (books) (ruleBooksEnabled) ('US25208'))
                .equals (Just (true))
            ) {
              return Just (baseTabs.insertAt (
                1,
                {
                  id: 'zoneArmor',
                  label: translate (locale, 'titlebar.tabs.zonearmor'),
                }
              ));
            }

            return Just (baseTabs);
          }
        }
      }
    }

    return Nothing ();
  }
);
