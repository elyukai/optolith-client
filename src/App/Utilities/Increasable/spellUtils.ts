import { notP } from "../../../Data/Bool";
import { equals } from "../../../Data/Eq";
import { cnst, ident, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { any, cons, consF, find, intersecting, List, minimum, notElem } from "../../../Data/List";
import { and, bindF, elem, ensure, fromJust, isJust, Just, listToMaybe, mapMaybe, Maybe, maybe, sum } from "../../../Data/Maybe";
import { gte, inc } from "../../../Data/Num";
import { alter, empty, filter, foldl, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { MagicalTradition, Property } from "../../Constants/Groups";
import { SpecialAbilityId } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils";
import { mapMagicalTradIdToNumId } from "../Activatable/traditionUtils";
import { filterAndMaximumNonNegative, flattenDependencies } from "../Dependencies/flattenDependencies";
import { ifElse } from "../ifElse";
import { pipe, pipe_ } from "../pipe";
import { isNumber } from "../typeCheckUtils";
import { getExceptionalSkillBonus, getInitialMaximumList, putMaximumSkillRatingFromExperienceLevel } from "./skillUtils";

const WA = WikiModel.A
const SA = Spell.A
const SAL = Spell.AL
const ASDA = ActivatableSkillDependent.A
const ADA = ActivatableDependent.A
const SAA = SpecialAbility.A
const AOA = ActiveObject.A

/**
 * `isActiveTradition id xs` checks if `id` is a tradition contained in the list
 * of active traditions `xs`.
 */
const isActiveTradition =
  (e: MagicalTradition) =>
    find (pipe (
           SAA.id,
           mapMagicalTradIdToNumId,
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
           SAL.tradition,
           any (e => e === MagicalTradition.General
                     || isJust (isActiveTradition (e) (activeTradition)))
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
        and (fmap (notElem<string | number> (SA.property (wiki_entry)))
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
    const bonus = getExceptionalSkillBonus (SA.id (wiki_entry))
                                           (exceptionalSkill)

    const max = pipe (
                      getInitialMaximumList (attributes),
                      putMaximumSkillRatingFromExperienceLevel (startEL) (phase),
                      putPropertyKnowledgeRestrictionMaximum (propertyKnowledge)
                                                             (wiki_entry),
                      minimum
                    )
                    (wiki_entry)

    return ASDA.value (hero_entry) < max + bonus
  }

/**
 * Counts the active spells for every property. A spell can only have one
 * property.
 */
export const countActiveSpellsPerProperty =
  (wiki: OrderedMap<string, Record<Spell>>):
  (hero: OrderedMap<string, Record<ActivatableSkillDependent>>) => OrderedMap<Property, number> =>
    pipe (
      filter (pipe (ASDA.value, gte (10))),
      foldl ((acc: OrderedMap<Property, number>) => pipe (
              ASDA.id,
              lookupF (wiki),
              maybe
                (acc)
                (pipe (
                  SA.property,
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
      flattenDependencies (wiki) (state) (ASDA.dependencies (hero_entry))

    return ASDA.value (hero_entry) < 1
      ? notElem<number | boolean> (true) (flattenedDependencies)
      : ASDA.value (hero_entry) > filterAndMaximumNonNegative (flattenedDependencies)
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
          (ensure (any (e => isNumber (e) && equals (e) (SA.property (wiki_entry))))),

        fmap (
          pipe (
            () => countActiveSpellsPerProperty (WA.spells (wiki))
                                               (spellsStateEntries),
            lookup (SA.property (wiki_entry)),
            sum,
            lowest => ASDA.value (hero_entry) !== 10 || lowest > 3
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
                                              (HeroModel.A.spells (state))
                                              (propertyKnowledge)
                                              (wiki_entry)
                                              (hero_entry)

export const isUnfamiliarSpell:
  (trad_hero_entries: List<Record<ActivatableDependent>>) =>
  (spell: Record<Spell> | Record<Cantrip>) => boolean =
  trads => {
    if (any (pipe (ADA.id, equals<string> (SpecialAbilityId.TraditionIntuitiveZauberer))) (trads)) {
      return cnst (false)
    }

    const mguild_mage_sel =
      pipe_ (
        trads,
        find (pipe (ADA.id, equals<string> (SpecialAbilityId.TraditionGuildMages))),
        bindF (pipe (ADA.active, listToMaybe)),
        bindF (AOA.sid)
      )

    const active_trad_num_ids =
      cons (mapMaybe (pipe (ADA.id, mapMagicalTradIdToNumId))
                     (trads))
           (MagicalTradition.General)

    const isNoTraditionActive = notP (intersecting (active_trad_num_ids))

    return x => {
      if (isJust (mguild_mage_sel)) {
        const guild_mage_sel = fromJust (mguild_mage_sel)

        if (guild_mage_sel === SAL.id (x)) {
          return false
        }
      }

      return isNoTraditionActive (SAL.tradition (x))
    }
  }
