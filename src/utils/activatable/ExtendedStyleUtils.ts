import * as R from 'ramda';
import { HeroDependent, StyleDependency } from '../../types/data';
import { SpecialAbility } from '../../types/wiki';
import { List, Maybe, Record } from './dataUtils';

export type StyleDependencyStateKeys =
  'combatStyleDependencies' |
  'magicalStyleDependencies' |
  'blessedStyleDependencies';

/**
 * Checks if the given entry is a Style Special Ability and which state key it
 * belongs to.
 * @param entry
 * @returns A state key or `undefined` if not a Style Special Ability.
 */
const getStyleStateKey = (
  entry: Record<SpecialAbility>,
): Maybe<StyleDependencyStateKeys> => {
  if (entry.get ('gr') === 9 || entry.get ('gr') === 10) {
    return Maybe.pure<StyleDependencyStateKeys> ('combatStyleDependencies');
  }
  else if (entry.get ('gr') === 13) {
    return Maybe.pure<StyleDependencyStateKeys> ('magicalStyleDependencies');
  }
  else if (entry.get ('gr') === 25) {
    return Maybe.pure<StyleDependencyStateKeys> ('blessedStyleDependencies');
  }

  return Maybe.empty ();
};

/**
 * Checks if the given entry is an Extended Special Ability and which state key it
 * belongs to.
 * @param entry
 * @returns A state key or `undefined` if not an Extended Special Ability.
 */
const getExtendedStateKey = (
  entry: Record<SpecialAbility>,
): Maybe<StyleDependencyStateKeys> => {
  if (entry.get ('gr') === 11) {
    return Maybe.pure<StyleDependencyStateKeys> ('combatStyleDependencies');
  }
  else if (entry.get ('gr') === 14) {
    return Maybe.pure<StyleDependencyStateKeys> ('magicalStyleDependencies');
  }
  else if (entry.get ('gr') === 26) {
    return Maybe.pure<StyleDependencyStateKeys> ('blessedStyleDependencies');
  }

  return Maybe.empty ();
};

/**
 * Adds extended special ability dependencies if the passed entry is a style
 * special ability.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to add extended entry
 * dependencies for.
 * @returns Changed state slice.
 */
export const addStyleExtendedSpecialAbilityDependencies = (
  state: Record<HeroDependent>,
  instance: Record<SpecialAbility>,
): Record<HeroDependent> =>
  Maybe.fromMaybe (state) (
    getStyleStateKey (instance)
      .bind (key =>
        instance.lookup ('extended')
          .fmap (extended => {
            const newItems = extended.map (id => Record.of ({
              id,
              origin: instance.get ('id')
            }));

            return state.modify<StyleDependencyStateKeys> (
              slice =>
                slice
                  .map (dependency => {
                    const { id, active } = dependency.toObject ();

                    if (id instanceof List && typeof active === 'string') {
                      const index = newItems.findIndex (
                        e => e.get ('id') === active
                      );

                      if (Maybe.isJust (index)) {
                        return dependency.update (Maybe.empty) ('active');
                      }
                    }

                    return dependency;
                  })
                  .mappend (newItems)
            ) (key);
          })
      )
  );

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been added.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export const addExtendedSpecialAbilityDependency = (
  state: Record<HeroDependent>,
  instance: Record<SpecialAbility>,
): Record<HeroDependent> =>
  Maybe.fromMaybe (state) (
    getExtendedStateKey (instance)
      .fmap (key =>
        state.modify<StyleDependencyStateKeys> (
          slice => slice.modifyAt (
            Maybe.fromMaybe (-1) (
              /**
               * Checks if requested entry is plain dependency.
               */
              slice.findIndex (
                e => e.get ('id') === instance.get ('id')
              )
                /**
                 * Otherwise check if the requested entry is part of a list of
                 * options.
                 */
                .alt (slice.findIndex (
                  e =>
                    e.get ('id') instanceof List
                    && (e.get ('id') as List<string>).elem (instance.get ('id'))
                ))
            ),
            entry => entry.insert ('active') (instance.get ('id'))
          )
        ) (key)
      )
  );

/**
 * A combination of `addStyleExtendedSpecialAbilityDependencies` and
 * `addExtendedSpecialAbilityDependency`.
 */
export const addAllStyleRelatedDependencies = (
  state: Record<HeroDependent>,
  instance: Record<SpecialAbility>,
): Record<HeroDependent> => {
  const pipe = R.pipe (
    (pipedState: Record<HeroDependent>) =>
      addStyleExtendedSpecialAbilityDependencies (pipedState, instance),
    (pipedState: Record<HeroDependent>) =>
      addExtendedSpecialAbilityDependency (pipedState, instance),
  );

  return pipe (state);
};

interface SplittedRemainingAndToRemove {
  itemsToRemove: List<Record<StyleDependency>>;
  leftItems: List<Record<StyleDependency>>;
}

/**
 * Split the objects from the ability to remove and remaining objects.
 * @param items The respective list of style dependencies.
 * @param styleId The id of the style to remove.
 */
const getSplittedRemainingAndToRemove = (
  items: List<Record<StyleDependency>>,
  styleId: string,
): SplittedRemainingAndToRemove => {
  const initialObj: SplittedRemainingAndToRemove = {
    itemsToRemove: List.of (),
    leftItems: List.of ()
  };

  return items.foldl<SplittedRemainingAndToRemove> (
    obj => dependency => {
      if (dependency.get ('origin') === styleId) {
        return {
          ...obj,
          itemsToRemove: obj.itemsToRemove.append (dependency)
        };
      }

      return {
        ...obj,
        leftItems: obj.leftItems.append (dependency)
      };
    }
  ) (initialObj);
};

/**
 * Checks if there is a second object to move the active
 * dependency
 */
const checkForAlternativeIndex = (
  leftItems: List<Record<StyleDependency>>,
  dependency: Record<StyleDependency>
) =>
  Maybe.fromMaybe (-1) (
    leftItems.findIndex (e => {
      const id = e.get ('id');
      const active = dependency.lookup ('active');

      // If no List, the ids must be equal
      if (typeof id === 'string') {
        return active
          .equals (Maybe.pure (id));
      }

      // Must be in List but List must not be used
      return Maybe.isJust (active)
        && id.elem (Maybe.fromJust (active))
        && Maybe.isNothing (e.lookup ('active'));
    })
  );

/**
 * Removes extended special ability dependencies if the passed entry is a style
 * special ability.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to remove extended entry
 * dependencies for.
 * @returns Changed state slice.
 */
export const removeStyleExtendedSpecialAbilityDependencies = (
  state: Record<HeroDependent>,
  instance: Record<SpecialAbility>,
): Record<HeroDependent> =>
  Maybe.fromMaybe (state) (
    getStyleStateKey (instance)
      .bind (key =>
        instance.lookup ('extended')
          .fmap (() =>
            state.modify<StyleDependencyStateKeys> (
              slice => {
                const {
                  itemsToRemove,
                  leftItems
                } = getSplittedRemainingAndToRemove (slice, instance.get ('id'));

                return itemsToRemove
                  .filter (e => Maybe.isJust (e.lookup ('active')))
                  .foldl<List<Record<StyleDependency>>> (
                    accRemain => dependency =>
                      accRemain.modifyAt (
                        checkForAlternativeIndex (leftItems, dependency),
                        x => x.update (() => dependency.lookup ('active')) ('active')
                      )
                  ) (leftItems)
              }
            ) (key)
          )
      )
  );

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been removed.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export const removeExtendedSpecialAbilityDependency = (
  state: Record<HeroDependent>,
  instance: Record<SpecialAbility>,
): Record<HeroDependent> =>
  Maybe.fromMaybe (state) (
    getExtendedStateKey (instance)
      .fmap (key =>
        state.modify<StyleDependencyStateKeys> (
          slice => slice.modifyAt (
            Maybe.fromMaybe (-1) (
              /**
               * Check if the requested entry is part of a list of options.
               *
               * Also, it only has to affect the current instance, because only
               * that is about to be removed.
               */
              slice.findIndex (
                e =>
                  e.get ('id') instanceof List
                  && (e.get ('id') as List<string>).elem (instance.get ('id'))
                  && e.lookup ('active').equals (instance.lookup ('id'))
              )
                /**
                 * Otherwise checks if requested entry is plain dependency.
                 *
                 * Also, it only has to affect the current instance, because
                 * only that is about to be removed.
                 */
                .alt (slice.findIndex (
                  e =>
                    e.get ('id') === instance.get ('id')
                    && e.lookup ('active').equals (instance.lookup ('id'))
                ))
            ),
            // Maybe.Nothing removes the property from the record.
            entry => entry.update (Maybe.empty) ('active')
          )
        ) (key)
      )
  );

/**
 * A combination of `removeStyleExtendedSpecialAbilityDependencies` and
 * `removeExtendedSpecialAbilityDependency`.
 */
export const removeAllStyleRelatedDependencies = (
  state: Record<HeroDependent>,
  instance: Record<SpecialAbility>,
): Record<HeroDependent> => {
  const pipe = R.pipe (
    (pipedState: Record<HeroDependent>) =>
      removeStyleExtendedSpecialAbilityDependencies (pipedState, instance),
    (pipedState: Record<HeroDependent>) =>
      removeExtendedSpecialAbilityDependency (pipedState, instance),
  );

  return pipe (state);
};

/**
 * Return flat array of available extended special abilities' IDs.
 * @param list List of set extended special ability objects.
 */
const getAvailableExtendedSpecialAbilities = (
  list: List<Record<StyleDependency>>,
): List<string> =>
  list.foldl<List<string>> (
    arr => e => {
      if (Maybe.isNothing (e.lookup ('active'))) {
        const id = e.get ('id');

        return id instanceof List ? arr.mappend (id) : arr.append (id);
      }

      return arr;
    }
  ) (List.of ());

/**
 * Calculates a list of available Extended Special Abilties. The availability is
 * only based on bought Style Special Abilities, so (other) prerequisites have
 * to be checked separately.
 * @param styleDependencies
 */
export const getAllAvailableExtendedSpecialAbilities = (
  ...styleDependencies: List<Record<StyleDependency>>[]
): List<string> =>
  styleDependencies.reduce<List<string>> (
    (idList, dependencyArr) =>
      idList.mappend (getAvailableExtendedSpecialAbilities (dependencyArr)),
    List.of ()
  );


/**
 * Checks if the passed special ability is a style and if it is valid to remove
 * based on registered extended special abilities.
 * @param state Dependent instances state slice.
 * @param entry The special ability to check.
 */
export const isStyleValidToRemove = (
  state: Record<HeroDependent>,
  maybeInstance: Maybe<Record<SpecialAbility>>,
): boolean =>
  Maybe.fromMaybe (false) (
    maybeInstance.fmap (
      instance => Maybe.fromMaybe (true) (
        getStyleStateKey (instance)
          .fmap (key => {
            const {
              itemsToRemove,
              leftItems
            } = getSplittedRemainingAndToRemove (
              state.get (key),
              instance.get ('id')
            );

            return !itemsToRemove
              .filter (e => Maybe.isJust (e.lookup ('active')))
              .any (dependency =>
                checkForAlternativeIndex (leftItems, dependency) === -1
              )
          })
      )
    )
  );
