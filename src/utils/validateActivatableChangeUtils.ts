import R from 'ramda';
import { Pact } from '../actions/PactActions';
import { Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki';
import { getWikiEntry } from './WikiUtils';
import * as CheckStyleUtils from './checkStyleUtils';
import { countActiveGroupEntries, hasActiveGroupEntry } from './entryGroupUtils';
import { getFirstTierPrerequisites } from './flattenPrerequisites';
import { getAllEntriesByGroup, getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { validatePrerequisites } from './validatePrerequisitesUtils';

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
  return R.defaultTo(false, getWikiEntry<Wiki.Activatable>(wiki, instance.id)
    .fmap(entry => {
      if (entry.category === Categories.SPECIAL_ABILITIES) {
        if (CheckStyleUtils.isCombatStyleSpecialAbility(entry)) {
          const combinationSA =
            getHeroStateListItem<Data.ActivatableDependent>('SA_164')(state);

          if (!combinationSA) {
            if (hasActiveGroupEntry(wiki, 9, 10)(state)) {
              return false;
            }
          }
          else {
            const combinationAvailable = isActive(combinationSA.value);

            if (combinationAvailable) {
              const totalActive = countActiveGroupEntries(wiki, 9, 10)(state);
              const equalTypeStylesActive =
                countActiveGroupEntries(wiki, entry.gr)(state);

              if (totalActive >= 3 || equalTypeStylesActive >= 2) {
                return false;
              }
            }
            else {
              if (hasActiveGroupEntry(wiki, entry.gr)(state)) {
                return false;
              }
            }
          }
        }
        else if (
          entry.category === Categories.SPECIAL_ABILITIES
          && entry.gr === 13
        ) {
          const combinationSA = state.specialAbilities.get('SA_266');
          const totalActive = countActiveGroupEntries(wiki, 13)(state);

          if (totalActive >= (isActive(combinationSA) ? 2 : 1)) {
            return false;
          }
        }
        else if (
          entry.category === Categories.SPECIAL_ABILITIES
          && entry.gr === 25
        ) {
          if (hasActiveGroupEntry(wiki, 25)(state)) {
            return false;
          }
        }
        else if (entry.id === 'SA_164') {
          if (!hasActiveGroupEntry(wiki, 9, 10)(state)) {
            return false;
          }
        }
        else if (entry.id === 'SA_266') {
          if (!hasActiveGroupEntry(wiki, 13)(state)) {
            return false;
          }
        }
        else if (entry.id === 'SA_667') {
          if (hasActiveGroupEntry(wiki, 30)(state)) {
            return false;
          }
        }
        else if (
          entry.category === Categories.SPECIAL_ABILITIES
          && entry.gr === 30
        ) {
          const darkPactSA = state.specialAbilities.get('SA_667');

          const allPactPresents = getAllEntriesByGroup<Data.ActivatableDependent>(
            wiki.specialAbilities,
            30,
          )(state.specialAbilities);

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

          if (
            isActive(darkPactSA)
            || pact === undefined
            || pact.level <= countPactPresents
          ) {
            return false;
          }
        }
        else if (entry.id === 'SA_699') {
          if (state.rules.enableLanguageSpecializations === false) {
            return false;
          }
        }
      }

      return validatePrerequisites(
        wiki,
        state,
        getFirstTierPrerequisites(entry.prerequisites),
        instance.id,
        pact,
      );
    })
    .value
  );
}
