import { pipe } from "ramda";
import { equals } from "../../../Data/Eq";
import { flip, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { Lens_, over, set, view } from "../../../Data/Lens";
import { all, append, concatMap, elem, empty, filter, findIndex, flength, foldr, isList, List, ListI, map, modifyAt, partition, pure } from "../../../Data/List";
import { alt, and, any, fromJust, fromMaybe, isJust, isNothing, Just, liftM2, Maybe, Nothing, or } from "../../../Data/Maybe";
import { fst, snd } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import { HeroModelL, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { StyleDependency, StyleDependencyL } from "../../Models/Hero/StyleDependency";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { gt } from "../mathUtils";

const {
  combatStyleDependencies,
  magicalStyleDependencies,
  blessedStyleDependencies,
} = HeroModelL

const { id, gr, extended } = SpecialAbility.A
const { id: dpid, active, origin } = StyleDependency.A

type StyleDependenciesLens = Lens_<HeroModelRecord, List<Record<StyleDependency>>>

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
    if (any (pipe ((flength), equals (3))) (extended (x))) {
      return Nothing
    }

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
                                      map ((x: Record<StyleDependency>) => {
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
      (fmap ((l: Lens_<HeroModelRecord, List<Record<StyleDependency>>>) =>
              over (l)
                   (xs =>
                     modifyAt
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
  (dependency: Record<StyleDependency>):
  (leftItems: List<Record<StyleDependency>>) => number =>
    pipe (
      findIndex ((e: Record<StyleDependency>) => {
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
    fromMaybe
      (hero)
      (fmap ((l: Lens_<HeroModelRecord, List<Record<StyleDependency>>>) =>
              over (l)
                   (xs => {
                     const splitted = getSplittedRemainingAndToRemove (id (hero_entry)) (xs)
                     const itemsToRemove = fst (splitted)
                     const leftItems = snd (splitted)

                     return pipe (
                                   filter<Record<StyleDependency>> (pipe (active, isJust)),
                                   foldr<Record<StyleDependency>, List<Record<StyleDependency>>>
                                     (d => modifyAt
                                       (checkForAlternativeIndex (d) (leftItems))
                                       (set (StyleDependencyL.active) (active (d))))
                                     (leftItems)
                                 )
                                 (itemsToRemove)
                   })
                   (hero))
            (lensByStyle (hero_entry)))

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been removed.
 * @param hero Dependent instances state slice.
 * @param hero_entry The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export const removeExtendedSpecialAbilityDependency =
  (hero_entry: Record<SpecialAbility>) =>
  (hero: HeroModelRecord): HeroModelRecord =>
    fromMaybe
      (hero)
      (fmap ((l: Lens_<HeroModelRecord, List<Record<StyleDependency>>>) =>
              over (l)
                   (xs => modifyAt
                      (fromMaybe
                        (-1)
                        (getIndexForExtendedSpecialAbilityDependency (hero_entry)
                                                                     (xs)))
                      (set (StyleDependencyL.active) (Nothing))
                      (xs))
                   (hero))
            (lensByStyle (hero_entry)))

/**
 * A combination of `removeStyleExtendedSpecialAbilityDependencies` and
 * `removeExtendedSpecialAbilityDependency`.
 */
export const removeAllStyleRelatedDependencies =
  (hero_entry: Record<SpecialAbility>) =>
    pipe (
      removeStyleExtendedSpecialAbilityDependencies (hero_entry),
      removeExtendedSpecialAbilityDependency (hero_entry)
    )

/**
 * Return flat array of available extended special abilities' IDs.
 * @param xs List of set extended special ability objects.
 */
const getAvailableExtendedSpecialAbilities =
  concatMap<Record<StyleDependency>, string>
    (e => {
      if (isNothing (active (e))) {
        const current_id = dpid (e)

        return isList (current_id) ? current_id : pure (current_id)
      }

      return empty
    })

/**
 * Calculates a list of available Extended Special Abilties. The availability is
 * only based on bought Style Special Abilities, so (other) prerequisites have
 * to be checked separately.
 * @param styleDependencies
 */
export const getAllAvailableExtendedSpecialAbilities =
  foldr (pipe (getAvailableExtendedSpecialAbilities, append)) (empty)


/**
 * Checks if the passed special ability is a style and if it is valid to remove
 * based on registered extended special abilities.
 * @param state Dependent instances state slice.
 * @param entry The special ability to check.
 */
export const isStyleValidToRemove =
  (hero: HeroModelRecord):
  (mwiki_entry: Maybe<Record<SpecialAbility>>) => boolean =>
    pipe (
      fmap (
        (wiki_entry: Record<SpecialAbility>) =>
          and (fmap ((l: Lens_<HeroModelRecord, List<Record<StyleDependency>>>) => {
                      const splitted =
                        getSplittedRemainingAndToRemove (id (wiki_entry))
                                                        (view (l) (hero))

                      const itemsToRemove = fst (splitted)
                      const leftItems = snd (splitted)

                      return pipe (
                               filter<Record<StyleDependency>> (pipe (active, isJust)),
                               all (pipe (flip (checkForAlternativeIndex) (leftItems), gt (-1)))
                             )
                             (itemsToRemove)
                    })
                    (lensByStyle (wiki_entry)))
      ),
      or
    )
