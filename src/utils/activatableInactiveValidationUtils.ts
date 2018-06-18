import { ActivatableCategory, Categories } from '../constants/Categories';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import * as CheckStyleUtils from './checkStyleUtils';
import { List, Maybe, OrderedMap, Record } from './dataUtils';
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
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  entry: Wiki.Activatable,
): boolean => {
  const category = entry.get('category') as ActivatableCategory;

  if (
    category === Categories.SPECIAL_ABILITIES
  ) {
    if (CheckStyleUtils.isCombatStyleSpecialAbility(entry)) {
      const combinationSA =
        getHeroStateListItem<Record<Data.ActivatableDependent>>(
          'SA_164'
        )(state);

      if (Maybe.isNothing(combinationSA)) {
        if (hasActiveGroupEntry(wiki, state, 9, 10)) {
          return false;
        }
      }
      else {
        if (isActive(combinationSA)) {
          const totalActive = countActiveGroupEntries(wiki, state, 9, 10);
          const equalTypeStylesActive =
            countActiveGroupEntries(
              wiki, state, ...Maybe.maybeToList(entry.lookup('gr'))
            );

          if (totalActive >= 3 || equalTypeStylesActive >= 2) {
            return false;
          }
        }
        else {
          if (hasActiveGroupEntry(
            wiki, state, ...Maybe.maybeToList(entry.lookup('gr'))
          )) {
            return false;
          }
        }
      }
    }
    else if (
      category === Categories.SPECIAL_ABILITIES
      && entry.lookup('gr').equals(Maybe.Just(13))
    ) {
      const combinationSA = state.get('specialAbilities').lookup('SA_266');
      const totalActive = countActiveGroupEntries(wiki, state, 13);

      if (totalActive >= (isActive(combinationSA) ? 2 : 1)) {
        return false;
      }
    }
    else if (
      category === Categories.SPECIAL_ABILITIES
      && entry.lookup('gr').equals(Maybe.Just(25))
    ) {
      if (hasActiveGroupEntry(wiki, state, 25)) {
        return false;
      }
    }
    else if (entry.get('id') === 'SA_164') {
      if (!hasActiveGroupEntry(wiki, state, 9, 10)) {
        return false;
      }
    }
    else if (entry.get('id') === 'SA_266') {
      if (!hasActiveGroupEntry(wiki, state, 13)) {
        return false;
      }
    }
    else if (entry.get('id') === 'SA_667') {
      if (hasActiveGroupEntry(wiki, state, 30)) {
        return false;
      }
    }
    else if (
      category === Categories.SPECIAL_ABILITIES
      && entry.lookup('gr').equals(Maybe.Just(30))
    ) {
      const darkPactSA = state.get('specialAbilities').lookup('SA_667');

      const allPactPresents = getAllEntriesByGroup(
        wiki.get('specialAbilities'),
        state.get('specialAbilities'),
        30,
      );

      const countPactPresents = allPactPresents.foldl(n => obj => {
        if (isActive(obj)) {
          const wikiObj = wiki.get('specialAbilities')
            .lookup(obj.get('id'));

          if (
            Maybe.isJust(wikiObj)
            && Maybe.fromJust(wikiObj)
              .get('prerequisites') instanceof OrderedMap
            && Maybe.fromJust(wikiObj).get('cost') instanceof List
            && typeof Maybe.fromJust(wikiObj).get('tiers') === 'number'
          ) {
            return n + Maybe.fromMaybe(
              0,
              obj.get('active').head().bind(e => e.lookup('tier'))
            );
          }

          return n + 1;
        }

        return n;
      }, 0);

      const pact = state.lookup('pact');

      if (
        isActive(darkPactSA)
        || !Maybe.isJust(pact)
        || Maybe.fromJust(pact).get('level') <= countPactPresents
      ) {
        return false;
      }
    }
    else if (entry.get('id') === 'SA_699') {
      if (
        state.get('rules')
          .get('enableLanguageSpecializations') === false
      ) {
        return false;
      }
    }
  }

  return validatePrerequisites(
    wiki,
    state,
    getFirstTierPrerequisites(entry.get('prerequisites')),
    entry.get('id'),
  );
};

const hasGeneralRestrictionToAdd =
  (instance: Maybe<Record<Data.ActivatableDependent>>) =>
    instance
      .map(e => e.get('dependencies').elem(false))
      .equals(Maybe.Just(true));

const hasReachedMaximumEntries = (
  instance: Maybe<Record<Data.ActivatableDependent>>,
  entry: Wiki.Activatable
) => {
  const max = entry.lookup('max');

  return Maybe.isJust(max) && Maybe.fromMaybe(
    0, instance.map(e => e.get('active').length())
  ) >= Maybe.fromJust(max);
};

const hasReachedImpossibleMaximumLevel =
  (maxTier: Maybe<number>) => maxTier.equals(Maybe.Just(0));

const isInvalidExtendedSpecialAbility = (
  entry: Wiki.Activatable,
  validExtendedSpecialAbilities: List<string>
) =>
  CheckStyleUtils.isExtendedSpecialAbility(entry)
  && validExtendedSpecialAbilities.elem(entry.get('id'));

/**
 * Checks if the given entry can be added.
 * @param obj
 * @param state The current hero's state.
 */
export const isAdditionDisabled = (
  wiki: Record<Wiki.WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  validExtendedSpecialAbilities: List<string>,
  entry: Wiki.Activatable,
  maxTier: Maybe<number>,
) =>
  isAdditionDisabledEntrySpecific(wiki, state, entry)
  && hasGeneralRestrictionToAdd(instance)
  && hasReachedMaximumEntries(instance, entry)
  && hasReachedImpossibleMaximumLevel(maxTier)
  && isInvalidExtendedSpecialAbility(entry, validExtendedSpecialAbilities);
