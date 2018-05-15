import R from 'ramda';
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
const isAdditionDisabledEntrySpecific = (
  wiki: WikiState,
  state: Data.HeroDependent,
  instance: Data.ActivatableDependent,
): boolean => {
  return R.defaultTo(true, getWikiEntry<Wiki.Activatable>(wiki, instance.id)
    .fmap(entry => {
      if (entry.category === Categories.SPECIAL_ABILITIES) {
        if (CheckStyleUtils.isCombatStyleSpecialAbility(entry)) {
          const combinationSA =
            getHeroStateListItem<Data.ActivatableDependent>('SA_164')(state);

          if (!combinationSA) {
            if (hasActiveGroupEntry(wiki, state, 9, 10)) {
              return false;
            }
          }
          else {
            const combinationAvailable = isActive(combinationSA.value);

            if (combinationAvailable) {
              const totalActive = countActiveGroupEntries(wiki, state, 9, 10);
              const equalTypeStylesActive =
                countActiveGroupEntries(wiki, state, entry.gr);

              if (totalActive >= 3 || equalTypeStylesActive >= 2) {
                return false;
              }
            }
            else {
              if (hasActiveGroupEntry(wiki, state, entry.gr)) {
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
          const totalActive = countActiveGroupEntries(wiki, state, 13);

          if (totalActive >= (isActive(combinationSA) ? 2 : 1)) {
            return false;
          }
        }
        else if (
          entry.category === Categories.SPECIAL_ABILITIES
          && entry.gr === 25
        ) {
          if (hasActiveGroupEntry(wiki, state, 25)) {
            return false;
          }
        }
        else if (entry.id === 'SA_164') {
          if (!hasActiveGroupEntry(wiki, state, 9, 10)) {
            return false;
          }
        }
        else if (entry.id === 'SA_266') {
          if (!hasActiveGroupEntry(wiki, state, 13)) {
            return false;
          }
        }
        else if (entry.id === 'SA_667') {
          if (hasActiveGroupEntry(wiki, state, 30)) {
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
            state.specialAbilities,
            30,
          );

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
            || state.pact === undefined
            || state.pact.level <= countPactPresents
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
      );
    })
    .value
  );
};

/**
 * Checks if the given entry can be added.
 * @param obj
 * @param state The current hero's state.
 */
export const isAdditionDisabled = (
  wiki: WikiState,
  instance: Data.ActivatableDependent,
  state: Data.HeroDependent,
  validExtendedSpecialAbilities: string[],
  entry: Wiki.Activatable,
  maxTier: number | undefined,
) => {
  return R.allPass([
    R.always(isAdditionDisabledEntrySpecific(wiki, state, instance)),
    R.always(R.not(R.contains(false, instance.dependencies))),
    R.either(
      R.always(R.equals(entry.max, undefined)),
      R.always(R.lt(instance.active.length, entry.max!)),
    ),
    R.either(
      R.always(R.equals(entry.tiers, undefined)),
      R.always(R.not(R.equals(maxTier, 0))),
    ),
    R.either(
      R.always(R.not(CheckStyleUtils.isExtendedSpecialAbility(entry))),
      R.always(R.contains(entry.id, validExtendedSpecialAbilities)),
    ),
  ])();
};
