import { createSelector } from 'reselect';
import { ActivatableCategory, Categories } from '../constants/Categories';
import * as Data from '../types/data';
import { Advantage, Disadvantage, SpecialAbility, WikiEntryRecordByCategory } from '../types/wiki';
import { getInactiveView } from '../utils/activatableInactiveUtils';
import { List, Maybe, MaybeContent, Record } from '../utils/dataUtils';
import { getAllAvailableExtendedSpecialAbilities } from '../utils/ExtendedStyleUtils';
import { filterByInstancePropertyAvailability, ObjectWithStateEntry } from '../utils/RulesUtils';
import { getWikiStateKeyByCategory } from '../utils/WikiUtils';
import { getActivatableStateSliceByCategory } from './activatableSelectors';
import { getAdventurePointsObject } from './adventurePointsSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import * as stateSelectors from './stateSelectors';

export const getExtendedSpecialAbilitiesToAdd = createSelector (
  stateSelectors.getBlessedStyleDependencies,
  stateSelectors.getCombatStyleDependencies,
  stateSelectors.getMagicalStyleDependencies,
  (...styleDependencles: Maybe<List<Record<Data.StyleDependency>>>[]) =>
    getAllAvailableExtendedSpecialAbilities (
      ...Maybe.catMaybes (List.fromArray (styleDependencles))
    )
);

export const getDeactiveForView = <T extends ActivatableCategory>(category: T) => {
  return createSelector (
    stateSelectors.getCurrentHeroPresent,
    stateSelectors.getLocaleAsProp,
    getExtendedSpecialAbilitiesToAdd,
    getAdventurePointsObject,
    stateSelectors.getWiki,
    (maybeHero, locale, validExtendedSpecialAbilities, adventurePoints, wiki) => {
      return maybeHero.fmap (
        hero => {
          const wikiKey = getWikiStateKeyByCategory (category);
          const wikiSlice = wiki.get (wikiKey);

          const stateSlice = getActivatableStateSliceByCategory (category) (hero);

          return Maybe.mapMaybe<
            WikiEntryRecordByCategory[T],
            Record<Data.DeactiveViewObject>
          > (
            wikiEntry => getInactiveView (
              wiki,
              stateSlice.lookup (wikiEntry.get ('id')),
              hero,
              validExtendedSpecialAbilities,
              locale,
              adventurePoints,
              wikiEntry.get ('id')
            )
          ) (wikiSlice.elems ());
        }
      );
    }
  );
};

export const getDeactiveAdvantages = createSelector (
  getDeactiveForView (Categories.ADVANTAGES),
  getRuleBooksEnabled,
  (maybeList, maybeAvailability) =>
    Maybe.liftM2 ((list: MaybeContent<typeof maybeList>) =>
                    (availability: MaybeContent<typeof maybeAvailability>) =>
                      filterByInstancePropertyAvailability (
                        list as any as List<Record<ObjectWithStateEntry>>,
                        availability
                      ) as any as List<Record<Data.DeactiveViewObject<Advantage>>>)
                 (maybeList)
                 (maybeAvailability)
);

export const getDeactiveDisadvantages = createSelector (
  getDeactiveForView (Categories.DISADVANTAGES),
  getRuleBooksEnabled,
  (maybeList, maybeAvailability) =>
    Maybe.liftM2 ((list: MaybeContent<typeof maybeList>) =>
                    (availability: MaybeContent<typeof maybeAvailability>) =>
                      filterByInstancePropertyAvailability (
                        list as any as List<Record<ObjectWithStateEntry>>,
                        availability
                      ) as any as List<Record<Data.DeactiveViewObject<Disadvantage>>>)
                 (maybeList)
                 (maybeAvailability)
);

export const getDeactiveSpecialAbilities = createSelector (
  getDeactiveForView (Categories.SPECIAL_ABILITIES),
  getRuleBooksEnabled,
  (maybeList, maybeAvailability) =>
    Maybe.liftM2 ((list: MaybeContent<typeof maybeList>) =>
                    (availability: MaybeContent<typeof maybeAvailability>) =>
                      filterByInstancePropertyAvailability (
                        list as any as List<Record<ObjectWithStateEntry>>,
                        availability
                      ) as any as List<Record<Data.DeactiveViewObject<SpecialAbility>>>)
                 (maybeList)
                 (maybeAvailability)
);
