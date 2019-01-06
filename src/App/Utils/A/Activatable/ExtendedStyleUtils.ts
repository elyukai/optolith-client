import { pipe } from "ramda";
import { equals } from "../../../../Data/Eq";
import { thrush } from "../../../../Data/Function";
import { Lens, over, set } from "../../../../Data/Lens";
import { append, elem, findIndex, isList, List, ListI, map, modifyAt, partition } from "../../../../Data/List";
import { alt, fmap, fromJust, fromMaybe, isJust, isNothing, Just, liftM2, Maybe, Nothing } from "../../../../Data/Maybe";
import { fst, snd } from "../../../../Data/Pair";
import { Record } from "../../../../Data/Record";
import { HeroModelL, HeroModelRecord } from "../../../Models/Hero/HeroModel";
import { StyleDependency, StyleDependencyL } from "../../../Models/Hero/StyleDependency";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";

const {
  combatStyleDependencies,
  magicalStyleDependencies,
  blessedStyleDependencies,
} = HeroModelL

const { id, gr, extended } = SpecialAbility.A
const { id: dpid, active, origin } = StyleDependency.A

type StyleDependenciesLens = Lens<HeroModelRecord, List<Record<StyleDependency>>>

export type StyleDependencyStateKeys =
  "combatStyleDependencies" |
  "magicalStyleDependencies" |
  "blessedStyleDependencies"

/**
 * Checks if the given entry is a Style Special Ability and which state key it
 * belongs to.
 */
const lensByStyle =
  (x: Record<SpecialAbility>): Maybe<StyleDependenciesLens> => {
    if (gr (x) === 9 || gr (x) === 10) {
      return Just (combatStyleDependencies)
    }

    if (gr (x) === 13) {
      return Just (magicalStyleDependencies)
    }

    if (gr (x) === 25) {
      return Just (blessedStyleDependencies)
    }

    return Nothing
  }

/**
 * Checks if the given entry is an Extended Special Ability and which state key
 * it belongs to.
 */
const lensByExtended =
  (x: Record<SpecialAbility>): Maybe<StyleDependenciesLens> => {
    if (gr (x) === 11) {
      return Just (combatStyleDependencies)
    }
    else if (gr (x) === 14) {
      return Just (magicalStyleDependencies)
    }
    else if (gr (x) === 26) {
      return Just (blessedStyleDependencies)
    }

    return Nothing
  }

/**
 * Adds extended special ability dependencies if the passed entry is a style
 * special ability.
 * @param hero Dependent instances state slice.
 * @param hero_entry The special ability you want to add extended entry
 * dependencies for.
 * @returns Changed state slice.
 */
export const addStyleExtendedSpecialAbilityDependencies =
  (hero_entry: Record<SpecialAbility>) =>
  (hero: HeroModelRecord): HeroModelRecord => {
    const ml = lensByStyle (hero_entry)

    const mnewxs =
      pipe (
             extended,
             fmap (map (x => StyleDependency ({ id: x, origin: id (hero_entry) })))
           )
           (hero_entry)

    type DependencyList = List<Record<StyleDependency>>

    return fromMaybe (hero)
                     (liftM2 ((l: StyleDependenciesLens) => (newxs: DependencyList) =>
                               over (l)
                                    (pipe (
                                      map (x => {
                                        const current_id = dpid (x)
                                        const current_active = active (x)

                                        // TODO: Add proper comments
                                        if (isList (current_id) && isJust (current_active)) {
                                          const index =
                                            findIndex (pipe (
                                                              dpid,
                                                              equals,
                                                              thrush (fromJust (current_active))
                                                            ))
                                                      (newxs)

                                          if (isJust (index)) {
                                            return set (StyleDependencyL.active)
                                                       (Nothing)
                                                       (x)
                                          }
                                        }

                                        return x
                                      }),
                                      append (newxs)
                                    ))
                                    (hero))
                             (ml)
                             (mnewxs))
  }

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been added.
 * @param hero Dependent instances state slice.
 * @param hero_entry The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export const addExtendedSpecialAbilityDependency =
  (hero_entry: Record<SpecialAbility>) =>
  (hero: HeroModelRecord): HeroModelRecord =>
    fromMaybe
      (hero)
      (fmap ((l: Lens<HeroModelRecord, List<Record<StyleDependency>>>) =>
              over (l)
                   (xs =>
                     modifyAt<ListI<typeof xs>>
                      (fromMaybe
                        (-1)
                        (getIndexForExtendedSpecialAbilityDependency (hero_entry)
                                                                     (xs)))
                      (set (StyleDependencyL.active) (Just (id (hero_entry))))
                      (xs))
                   (hero))
            (lensByExtended (hero_entry))
  )

const getIndexForExtendedSpecialAbilityDependency =
  (hero_entry: Record<SpecialAbility>) =>
  (xs: List<Record<StyleDependency>>) =>
        /**
         * Checks if requested entry is plain dependency.
         */
    alt (findIndex (pipe (dpid, equals, thrush (id (hero_entry))))
                   (xs))

        /**
         * Otherwise check if the requested entry is part of a list of
         * options.
         */
        (findIndex ((e: ListI<typeof xs>) => {
                     const e_id = dpid (e)

                     return isList (e_id)
                       && elem (id (hero_entry)) (e_id)
                   })
                   (xs))


/**
 * A combination of `addStyleExtendedSpecialAbilityDependencies` and
 * `addExtendedSpecialAbilityDependency`.
 */
export const addAllStyleRelatedDependencies =
  (hero_entry: Record<SpecialAbility>) =>
    pipe (
      addStyleExtendedSpecialAbilityDependencies (hero_entry),
      addExtendedSpecialAbilityDependency (hero_entry)
    )

/**
 * Split the objects from the ability to to be removed (`fst`) and remaining
 * (`snd`) objects.
 */
const getSplittedRemainingAndToRemove =
  (styleId: string) =>
    partition<Record<StyleDependency>> (pipe (origin, equals (styleId)))

/**
 * Checks if there is a second object to move the active
 * dependency
 */
const checkForAlternativeIndex =
  (dependency: Record<StyleDependency>): (leftItems: List<Record<StyleDependency>>) => number =>
    pipe (
      findIndex (e => {
                  const current_id = dpid (e)
                  const current_active = active (dependency)

                  // If no List, the ids must be equal
                  if (typeof current_id === "string") {
                    return equals (current_active) (Just (current_id))
                  }

                  // Must be in List but List must not be used
                  return isJust (current_active)
                    && elem (fromJust (current_active)) (current_id)
                    && isNothing (active (e))
                }),
      fromMaybe (-1)
    )

/**
 * Removes extended special ability dependencies if the passed entry is a style
 * special ability.
 * @param hero Dependent instances state slice.
 * @param instance The special ability you want to remove extended entry
 * dependencies for.
 * @returns Changed state slice.
 */
export const removeStyleExtendedSpecialAbilityDependencies =
  (hero_entry: Record<SpecialAbility>) =>
  (hero: HeroModelRecord): HeroModelRecord =>
  Maybe.fromMaybe (hero) (
    lensByStyle (hero_entry)
      .bind (key =>
        hero_entry.lookup ("extended")
          .fmap (() =>
            hero.modify<StyleDependencyStateKeys> (
              slice => {
                const splitted = getSplittedRemainingAndToRemove (hero_entry.get ("id")) (slice)
                const itemsToRemove = fst (splitted)
                const leftItems = snd (splitted)

                return itemsToRemove
                  .filter (e => Maybe.isJust (e.lookup ("active")))
                  .foldl<List<Record<StyleDependency>>> (
                    accRemain => dependency =>
                      accRemain.modifyAt (
                        checkForAlternativeIndex (leftItems, dependency),
                        x => x.update (() => dependency.lookup ("active")) ("active")
                      )
                  ) (leftItems)
              }
            ) (key)
          )
      )
  )

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been removed.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export const removeExtendedSpecialAbilityDependency = (
  state: HeroModelRecord,
  instance: Record<SpecialAbility>,
): HeroModelRecord =>
  Maybe.fromMaybe (state) (
    lensByExtended (instance)
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
                  e.get ("id") instanceof List
                  && (e.get ("id") as List<string>).elem (instance.get ("id"))
                  && e.lookup ("active").equals (instance.lookup ("id"))
              )
                /**
                 * Otherwise checks if requested entry is plain dependency.
                 *
                 * Also, it only has to affect the current instance, because
                 * only that is about to be removed.
                 */
                .alt (slice.findIndex (
                  e =>
                    e.get ("id") === instance.get ("id")
                    && e.lookup ("active").equals (instance.lookup ("id"))
                ))
            ),
            // Maybe.Nothing removes the property from the record.
            entry => entry.update (Maybe.empty) ("active")
          )
        ) (key)
      )
  )

/**
 * A combination of `removeStyleExtendedSpecialAbilityDependencies` and
 * `removeExtendedSpecialAbilityDependency`.
 */
export const removeAllStyleRelatedDependencies = (
  state: HeroModelRecord,
  instance: Record<SpecialAbility>,
): HeroModelRecord => {
  const pipe = pipe (
    (pipedState: HeroModelRecord) =>
      removeStyleExtendedSpecialAbilityDependencies (pipedState, instance),
    (pipedState: HeroModelRecord) =>
      removeExtendedSpecialAbilityDependency (pipedState, instance),
  )

  return pipe (state)
}

/**
 * Return flat array of available extended special abilities' IDs.
 * @param list List of set extended special ability objects.
 */
const getAvailableExtendedSpecialAbilities = (
  list: List<Record<StyleDependency>>,
): List<string> =>
  list.foldl<List<string>> (
    arr => e => {
      if (Maybe.isNothing (e.lookup ("active"))) {
        const id = e.get ("id")

        return id instanceof List ? arr.mappend (id) : arr.append (id)
      }

      return arr
    }
  ) (List.of ())

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
  )


/**
 * Checks if the passed special ability is a style and if it is valid to remove
 * based on registered extended special abilities.
 * @param state Dependent instances state slice.
 * @param entry The special ability to check.
 */
export const isStyleValidToRemove = (
  state: HeroModelRecord,
  maybeInstance: Maybe<Record<SpecialAbility>>,
): boolean =>
  Maybe.fromMaybe (false) (
    maybeInstance.fmap (
      instance => Maybe.fromMaybe (true) (
        lensByStyle (instance)
          .fmap (key => {
            const {
              itemsToRemove,
              leftItems
            } = getSplittedRemainingAndToRemove (
              state.get (key),
              instance.get ("id")
            )

            return !itemsToRemove
              .filter (e => Maybe.isJust (e.lookup ("active")))
              .any (dependency =>
                checkForAlternativeIndex (leftItems, dependency) === -1
              )
          })
      )
    )
  )
