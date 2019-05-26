import { equals } from "../../../Data/Eq";
import { cnst, ident, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { any, consF, find, List, minimum, notElem } from "../../../Data/List";
import { and, bindF, elem, ensure, isJust, Just, Maybe, maybe, sum } from "../../../Data/Maybe";
import { alter, empty, filter, foldl, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils";
import { filterAndMaximumNonNegative, flattenDependencies } from "../Dependencies/flattenDependencies";
import { getNumericMagicalTraditionIdByInstanceId } from "../IDUtils";
import { ifElse } from "../ifElse";
import { gte, inc } from "../mathUtils";
import { pipe } from "../pipe";
import { isNumber } from "../typeCheckUtils";
import { getExceptionalSkillBonus, getInitialMaximumList, putMaximumSkillRatingFromExperienceLevel } from "./skillUtils";

const { spells } = WikiModel.AL
const { id, tradition, property } = Spell.AL
const { value, dependencies } = ActivatableSkillDependent.AL

/**
 * `isActiveTradition id xs` checks if `id` is a tradition contained in the list
 * of active traditions `xs`.
 */
const isActiveTradition =
  (e: number) =>
    find<Record<SpecialAbility>> (pipe (
                                   id,
                                   getNumericMagicalTraditionIdByInstanceId,
                                   fmap (inc),
                                   elem (e)
                                 ))

/**
 * Checks if the passed spell or cantrip is valid for the current
 * active magical traditions.
 */
export const isOwnTradition =
  (activeTradition: List<Record<SpecialAbility>>) =>
  (x: Record<Spell> | Record<Cantrip>): boolean =>
    pipe (
           tradition,
           any (e => e === 1 || isJust (isActiveTradition (e) (activeTradition)))
         )
         (x)

/**
* Add a restriction to the list of maxima if there is no aspect knowledge
* active for the passed liturgical chant.
*/
const putPropertyKnowledgeRestrictionMaximum =
  (propertyKnowledge: Maybe<Record<ActivatableDependent>>) =>
  (wiki_entry: Record<Spell>) =>
    ifElse<List<number>>
      (cnst (
        and (fmap (notElem<string | number> (property (wiki_entry)))
                  (getActiveSelectionsMaybe (propertyKnowledge)))
      ))
      <List<number>>
      (consF (14))
      (ident)

/**
 * Checks if the passed spell's skill rating can be increased.
 */
export const isSpellIncreasable =
  (startEL: Record<ExperienceLevel>) =>
  (phase: number) =>
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
  (exceptionalSkill: Maybe<Record<ActivatableDependent>>) =>
  (propertyKnowledge: Maybe<Record<ActivatableDependent>>) =>
  (wiki_entry: Record<Spell>) =>
  (hero_entry: Record<ActivatableSkillDependent>): boolean => {
    const bonus = getExceptionalSkillBonus (id (wiki_entry))
                                           (exceptionalSkill)

    const max = pipe (
                      getInitialMaximumList (attributes),
                      putMaximumSkillRatingFromExperienceLevel (startEL) (phase),
                      putPropertyKnowledgeRestrictionMaximum (propertyKnowledge)
                                                             (wiki_entry),
                      minimum
                    )
                    (wiki_entry)

    return value (hero_entry) < max + bonus
  }

/**
 * Counts the active spells for every property. A spell can only have one
 * property.
 */
export const countActiveSpellsPerProperty =
  (wiki: OrderedMap<string, Record<Spell>>) =>
    pipe (
      filter<string, Record<ActivatableSkillDependent>> (pipe (value, gte (10))),
      foldl<Record<ActivatableSkillDependent>, OrderedMap<number, number>>
        (acc => pipe (
          id,
          lookupF (wiki),
          maybe
            (acc)
            (pipe (
              property,
              alter (pipe (sum, inc, Just)),
              thrush (acc)
            ))
        ))
        (empty)
    )

/**
 * Check if the dependencies allow the passed spell to be decreased.
 */
const isSpellDecreasableByDependencies =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (hero_entry: Record<ActivatableSkillDependent>) => {
    const flattenedDependencies =
      flattenDependencies (wiki) (state) (dependencies (hero_entry))

    return value (hero_entry) < 1
      ? notElem<number | boolean> (true) (flattenedDependencies)
      : value (hero_entry) > filterAndMaximumNonNegative (flattenedDependencies)
  }

/**
 * Check if the active property knowledges allow the passed spell to be
 * decreased. (There must be at leased 3 spells of the respective property
 * active.)
 */
const isSpellDecreasableByPropertyKnowledges =
  (wiki: WikiModelRecord) =>
  (spellsStateEntries: OrderedMap<string, Record<ActivatableSkillDependent>>) =>
  (propertyKnowledge: Maybe<Record<ActivatableDependent>>) =>
  (wiki_entry: Record<Spell>) =>
  (hero_entry: Record<ActivatableSkillDependent>) =>
    and (
      pipe (
        getActiveSelectionsMaybe,

        // Check if spell is part of dependencies of active Property Knowledge
        bindF<List<string | number>, List<string | number>>
          (ensure (any (e => isNumber (e) && equals (e) (property (wiki_entry))))),

        fmap (
          pipe (
            () => countActiveSpellsPerProperty (spells (wiki))
                                               (spellsStateEntries),
            lookup (property (wiki_entry)),
            sum,
            lowest => value (hero_entry) !== 10 || lowest > 3
          )
        )
      )
      (propertyKnowledge)
    )

/**
 * Checks if the passed spell's skill rating can be decreased.
 */
export const isSpellDecreasable =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (propertyKnowledge: Maybe<Record<ActivatableDependent>>) =>
  (wiki_entry: Record<Spell>) =>
  (hero_entry: Record<ActivatableSkillDependent>): boolean =>
    isSpellDecreasableByDependencies (wiki) (state) (hero_entry)
    && isSpellDecreasableByPropertyKnowledges (wiki)
                                              (HeroModel.AL.spells (state))
                                              (propertyKnowledge)
                                              (wiki_entry)
                                              (hero_entry)
