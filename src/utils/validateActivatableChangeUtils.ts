import { Pact } from '../actions/PactActions';
import { Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki';
import { isStyleValidToRemove } from './ExtendedStyleUtils';
import { isOwnTradition } from './LiturgyUtils';
import { getWikiEntry } from './WikiUtils';
import * as CheckStyleUtils from './checkStyleUtils';
import { convertMapToValueArray, filterExisting } from './collectionUtils';
import { maybe } from './exists';
import { flattenPrerequisites, getFirstTierPrerequisites } from './flattenPrerequisites';
import { getAllEntriesByGroup, getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { pipe } from './pipe';
import { getActiveSelections } from './selectionUtils';
import { getBlessedTraditionFromWiki } from './traditionUtils';
import { validateObject, validatePrerequisites } from './validatePrerequisitesUtils';

/**
 * Checks if you can somehow add an ActiveObject to the given entry.
 * @param state The present state of the current hero.
 * @param instance The entry.
 */
export function isActivatable(
  wiki: WikiState,
  state: Data.HeroDependent,
  pact: Pact | undefined,
  instance: Data.ActivatableDependent,
): boolean {
  return pipe(
    maybe<Wiki.Activatable, boolean>(entry => {
      if (entry.category === Categories.SPECIAL_ABILITIES) {
        if (CheckStyleUtils.isCombatStyleSpecialAbility(entry)) {
          const combinationSA = getHeroStateListItem<Data.ActivatableDependent>(state, 'SA_164');

          if (!combinationSA) {
            const allStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 9, 10);

            const totalActive = allStyles.filter(e => isActive(e)).length;

            if (totalActive >= 1) {
              return false;
            }
          }
          else {
            const combinationAvailable = isActive(combinationSA);
            if (combinationAvailable) {
              const allStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 9, 10);
              const allEqualTypeStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, entry.gr);

              const totalActive = allStyles.filter(e => isActive(e)).length;
              const equalTypeStyleActive = allEqualTypeStyles.filter(e => isActive(e)).length;

              if (totalActive >= 3 || equalTypeStyleActive >= 2) {
                return false;
              }
            }
            else {
              const allEqualTypeStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, entry.gr);

              if (allEqualTypeStyles.find(e => isActive(e))) {
                return false;
              }
            }
          }
        }
        else if (entry.category === Categories.SPECIAL_ABILITIES && entry.gr === 13) {
          const combinationSA = state.specialAbilities.get('SA_266');
          const allStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 13);

          const totalActive = allStyles.filter(e => isActive(e)).length;

          if (totalActive >= (isActive(combinationSA) ? 2 : 1)) {
            return false;
          }
        }
        else if (entry.category === Categories.SPECIAL_ABILITIES && entry.gr === 25) {
          const allStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 25);

          const totalActive = allStyles.filter(e => isActive(e)).length;

          if (totalActive >= 1) {
            return false;
          }
        }
        else if (entry.id === 'SA_164') {
          const allStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 9, 10);;
          const isOneActive = allStyles.find(e => isActive(e));

          if (!isOneActive) {
            return false;
          }
        }
        else if (entry.id === 'SA_266') {
          const allStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 13);
          const isOneActive = allStyles.find(e => isActive(e));

          if (!isOneActive) {
            return false;
          }
        }
        else if (entry.id === 'SA_667') {
          const allPactPresents = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 30);

          if (allPactPresents.some(e => isActive(e))) {
            return false;
          }
        }
        else if (entry.category === Categories.SPECIAL_ABILITIES && entry.gr === 30) {
          const darkPactSA = state.specialAbilities.get('SA_667');
          const allPactPresents = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 30);

          const countPactPresents = allPactPresents.reduce((n, obj) => {
            if (isActive(obj)) {
              const wikiObj = wiki.specialAbilities.get(obj.id);
              if (
                wikiObj &&
                !Array.isArray(wikiObj.prerequisites) &&
                Array.isArray(wikiObj.cost) &&
                typeof wikiObj.tiers === 'number'
              ) {
                return n + obj.active[0].tier!;
              }
              return n + 1;
            }
            return n;
          }, 0);
          if (isActive(darkPactSA) || pact === undefined || pact.level <= countPactPresents) {
            return false;
          }
        }
        else if (entry.id === 'SA_699') {
          if (state.rules.enableLanguageSpecializations === false) {
            return false;
          }
        }
      }

      return validatePrerequisites(wiki, state, getFirstTierPrerequisites(entry.prerequisites), instance.id, pact);
    }, false)
  )(getWikiEntry<Wiki.Activatable>(wiki, instance.id));
}

/**
 * Checks if you can somehow remove an ActiveObject from the given entry.
 * @param state The present state of the current hero.
 * @param obj The entry.
 * @param sid The sid of the ActiveObject
 */
export function isDeactivatable(
  wiki: WikiState,
  state: Data.HeroDependent,
  pact: Pact | undefined,
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
): boolean {
  return pipe<Wiki.Activatable | undefined, boolean>(
    maybe(entry => {
      if (entry.id === 'SA_164') {
        const allArmedStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 9);
        const allUnarmedStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 10);
        const allStyles = [ ...allArmedStyles, ...allUnarmedStyles ];

        const totalActive = allStyles.filter(e => isActive(e)).length;
        const armedStyleActive = allArmedStyles.filter(e => isActive(e)).length;
        const unarmedStyleActive = allUnarmedStyles.filter(e => isActive(e)).length;

        if (totalActive >= 3 || armedStyleActive >= 2 || unarmedStyleActive >= 2) {
          return false;
        }
      }
      else if (entry.id === 'SA_266') {
        const allStyles = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 13);
        const totalActive = allStyles.filter(e => isActive(e)).length;

        if (totalActive >= 2) {
          return false;
        }
      }
      else if (['SA_623', 'SA_625', 'SA_632'].includes(entry.id)) {
        const activeLiturgicalChants = pipe(
          (list: Data.ActivatableSkillDependent[]) => list.filter(e => e.active),
          list => list.map(e => wiki.liturgicalChants.get(e.id)),
          filterExisting,
        )(
          convertMapToValueArray(state.liturgicalChants)
        );

        const blessedTradition = getBlessedTraditionFromWiki(wiki.specialAbilities, state.specialAbilities);

        const hasUnfamiliarEntry = !!blessedTradition && activeLiturgicalChants.some(e => {
          return !isOwnTradition(blessedTradition, e);
        });

        if (hasUnfamiliarEntry) {
          return false;
        }
      }

      if (entry.category === Categories.SPECIAL_ABILITIES) {
        const validStyle = isStyleValidToRemove(state, entry);

        if (validStyle === false) {
          return false;
        }
      }

      const dependencies = instance.dependencies.filter(e => {
        if (typeof e === 'object' && e.origin) {
          const origin = getWikiEntry<Wiki.WikiActivatable>(wiki, e.origin);

          if (origin) {
            const req = flattenPrerequisites(origin.prerequisites, origin.tiers || 1)
              .find((r): r is Wiki.AllRequirementObjects =>
                typeof r !== 'string' &&
                Array.isArray(r.id) &&
                !!e.origin &&
                r.id.includes(e.origin)
              );

            if (req) {
              const resultOfAll = (req.id as string[]).map(e =>
                validateObject(
                  wiki,
                  state,
                  { ...req, id: e } as Wiki.AllRequirementObjects,
                  entry.id,
                  pact,
                )
              );
              return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? true : false;
            }
          }
          return true;
        }
        else if (typeof e === 'object' && Array.isArray(e.sid)) {
          const list = e.sid;
          const sid = active.sid as number;
          if (list.includes(sid)) {
            return !getActiveSelections(instance).some(n => {
              return n !== sid && list.includes(n as number);
            });
          }
        }
        return true;
      });

      return dependencies.length === 0;
    }, false)
  )(getWikiEntry<Wiki.Activatable>(wiki, instance.id));
}
