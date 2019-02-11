/**
 * Get the needed options for `Activatable` entries that are available to
 * activate.
 *
 * @file src/utils/activatableInactiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { pipe } from "ramda";
import { equals } from "../../../../Data/Eq";
import { ident, thrush } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { consF, countWith, filter, foldr, List, notElemF } from "../../../../Data/List";
import { fromMaybe, Just, Maybe, maybe } from "../../../../Data/Maybe";
import { alter, elems, foldrWithKey, lookup, OrderedMap } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { AdventurePointsObject } from "../../../../selectors/adventurePointsSelectors";
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../../Models/ActiveEntries/ActivatableSkillDependent";
import { HeroModel, HeroModelRecord } from "../../../Models/Hero/HeroModel";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant";
import { Spell } from "../../../Models/Wiki/Spell";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../../Models/Wiki/WikiModel";
import { Activatable } from "../../../Models/Wiki/wikiTypeHelpers";
import { countActiveGroupEntries } from "../../entryGroupUtils";
import { getAllEntriesByGroup, mapListByIdKeyMap } from "../../heroStateUtils";
import { getBlessedTraditionInstanceIdByNumericId } from "../../IDUtils";
import { getTraditionOfAspect } from "../../Increasable/liturgicalChantUtils";
import { match } from "../../match";
import { gte, inc } from "../../mathUtils";
import { validateLevel, validatePrerequisites } from "../../P/Prerequisites/validatePrerequisitesUtils";
import { isString } from "../../typeCheckUtils";
import { isAdditionDisabled } from "./activatableInactiveValidationUtils";
import { getModifierByActiveLevel } from "./activatableModifierUtils";
import { countActiveSkillEntries } from "./activatableSkillUtils";
import { isActive } from "./isActive";
import { findSelectOption, getActiveSecondarySelections, getActiveSelectionsMaybe, getRequiredSelections } from "./selectionUtils";
import { getBlessedTradition, getMagicalTraditions } from "./traditionUtils";

const { liturgicalChants, spells } = WikiModel.A

const {
  disadvantages: hero_disadvantages,
  liturgicalChants: hero_liturgicalChants,
  spells: hero_spells,
} = HeroModel.A

const { select } = Advantage.A
const { aspects } = LiturgicalChant.A
const { property } = Spell.A
const { value } = ActivatableSkillDependent.A
const { id } = SelectOption.A

/**
 * `isNotActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is activated for the passed
 * `ActivatableDependent`.
 */
const isNotActive =
  pipe (
    getActiveSelectionsMaybe,
    fromMaybe<List<string | number>> (List.empty),
    activeSelections => pipe (
      id,
      notElemF (activeSelections)
    )
  )

/**
 * `areNoSameActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if a select option is not activated more than once for the passed
 * `ActivatableDependent`.
 */
const areNoSameActive =
  pipe (
    getActiveSelectionsMaybe,
    fromMaybe<List<string | number>> (List.empty),
    activeSelections => pipe (
      id,
      current_id => countWith (equals (current_id)) (activeSelections) < 2
    )
  )

/**
 * `isNotRequired :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is required for the passed
 * `ActivatableDependent`.
 */
const isNotRequired =
  pipe (
    getRequiredSelections,
    fromMaybe<List<string | number | List<number>>> (List.empty),
    requiredSelections => pipe (
      id,
      notElemF (requiredSelections)
    )
  )


/**
 * `isNotRequiredNotActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is neither required nor activated
 * for the passed `ActivatableDependent`.
 */
const isNotRequiredNotActive =
  (hero_entry: Maybe<Record<ActivatableDependent>>) => {
    const isNoActiveSelection = isNotActive (hero_entry)
    const isNoRequiredSelection = isNotRequired (hero_entry)

    return (e: Record<SelectOption>) =>
      isNoActiveSelection (e) && isNoRequiredSelection (e)
  }

/**
 * Increment the value at the specified key by `1`. If there is no value at that
 * key, the value will be set to `0`.
 */
const incMapVal = alter (pipe (maybe (0) (inc), Just))

const addChantToCounter =
  (chant: Record<LiturgicalChant>) =>
    pipe (
      foldr<number, OrderedMap<number, number>> (incMapVal),
      thrush (aspects (chant))
    )

const addSpellToCounter = pipe (property, incMapVal)

const filterSkills = filter<Record<ActivatableSkillDependent>> (pipe (value, gte (10)))

const foldCounter =
  foldrWithKey<number, number, List<number>> (k => x => x >= 3 ? consF (k) : ident)
                                             (List.empty)

/**
 * `getPropsWith3Gte10 :: Wiki -> Hero -> [Int]`
 *
 * Returns a list containing all properties where at least 3 spells with at
 * least SR 10 belong to.
 */
const getPropsWith3Gte10 =
  (wiki: WikiModelRecord) =>
    pipe (
      hero_spells,
      elems,
      filterSkills,
      mapListByIdKeyMap (spells (wiki)),
      foldr (addSpellToCounter) (OrderedMap.empty),
      foldCounter
    )

/**
 * `getAspectsWith3Gte10 :: Wiki -> Hero -> [Int]`
 *
 * Returns a list containing all aspects where at least 3 chants with at least
 * SR 10 belong to.
 */
const getAspectsWith3Gte10 =
  (wiki: WikiModelRecord) =>
    pipe (
      hero_liturgicalChants,
      elems,
      filterSkills,
      mapListByIdKeyMap (liturgicalChants (wiki)),
      foldr (addChantToCounter) (OrderedMap.empty),
      foldCounter
    )

/**
 * Modifies the select options of specific entries to match current conditions.
 */
const modifySelectOptions =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) => {
    const current_id = id (wiki_entry)

    switch (current_id) {
      // Exceptional Skill
      case "ADV_16": {
        const hasLessThanTwoSameIdActiveSelections =
          areNoSameActive (hero_entry)

        const isNoRequiredSelection =
          isNotRequired (hero_entry)

        return fmap (filter ((e: Record<SelectOption>) =>
                              hasLessThanTwoSameIdActiveSelections (e)
                              && isNoRequiredSelection (e)))
                    (select (wiki_entry))
      }

      // Immunity to (Poison)
      case "ADV_28":
      // Immunity to (Disease)
      case "ADV_29":
      // Afraid of ...
      case "DISADV_1":
      // Principles
      case "DISADV_34":
      // Obligations
      case "DISADV_50":
        return fmap (filter (isNotRequired (hero_entry)))
                    (select (wiki_entry))

      // Magical Attunement
      case "ADV_32":
      // Magical Restriction
      case "DISADV_24": {
        const flippedId = current_id === "DISADV_24" ? "ADV_32" : "DISADV_24"

        // Selection must not be active on the other entry, respectively.
        const isNotActiveOnOther =
          isNotActive (lookup (flippedId) (hero_disadvantages (hero)))

        const isNoRequiredSelection =
          isNotRequired (hero_entry)

        return fmap (filter ((e: Record<SelectOption>) =>
                              isNotActiveOnOther (e)
                              && isNoRequiredSelection (e)))
                    (select (wiki_entry))
      }

      // Personality Flaws
      case "DISADV_33":
      // Negative Trait
      case "DISADV_37":
      // Maimed/Verstümmelt
      case "DISADV_51": {
        const isNoRequiredOrActiveSelection =
          isNotRequiredNotActive (hero_entry)

        const specialIds = List (7, 8)

        // Selection must not be active on the other entry, respectively.
        const isNotActiveOnOther =
          isNotActive (lookup (flippedId) (hero_disadvantages (hero)))

        const isNoRequiredSelection =
          isNotRequired (hero_entry)

        return fmap (filter ((e: Record<SelectOption>) =>
                              isNotActiveOnOther (e)
                              && isNoRequiredSelection (e)))
                    (select (wiki_entry))
      }

      default:
        return fmap (filter (isNotRequiredNotActive (hero_entry)))
                    (select (wiki_entry))
    }
  return match<string, Maybe<List<Record<SelectionObject>>>> (wiki_entry.get ("id"))
    .on (
      List.elem_ (List.of (
        "DISADV_33",
        "DISADV_37",
        "DISADV_51"
      )),
      id => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          if (id === "DISADV_33") {
            const specialIds = List.of (7, 8)

            return select.filter (
              e =>
                specialIds.elem (e.get ("id") as number)
                || isNoRequiredOrActiveSelection (e)
            )
          }
          else {
            return select.filter (isNoRequiredOrActiveSelection)
          }
        })
    )
    .on (
      "DISADV_36",
      () => wiki_entry.lookup ("select")
        .fmap (
          select => select.filter (isNotRequiredNotActive (hero_entry))
        )
    )
    .on (
      "DISADV_48",
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          const isAdvantageActive = (id: string) =>
            isActive (hero.get ("advantages").lookup (id))

          const isSkillOfIcB = (e: Record<SelectionObject>) =>
            Maybe.fromMaybe (false) (
              get ("skills").lookup (e.get ("id") as string)
                .fmap (skill => skill.get ("ic") === 2)
            )

          return select.filter (
            e =>
              (
                (isAdvantageActive ("ADV_40") || isAdvantageActive ("ADV_46"))
                && isSkillOfIcB (e)
              )
              || isNoRequiredOrActiveSelection (e)
          )
        })
    )
    .on (
      "SA_3",
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          return select.filter (
            e =>
              isNoRequiredOrActiveSelection (e)
              && Maybe.fromMaybe (false) (e.lookup ("req").fmap (
                req => validatePrerequisites (wiki, hero, req, wiki_entry.get ("id"))
              ))
          )
        })
    )
    .on ("SA_9", () => {
      const maybeCounter = getActiveSecondarySelections (hero_entry)

      return wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoRequiredSelection = isNotRequired (hero_entry)

          const isValidSelection = Maybe.isJust (maybeCounter)
            ? (e: Record<SelectionObject>) => {
              const counter = Maybe.fromJust (maybeCounter)

              if (isNoRequiredSelection (e)) {
                return false
              }
              else if (counter.member (e.get ("id"))) {
                return Maybe.fromMaybe (false) (
                  Maybe.ensure (isString) (e.get ("id"))
                    .bind (
                      id => OrderedMap.lookup<string, Record<Data.SkillDependent>>
                        (id)
                        (hero.get ("skills"))
                    )
                    .bind (
                      skill => counter.lookup (e.get ("id"))
                        .fmap (
                          arr =>
                            arr.length () < 3
                            && skill.get ("value") >= (arr.length () + 1) * 6
                        )
                    )
                )
              }
              else {
                return Maybe.fromMaybe (false) (
                  Maybe.ensure (isString) (e.get ("id"))
                    .bind (
                      id => OrderedMap.lookup<string, Record<Data.SkillDependent>>
                        (id)
                        (hero.get ("skills"))
                    )
                    .fmap (skill => skill.get ("value") >= 6)
                )
              }
            }
            : (e: Record<SelectionObject>) => {
              if (isNoRequiredSelection (e)) {
                return false
              }
              else {
                return Maybe.fromMaybe (false) (
                  Maybe.ensure (isString) (e.get ("id"))
                    .bind (
                      id => OrderedMap.lookup<string, Record<Data.SkillDependent>>
                        (id)
                        (hero.get ("skills"))
                    )
                    .fmap (skill => skill.get ("value") >= 6)
                )
              }
            }

          return select.filter (isValidSelection)
        })
        .fmap (select => select.map (e => {
          const id = e.get ("id") as string

          const list = maybeCounter.bind (counter => counter.lookup (id))

          return e.mergeMaybe (Record.of ({
            cost: Maybe.isJust (list)
              ? e.lookup ("cost")
                .fmap (cost => cost * (Maybe.fromJust (list).length () + 1))
              : e.lookup ("cost"),
            applications: e.lookup ("applications").fmap (
              apps => apps.filter (n => {
                const isInactive = !Maybe.isJust (list)
                  || !Maybe.fromJust (list).elem (n.get ("id"))

                const req = n.lookup ("prerequisites")

                const arePrerequisitesMet =
                  !Maybe.isJust (req) ||
                  validatePrerequisites (wiki, hero, Maybe.fromJust (req), id)

                return isInactive && arePrerequisitesMet
              })
            ),
          })) as Record<SelectionObject>
        }))
    })
    .on (
      "SA_28",
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoActiveSelection = isNotActive (hero_entry)
          const isNoRequiredSelection = isNotRequired (hero_entry)

          return select.filter (e => {
            if (isNoRequiredSelection (e)) {
              return false
            }
            else {
              return Maybe.fromMaybe (false) (
                e.lookup ("talent")
                  .bind (
                    talent => hero.get ("skills").lookup (Tuple.fst (talent))
                      .fmap (
                        skill =>
                          isNoActiveSelection (e)
                          && skill.get ("value") >= Tuple.snd (talent)
                      )
                  )
              )
            }
          })
        })
    )
    .on (
      "SA_29",
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoRequiredSelection = isNotRequired (hero_entry)

          const active = Maybe.fromMaybe<List<Record<Data.ActiveObject>>> (List.of ()) (
            hero_entry.fmap (e => e.get ("active"))
          )

          return select.filter (
            e =>
              isNoRequiredSelection (e)
              && active.all (n => !n.lookup ("sid").equals (e.lookup ("id")))
          )
        })
    )
    .on ("SA_72", () => {
      return wiki_entry.lookup ("select")
        .fmap (select => {
          const propertiesWithValidSpells = getCategoriesWithSkillsAbove10 (
            wiki, hero, "spells"
          )

          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          return select.filter (e => {
            return isNoRequiredOrActiveSelection (e)
              && !propertiesWithValidSpells.elem (e.get ("id") as number)
          })
        })
    })
    .on (
      "SA_81",
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoActivePropertyKnowledge =
            isNotActive (
              hero.get ("specialAbilities").lookup ("SA_72")
            )

          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          return select.filter (
            e =>
              isNoRequiredOrActiveSelection (e)
              && isNoActivePropertyKnowledge (e)
          )
        })
    )
    .on (
      "SA_87",
      () => wiki_entry.lookup ("select")
        .bind (select => {
          const aspectsWithValidChants = getCategoriesWithSkillsAbove10 (
            wiki, hero, "liturgicalChants"
          )

          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          return getBlessedTradition (hero.get ("specialAbilities"))
            .fmap (
              tradition => select.filter (
                e =>
                  getBlessedTraditionInstanceIdByNumericId (
                    getTraditionOfAspect (e.get ("id") as number)
                  )
                    .equals (Maybe.pure (tradition.get ("id")))
                  && isNoRequiredOrActiveSelection (e)
                  && !aspectsWithValidChants.elem (e.get ("id") as number)
              )
            )
        })
    )
    .on (
      "SA_231",
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          return select.filter (
            e =>
              isNoRequiredOrActiveSelection (e)
              && Maybe.fromMaybe (false) (
                hero.get ("spells").lookup (e.get ("id") as string)
                  .fmap (spell => spell.get ("value") >= 10)
              )
          )
        })
    )
    .on (
      "SA_338",
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const activeSelections = getActiveSelectionsMaybe (hero_entry)

          if (isActive (hero_entry)) {
            const selectedPath = hero_entry
              .fmap (e => e.get ("active"))
              .bind (Maybe.listToMaybe)
              .bind (e => e.lookup ("sid"))
              .bind (e => findSelectOption (wiki_entry, Maybe.pure (e)))
              .bind (obj => obj.lookup ("gr"))

            const highestLevel = activeSelections
              .fmap (List.map (
                selection => findSelectOption (wiki_entry, Maybe.pure (selection))
                  .bind (e => e.lookup ("tier"))
              ))
              .fmap (Maybe.catMaybes)
              .fmap (List.maximum)
              .fmap (e => e + 1)

            return select.filter (
              e =>
                selectedPath.equals (e.lookup ("gr"))
                && e.lookup ("tier").equals (highestLevel)
            )
          }
          else {
            const just1 = Maybe.pure (1)

            return select.filter (e => e.lookup ("tier").equals (just1))
          }
        })
    )
    .on (
      List.elem_ (List.of ("SA_414", "SA_663")),
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          type GetInstance = (target: Maybe<string>) =>
            Maybe<Record<Data.ActivatableSkillDependent>>

          const getInstance: GetInstance = wiki_entry.get ("id") === "SA_414"
            ? target => target.bind (
              id => OrderedMap.lookup<string, Record<Data.ActivatableSkillDependent>>
                (id)
                (hero.get ("spells"))
            )
            : target => target.bind (
              id => OrderedMap.lookup<string, Record<Data.ActivatableSkillDependent>>
                (id)
                (hero.get ("liturgicalChants"))
            )

          type GetWikiEntry = (target: Maybe<string>) =>
          Maybe<Record<Spell> | Record<LiturgicalChant>>

          const createGetWikiEntry: GetWikiEntry = wiki_entry.get ("id") === "SA_414"
            ? target => target.bind (
              id => OrderedMap.lookup<string, Record<Spell>>
                (id)
                (get ("spells"))
            )
            : target => target.bind (
              id => OrderedMap.lookup<string, Record<LiturgicalChant>>
                (id)
                (get ("liturgicalChants"))
            )

          return select.foldl<List<Record<SelectionObject>>> (
            arr => e => {
              const targetInstance = getInstance (e.lookup ("target"))
              const targetWikiEntry = createGetWikiEntry (e.lookup ("target"))

              if (
                isNoRequiredOrActiveSelection (e)
                && validatePrerequisites (
                  wiki,
                  hero,
                  Maybe.fromMaybe<List<AllRequirements>> (List.of ()) (e.lookup ("req")),
                  wiki_entry.get ("id")
                )
                && Maybe.isJust (targetWikiEntry)
                && Maybe.isJust (targetInstance)
                && targetInstance.fmap (target => target.get ("value"))
                  .gte (e.lookup ("tier").fmap (tier => tier * 4 + 4))
              ) {
                const target = Maybe.fromJust (targetWikiEntry)

                return arr.append (
                  e.insert ("name") (`${target.get ("name")}: ${e.get ("name")}`)
                )
              }

              return arr
            }
          ) (List.of ())
        })
    )
    .on (
      "SA_639",
      () => wiki_entry.lookup ("select")
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            isNotRequiredNotActive (hero_entry)

          return select.filter (
            e =>
              isNoRequiredOrActiveSelection (e)
              && validatePrerequisites (
                wiki,
                hero,
                Maybe.fromMaybe<List<AllRequirements>> (List.of ()) (e.lookup ("req")),
                wiki_entry.get ("id")
              )
          )
        })
    )
    .on (
      "SA_699",
      () => getWikiEntryFromSlice (wiki) ("specialAbilities") ("SA_29")
        .bind (
          languagesWikiEntry => languagesWikiEntry.lookup ("select")
            .fmap (select => {
              interface AvailableLanguage {
                id: number
                tier: number
              }

              const availableLanguages =
                Maybe.fromMaybe<List<Record<AvailableLanguage>>> (List.of ()) (
                  hero.get ("specialAbilities").lookup ("SA_29")
                    .fmap (
                      lang => lang.get ("active")
                        .foldl<List<Record<AvailableLanguage>>> (
                          arr => obj =>
                            Maybe.fromMaybe (arr) (
                              obj.lookup ("tier").bind (
                                tier => obj.lookup ("sid")
                                  .bind (Maybe.ensure (x => x === 3 || x === 4))
                                  .fmap (sid => arr.append (Record.of ({
                                    id: sid as number,
                                    tier,
                                  })))
                              )
                            )
                        ) (List.of ())
                    )
                )

              const justTrue = Maybe.pure (true)
              const just4 = Maybe.pure (4)

              return select.foldl<List<Record<SelectionObject>>> (
                acc => e => {
                  const language = availableLanguages.find (
                    l => l.get ("id") === e.get ("id")
                  )

                  const firstForLanguage = hero_entry
                    .fmap (
                      just => just.get ("active").all (
                        a => a.lookup ("sid").equals (just.lookup ("id"))
                      )
                    )

                  if (
                    Maybe.isJust (language)
                    && firstForLanguage.equals (justTrue)
                  ) {
                    const isMotherTongue = language
                      .bind (languageRec => languageRec.lookup ("tier"))
                      .equals (just4)

                    if (isMotherTongue) {
                      return acc.append (e.insert ("cost") (0))
                    }

                    return acc.append (e)
                  }

                  return acc
                }
              ) (List.of ())
            })
        )
    )
    .otherwise (
      () => wiki_entry.lookup ("select")
        .fmap (
          select => select.filter (isNotRequiredNotActive (hero_entry))
        )
    )
}

interface InactiveOptions {
  cost?: string | number | List<number>
  minTier?: number
  maxTier?: number
  customCostDisabled?: boolean
}

const getOtherOptions = (
  wiki: Record<WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  adventurePoints: Record<AdventurePointsObject>,
  entry: Activatable
) => {
  return match<string, Maybe<Record<InactiveOptions>>> (entry.get ("id"))
    .on (
      "DISADV_59",
      () => Maybe.ensure ((n: number) => n < 3) (countActiveSkillEntries (state, "spells"))
        .fmap (activeSpells => Record.of<InactiveOptions> ({
          maxTier: -activeSpells + 3,
        }))
    )
    .on (
      "SA_17",
      () => state.get ("skills").lookup ("TAL_51")
        .bind (
          skill51 => state.get ("skills").lookup ("TAL_51")
            .bind (
              skill55 => Maybe.ensure ((x: number) => x >= 12) (
                skill51.get ("value") + skill55.get ("value")
              )
                .fmap (Record.empty)
            )
        )
    )
    .on (
      "SA_18",
      () => Maybe.ensure ((x: number) => x > 0) (
        getAllEntriesByGroup (
          get ("combatTechniques"),
          state.get ("combatTechniques"),
          2
        )
          .filter (e => e.get ("value") >= 10)
          .length ()
      )
        .fmap (Record.empty)
    )
    .on (
      List.elem_ (List.of (
        "SA_70",
        "SA_255",
        "SA_345",
        "SA_346",
        "SA_676",
        "SA_681"
      )),
      () => Maybe.ensure (List.null) (getMagicalTraditions (state.get ("specialAbilities")))
        .fmap (Record.empty)
    )
    .on (
      List.elem_ (List.of (
        "SA_86",
        "SA_682",
        "SA_683",
        "SA_684",
        "SA_685",
        "SA_686",
        "SA_687",
        "SA_688",
        "SA_689",
        "SA_690",
        "SA_691",
        "SA_692",
        "SA_693",
        "SA_694",
        "SA_695",
        "SA_696",
        "SA_697",
        "SA_698"
      )),
      () =>
        getBlessedTradition (state.get ("specialAbilities"))
          .fmap (Record.empty)
    )
    .on (
      List.elem_ (List.of ("SA_72", "SA_87")),
      () => Maybe.return (entry.get ("cost"))
        .bind (Maybe.ensure ((e): e is List<number> => List.isList (e)))
        .bind (
          costs => instance.fmap (e => e.get ("active").length ())
            .bind (active => costs.subscript (active))
        )
        .fmap (cost => Record.of<InactiveOptions> ({ cost }))
    )
    .on (
      "SA_533",
      () =>
        state.get ("specialAbilities").lookup ("SA_531")
          .fmap (specialAbility => specialAbility.get ("active"))
          .bind (Maybe.listToMaybe)
          .bind (active => active.lookup ("sid"))
          .bind (sid => get ("skills").lookup (sid as string))
          .fmap (skill => Record.of<InactiveOptions> ({
            cost: (entry.get ("cost") as List<number>).map (
              e => e + skill.get ("ic")
            ),
          }))
    )
    .on (
      List.elem_ (List.of (
        "SA_544",
        "SA_545",
        "SA_546",
        "SA_547",
        "SA_548"
      )),
      () => Maybe.ensure<Record<InactiveOptions>> (
        () => {
          const isAdvantageActive = R.pipe (
            OrderedMap.lookup_ (state .get ("advantages")),
            isActive
          )

          const max = getModifierByActiveLevel
            (state.get ("advantages").lookup ("ADV_79"))
            (state.get ("disadvantages").lookup ("DISADV_72"))
            (Just (3))

          const isLessThanMax = () => countActiveGroupEntries (wiki, state, 24) < max

          return (isAdvantageActive ("ADV_77") && isLessThanMax ())
            || isAdvantageActive ("ADV_12")
        }
      ) (Record.empty ())
    )
    .on (
      List.elem_ (List.of (
        "SA_549",
        "SA_550",
        "SA_551",
        "SA_552",
        "SA_553"
      )),
      () => Maybe.ensure<Record<InactiveOptions>> (
        () => {
          const isAdvantageActive = R.pipe (
            OrderedMap.lookup_ (state .get ("advantages")),
            isActive
          )

          const max = getModifierByActiveLevel
            (state.get ("advantages").lookup ("ADV_80"))
            (state.get ("disadvantages").lookup ("DISADV_73"))
            (Just (3))

          const isLessThanMax = () => countActiveGroupEntries (wiki, state, 27) < max

          return (isAdvantageActive ("ADV_78") && isLessThanMax ())
            || isAdvantageActive ("ADV_12")
        }
      ) (Record.empty ())
    )
    .on ("SA_667", () => state.lookup ("pact").fmap (
      e => Record.of<InactiveOptions> ({
        maxTier: e.get ("level"),
      })
    ))
    .on (
      List.elem_ (List.of (
        "SA_677",
        "SA_678",
        "SA_679",
        "SA_680"
      )),
      () =>
        Maybe.ensure<Record<InactiveOptions>> (
          () => adventurePoints.get ("spentOnMagicalAdvantages") <= 25
            && adventurePoints.get ("spentOnMagicalDisadvantages") <= 25
            && List.null (getMagicalTraditions (state.get ("specialAbilities")))
        ) (Record.empty ())
    )
    .otherwise (() => Maybe.pure (Record.of ({})))
}

/**
 * Calculates whether an Activatable is valid to add or not and, if valid,
 * calculates and filters necessary properties and selection lists. Returns a
 * Maybe of the result or `undefined` if invalid.
 */
export const getInactiveView = (
  wiki: Record<WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  validExtendedSpecialAbilities: List<string>,
  locale: Record<Data.UIMessages>,
  adventurePoints: Record<AdventurePointsObject>,
  wikiEntry: Activatable
): Maybe<Record<Data.DeactiveViewObject>> => {
  const id = wikiEntry .get ("id")
  const prerequisites = wikiEntry .get ("prerequisites")
  const maxTier = prerequisites instanceof OrderedMap
    ? validateLevel (
      wiki,
      state,
      prerequisites,
      Maybe.maybe<
        Record<Data.ActivatableDependent>,
        Data.ActivatableDependent["dependencies"]
      > (List.empty ()) (e => e.get ("dependencies")) (instance),
      id
    )
    : Maybe.empty ()

  const isNotValid = isAdditionDisabled (
    wiki,
    instance,
    state,
    validExtendedSpecialAbilities,
    wikiEntry,
    maxTier
  )

  if (!isNotValid) {
    const specificSelections = modifySelectOptions (
      wiki,
      instance,
      state,
      wikiEntry
    )

    const maybeOtherOptions = getOtherOptions (
      wiki,
      instance,
      state,
      adventurePoints,
      wikiEntry
    )

    return maybeOtherOptions.bind (
      otherOptions =>
        Maybe.ensure<Maybe<List<Record<SelectionObject>>>> (
          select => !Maybe.isJust (select) || !List.null (Maybe.fromJust (select))
        ) (specificSelections)
          .fmap (
            select =>
              Record.ofMaybe<Data.DeactiveViewObject> ({
                id,
                name: wikiEntry.get ("name"),
                cost: wikiEntry.get ("cost"),
                maxTier,
                stateEntry: instance,
                wikiEntry: wikiEntry as Record<RecordInterface<Activatable>>,
                sel: select.fmap (sel => sortObjects (sel, locale.get ("id"))),
              })
                .merge (otherOptions)
          )
    )
  }

  return Maybe.empty ()
}
