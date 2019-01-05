import { Advantage, Disadvantage, SpecialAbility, WikiEntryRecordByCategory } from '../App/Models/Wiki/wikiTypeHelpers';
import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { filterByInstancePropertyAvailability, ObjectWithStateEntry } from '../App/Utils/RulesUtils';
import { getWikiStateKeyByCategory } from '../App/Utils/WikiUtils';
import { ActivatableCategory, Categories } from '../constants/Categories';
import * as Data from '../types/data';
import { getActivatableStateSliceByCategory } from '../utils/activatable/activatableActiveUtils';
import { getInactiveView } from '../utils/activatable/activatableInactiveUtils';
import { getAllAvailableExtendedSpecialAbilities } from '../utils/activatable/ExtendedStyleUtils';
import { List, Maybe, MaybeContent, Record } from '../utils/dataUtils';
import { getAdventurePointsObject } from './adventurePointsSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import * as stateSelectors from './stateSelectors';

export const getExtendedSpecialAbilitiesToAdd = createMaybeSelector (
  stateSelectors.getBlessedStyleDependencies,
  stateSelectors.getCombatStyleDependencies,
  stateSelectors.getMagicalStyleDependencies,
  (...styleDependencles: Maybe<List<Record<Data.StyleDependency>>>[]) =>
    getAllAvailableExtendedSpecialAbilities (
      ...Maybe.catMaybes (List.fromArray (styleDependencles))
    )
);

export const getDeactiveForView = <T extends ActivatableCategory>(category: T) => {
  return createMaybeSelector (
    stateSelectors.getCurrentHeroPresent,
    stateSelectors.getLocaleAsProp,
    getExtendedSpecialAbilitiesToAdd,
    getAdventurePointsObject,
    stateSelectors.getWiki,
    (maybeHero, locale, validExtendedSpecialAbilities, adventurePoints, wiki) =>
      maybeHero.fmap (
        hero => {
          const wikiKey = getWikiStateKeyByCategory (category);
          const wikiSlice = wiki.get (wikiKey);

          const stateSlice = getActivatableStateSliceByCategory (category) (hero);

          return Maybe.mapMaybe<WikiEntryRecordByCategory[T], Record<Data.DeactiveViewObject>>
            (wikiEntry => getInactiveView (
              wiki,
              stateSlice.lookup (wikiEntry.get ('id')),
              hero,
              validExtendedSpecialAbilities,
              locale,
              adventurePoints,
              wikiEntry
            ))
            (wikiSlice.elems ());
        }
      )
  );
};

export const getDeactiveAdvantages = createMaybeSelector (
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

export const getDeactiveDisadvantages = createMaybeSelector (
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

export const getDeactiveSpecialAbilities = createMaybeSelector (
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
