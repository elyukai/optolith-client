/**
 * Checks if an `Activatable` entry is available to be activated.
 *
 * @file src/utils/activatableInactiveValidationUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import * as CheckStyleUtils from './checkStyleUtils';
import { Just, List, Maybe, OrderedMap, Record } from './dataUtils';
import { countActiveGroupEntries, hasActiveGroupEntry } from './entryGroupUtils';
import { getFirstTierPrerequisites } from './flattenPrerequisites';
import { getAllEntriesByGroup, getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { validatePrerequisites } from './validatePrerequisitesUtils';
import { isSpecialAbility } from './WikiUtils';

const isAdditionDisabledForCombatStyle = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  entry: Record<Wiki.SpecialAbility>
): Maybe<boolean> => {
  const combinationSA =
    getHeroStateListItem<Record<Data.ActivatableDependent>> ('SA_164') (state);

  if (Maybe.isNothing (combinationSA)) {
    if (hasActiveGroupEntry (wiki, state, 9, 10)) {
      return Maybe.pure (false);
    }
  }
  else {
    if (isActive (combinationSA)) {
      const totalActive = countActiveGroupEntries (wiki, state, 9, 10);
      const equalTypeStylesActive =
        countActiveGroupEntries (
          wiki, state, ...Maybe.maybeToList (entry.lookup ('gr'))
        );

      if (totalActive >= 3 || equalTypeStylesActive >= 2) {
        return Maybe.pure (false);
      }
    }
    else {
      if (hasActiveGroupEntry (
        wiki, state, ...Maybe.maybeToList (entry.lookup ('gr'))
      )) {
        return Maybe.pure (false);
      }
    }
  }

  return Maybe.empty ();
}

const isAdditionDisabledSpecialAbilitySpecific = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  entry: Record<Wiki.SpecialAbility>
): Maybe<boolean> => {
  if (CheckStyleUtils.isCombatStyleSpecialAbility (entry)) {
    return isAdditionDisabledForCombatStyle (wiki, state, entry);
  }
  else if (entry.lookup ('gr').equals (Maybe.pure (13))) {
    const combinationSA = state.get ('specialAbilities').lookup ('SA_266');
    const totalActive = countActiveGroupEntries (wiki, state, 13);

    if (totalActive >= (isActive (combinationSA) ? 2 : 1)) {
      return Maybe.pure (false);
    }
  }
  else if (entry.lookup ('gr').equals (Maybe.pure (25))) {
    if (hasActiveGroupEntry (wiki, state, 25)) {
      return Maybe.pure (false);
    }
  }
  else if (entry.get ('id') === 'SA_164') {
    if (!hasActiveGroupEntry (wiki, state, 9, 10)) {
      return Maybe.pure (false);
    }
  }
  else if (entry.get ('id') === 'SA_266') {
    if (!hasActiveGroupEntry (wiki, state, 13)) {
      return Maybe.pure (false);
    }
  }
  else if (entry.get ('id') === 'SA_667') {
    if (hasActiveGroupEntry (wiki, state, 30)) {
      return Maybe.pure (false);
    }
  }
  else if (entry.lookup ('gr').equals (Maybe.pure (30))) {
    const darkPactSA = state.get ('specialAbilities').lookup ('SA_667');

    const allPactPresents = getAllEntriesByGroup (
      wiki.get ('specialAbilities'),
      state.get ('specialAbilities'),
      30
    );

    const countPactPresents = allPactPresents.foldl<number> (
      n => obj => {
        if (isActive (obj)) {
          const wikiObj = wiki.get ('specialAbilities')
            .lookup (obj.get ('id'));

          if (
            Maybe.isJust (wikiObj)
            && Maybe.fromJust (wikiObj)
              .get ('prerequisites') instanceof OrderedMap
            && Maybe.fromJust (wikiObj).get ('cost') instanceof List
            && Maybe.isJust (wikiObj.bind (justWikiObj => justWikiObj.lookup ('tiers')))
          ) {
            return n + Maybe.fromMaybe (0) (
              Maybe.listToMaybe (obj.get ('active')).bind (e => e.lookup ('tier'))
            );
          }

          return n + 1;
        }

        return n;
      }
    ) (0);

    const pact = state.lookup ('pact');

    if (
      isActive (darkPactSA)
      || !Maybe.isJust (pact)
      || Maybe.fromJust (pact).get ('level') <= countPactPresents
    ) {
      return Maybe.pure (false);
    }
  }
  else if (entry.get ('id') === 'SA_699') {
    if (state.get ('rules').get ('enableLanguageSpecializations') === false) {
      return Maybe.pure (false);
    }
  }

  return Maybe.empty ();
};

/**
 * Checks if you can somehow add an ActiveObject to the given entry.
 * @param state The present state of the current hero.
 * @param instance The entry.
 */
const isAdditionDisabledEntrySpecific = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  entry: Wiki.Activatable
): boolean =>
  Maybe.fromJust (
    Maybe.ensure (isSpecialAbility) (entry)
      .bind (
        specialAbility =>
          isAdditionDisabledSpecialAbilitySpecific (wiki, state, specialAbility)
      )
      .alt (Maybe.pure (validatePrerequisites (
        wiki,
        state,
        getFirstTierPrerequisites (entry.get ('prerequisites')),
        entry.get ('id')
      ))) as Just<boolean>
  );

const hasGeneralRestrictionToAdd =
  (instance: Maybe<Record<Data.ActivatableDependent>>) =>
    instance
      .fmap (e => e.get ('dependencies').elem (false))
      .equals (Maybe.pure (true));

const hasReachedMaximumEntries = (
  instance: Maybe<Record<Data.ActivatableDependent>>,
  entry: Wiki.Activatable
) => {
  const max = entry.lookup ('max');

  return Maybe.isJust (max)
    && Maybe.fromMaybe (0) (instance .fmap (e => e.get ('active') .length ()))
      >= Maybe.fromJust (max);
};

const hasReachedImpossibleMaximumLevel =
  (maxTier: Maybe<number>) => maxTier.equals (Maybe.pure (0));

const isInvalidExtendedSpecialAbility = (
  entry: Wiki.Activatable,
  validExtendedSpecialAbilities: List<string>
) =>
  CheckStyleUtils.isExtendedSpecialAbility (entry)
  && validExtendedSpecialAbilities.elem (entry.get ('id'));

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
  maxTier: Maybe<number>
) =>
  isAdditionDisabledEntrySpecific (wiki, state, entry)
  || hasGeneralRestrictionToAdd (instance)
  || hasReachedMaximumEntries (instance, entry)
  || hasReachedImpossibleMaximumLevel (maxTier)
  || isInvalidExtendedSpecialAbility (entry, validExtendedSpecialAbilities);
