import { notP } from "../../../Data/Bool";
import { equals } from "../../../Data/Eq";
import { cnst, flip, ident, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { all, any, consF, countWith, elemF, find, intersecting, List, minimum, notElem } from "../../../Data/List";
import { and, bindF, elem, ensure, fromMaybe_, isJust, Just, listToMaybe, mapMaybe, Maybe, maybe, Nothing, sum } from "../../../Data/Maybe";
import { gte, inc } from "../../../Data/Num";
import { alter, elems, empty, filter, foldl, foldrWithKey, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { traceShowId } from "../../../Debug/Trace";
import { IC, MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups";
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent, createInactiveActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { TransferUnfamiliar, UnfamiliarGroup } from "../../Models/Hero/TransferUnfamiliar";
import { SpellWithRequirements } from "../../Models/View/SpellWithRequirements";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { modifyByLevel } from "../Activatable/activatableModifierUtils";
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils";
import { mapMagicalTradIdToNumId } from "../Activatable/traditionUtils";
import { filterAndMaximumNonNegative, flattenDependencies } from "../Dependencies/flattenDependencies";
import { getExperienceLevelAtStart } from "../ELUtils";
import { ifElse } from "../ifElse";
import { pipe, pipe_ } from "../pipe";
import { areSpellPrereqisitesMet } from "../Prerequisites/validatePrerequisitesUtils";
import { isNumber, misNumberM } from "../typeCheckUtils";
import { getExceptionalSkillBonus, getInitialMaximumList, putMaximumSkillRatingFromExperienceLevel } from "./skillUtils";

const WA = WikiModel.A
const HA = HeroModel.A
const ELA = ExperienceLevel.A
const SA = Spell.A
const SAL = Spell.AL
const ASDA = ActivatableSkillDependent.A
const ADA = ActivatableDependent.A
const SAA = SpecialAbility.A
const TUA = TransferUnfamiliar.A
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

export const isUnfamiliarSpell: (transferred_unfamiliar: List<Record<TransferUnfamiliar>>) =>
                                (trad_hero_entries: List<Record<ActivatableDependent>>) =>
                                (spell_or_cantrip: Record<Spell> | Record<Cantrip>) => boolean =
  transferred_unfamiliar =>
  trads => {
    traceShowId (transferred_unfamiliar)

    if (any (pipe (ADA.id, equals<string> (SpecialAbilityId.TraditionIntuitiveMage))) (trads)) {
      return cnst (false)
    }

    const active_trad_num_ids =
      pipe_ (
        trads,
        mapMaybe (pipe (ADA.id, mapMagicalTradIdToNumId)),
        consF (MagicalTradition.General),
        ifElse (List.elem (MagicalTradition.Qabalyamagier))
               (consF<MagicalTradition> (MagicalTradition.GuildMages))
               (ident)
      )

    const isNoTraditionActive = notP (intersecting (active_trad_num_ids))

    return x => {
      const id = SAL.id (x)
      const possible_traditions = SAL.tradition (x)

      return all (pipe (TUA.id, trans_id => trans_id !== id && trans_id !== UnfamiliarGroup.Spells))
                 (transferred_unfamiliar)
        && isNoTraditionActive (possible_traditions)
    }
  }


/**
 * ```haskell
 * countActiveSpellEntriesInGroups :: [Int] -> Wiki -> Hero -> Int
 * ```
 *
 * Counts the active spells of the specified spell groups.
 */
const countActiveSpellEntriesInGroups: (groups: List<number>) =>
                                       (wiki: WikiModelRecord) =>
                                       (hero: HeroModelRecord) => number =
  grs => wiki => pipe (
    HA.spells,
    elems,
    countWith (e => ASDA.active (e)
                    && pipe_ (
                      wiki,
                      WA.spells,
                      lookup (ASDA.id (e)),
                      maybe (false) (pipe (SA.gr, elemF (grs)))
                    ))
  )


/**
 * ```haskell
 * isSpellsRitualsCountMaxReached :: Wiki -> Hero -> (String -> Bool) -> Bool
 * ```
 *
 * Checks if the maximum for spells and rituals is reached which would disallow
 * any further addition of a spell or ritual.
 */
export const isSpellsRitualsCountMaxReached =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (isLastTrad: (x: string) => boolean) => {
    // Count maximum for Intuitive Mages and Animisten
    const BASE_MAX_INTU_ANIM = 3

    const current_count = countActiveSpellEntriesInGroups (List (
                                                            MagicalGroup.Spells,
                                                            MagicalGroup.Rituals
                                                          ))
                                                          (wiki)
                                                          (hero)

    if (isLastTrad (SpecialAbilityId.TraditionIntuitiveMage)) {
      const mbonus = lookup <string> (AdvantageId.LargeSpellSelection) (HA.advantages (hero))
      const mmalus = lookup <string> (DisadvantageId.SmallSpellSelection) (HA.disadvantages (hero))

      const max_spells = modifyByLevel (BASE_MAX_INTU_ANIM) (mbonus) (mmalus)

      if (current_count >= max_spells) {
        return true
      }
    }

    if (isLastTrad (SpecialAbilityId.TraditionAnimisten) && current_count >= BASE_MAX_INTU_ANIM) {
      return true
    }

    const maxSpellsLiturgicalChants =
      pipe_ (
        hero,
        getExperienceLevelAtStart (wiki),
        maybe (0) (ELA.maxSpellsLiturgicalChants)
      )

    return HA.phase (hero) < 3 && current_count >= maxSpellsLiturgicalChants
  }

/**
 * ```haskell
 * isIdInSpecialAbilityList :: [SpecialAbility] -> String -> Bool
 * ```
 *
 * Takes a list of special ability wiki entries and returns a function that
 * checks if a passed ID belongs to a wiki entry from the list
 */
export const isIdInSpecialAbilityList: (xs: List<Record<SpecialAbility>>) =>
                                       (id: string) => boolean =
  flip (id => List.any (pipe (SAA.id, equals (id))))


/**
 * ```haskell
 * isInactiveValidForIntuitiveMage :: Wiki
 *                                 -> Hero
 *                                 -> Bool
 *                                 -> Spell
 *                                 -> Maybe ActivatableSkillDependent
 * ```
 *
 * Checks if a spell is valid to add when *Tradition (Intuitive Mage)* is used.
 */
const isInactiveValidForIntuitiveMage =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (is_spell_max_count_reached: boolean) =>
  (wiki_entry: Record<Spell>) =>
  (mhero_entry: Maybe<Record<ActivatableSkillDependent>>) =>
    !is_spell_max_count_reached
    // Intuitive Mages can only learn spells
    && SA.gr (wiki_entry) === MagicalGroup.Spells
    // Must be inactive
    && Maybe.all (notP (ASDA.active)) (mhero_entry)
    // No spells with IC D
    && SA.ic (wiki_entry) < IC.D
    // Only one spell with IC C
    && !(SA.ic (wiki_entry) === IC.C && isAnySpellActiveWithImpCostC (WA.spells (wiki))
                                                                     (HA.spells (hero)))


/**
 * ```haskell
 * isInactiveValidForArcaneBardOrDancer :: Wiki
 *                                     -> Hero
 *                                     -> Bool
 *                                     -> Spell
 *                                     -> Maybe ActivatableSkillDependent
 * ```
 *
 * Checks if a spell is valid to add when *Tradition (Arcane Bard)* or
 * *Tradition (Arcane Dancer)* is used.
 */
const isInactiveValidForArcaneBardOrDancer =
  (isUnfamiliar: (spell_or_cantrip: Record<Spell> | Record<Cantrip>) => boolean) =>
  (msub_trad: Maybe<number>) =>
  (wiki_entry: Record<Spell>) =>
  (mhero_entry: Maybe<Record<ActivatableSkillDependent>>) =>
    !isUnfamiliar (wiki_entry)
    && maybe (false) (elemF (SA.subtradition (wiki_entry))) (msub_trad)
    && Maybe.all (notP (ASDA.active)) (mhero_entry)


/**
 * ```haskell
 * isInactiveValidForAnimists :: Wiki
 *                            -> Hero
 *                            -> Bool
 *                            -> Spell
 *                            -> Maybe ActivatableSkillDependent
 * ```
 *
 * Checks if a spell is valid to add when *Tradition (Animisten)* is used.
 */
const isInactiveValidForAnimist =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (is_spell_max_count_reached: boolean) =>
  (wiki_entry: Record<Spell>) =>
  (mhero_entry: Maybe<Record<ActivatableSkillDependent>>) =>
    isInactiveValidForIntuitiveMage (wiki)
                                    (hero)
                                    (is_spell_max_count_reached)
                                    (wiki_entry)
                                    (mhero_entry)
    || SA.gr (wiki_entry) === MagicalGroup.Animistenkräfte


const isAnySpellActiveWithImpCostC =
  (wiki_spells: OrderedMap<string, Record<Spell>>) =>
    OrderedMap.any ((x: Record<ActivatableSkillDependent>) => ASDA.active (x)
                                                              && pipe_ (
                                                                x,
                                                                ASDA.id,
                                                                lookupF (wiki_spells),
                                                                maybe (false)
                                                                      (pipe (SA.ic, equals (IC.C)))
                                                              ))


const consTradSpecificSpell =
  (wiki_entry: Record<Spell>) =>
  (mhero_entry: Maybe<Record<ActivatableSkillDependent>>) =>
  (id: string) =>
    consF (SpellWithRequirements ({
      wikiEntry: wiki_entry,
      stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (id))
                             (mhero_entry),
      isUnfamiliar: false,
      isDecreasable: Nothing,
      isIncreasable: Nothing,
    }))


export const getInactiveSpellsForIntuitiveMageOrAnimist =
  (isValid: typeof isInactiveValidForIntuitiveMage) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (is_spell_max_count_reached: boolean): List<Record<SpellWithRequirements>> =>
    pipe_ (
      wiki,
      WA.spells,
      foldrWithKey ((k: string) => (wiki_entry: Record<Spell>) => {
                     const mhero_entry = lookup (k) (HA.spells (hero))

                     if (areSpellPrereqisitesMet (wiki) (hero) (wiki_entry)
                         && isValid (wiki)
                                    (hero)
                                    (is_spell_max_count_reached)
                                    (wiki_entry)
                                    (mhero_entry)) {
                       return consTradSpecificSpell (wiki_entry) (mhero_entry) (k)
                     }

                     return ident as ident<List<Record<SpellWithRequirements>>>
                   })
                   (List ())
    )


/**
 * ```haskell
 * getInactiveSpellsForIntuitiveMages :: Wiki -> Hero -> Bool -> [SpellWithRequirements]
 * ```
 *
 * Returns all valid inactive spells for intuitive mages.
 */
export const getInactiveSpellsForIntuitiveMages =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (is_spell_max_count_reached: boolean): List<Record<SpellWithRequirements>> => {
    if (is_spell_max_count_reached) {
      return List<Record<SpellWithRequirements>> ()
    }

    return getInactiveSpellsForIntuitiveMageOrAnimist (isInactiveValidForIntuitiveMage)
                                                      (wiki)
                                                      (hero)
                                                      (is_spell_max_count_reached)
  }


/**
 * ```haskell
 * getInactiveSpellsForAnimists :: Wiki -> Hero -> Bool -> [SpellWithRequirements]
 * ```
 *
 * Returns all valid inactive spells for animists.
 */
export const getInactiveSpellsForAnimist =
  getInactiveSpellsForIntuitiveMageOrAnimist (isInactiveValidForAnimist)


/**
 * ```haskell
 * getInactiveSpellsForAnimists :: Wiki
 *                              -> Hero
 *                              -> ((Spell | Cantrip) -> Bool)
 *                              -> [ActivatableDependent]
 *                              -> [SpellWithRequirements]
 * ```
 *
 * Returns all valid inactive spells for arcane bards or dancers.
 */
export const getInactiveSpellsForArcaneBardOrDancer =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (isUnfamiliar: (spell_or_cantrip: Record<Spell> | Record<Cantrip>) => boolean) =>
  (trads_hero: List<Record<ActivatableDependent>>): List<Record<SpellWithRequirements>> => {
    const msub_trad =
      pipe_ (
        trads_hero,
        listToMaybe,
        bindF (pipe (ADA.active, listToMaybe)),
        bindF (AOA.sid),
        misNumberM
      )

    return pipe_ (
      wiki,
      WA.spells,
      foldrWithKey ((k: string) => (wiki_entry: Record<Spell>) => {
                     const mhero_entry = lookup (k) (HA.spells (hero))

                     if (areSpellPrereqisitesMet (wiki) (hero) (wiki_entry)
                         && isInactiveValidForArcaneBardOrDancer (isUnfamiliar)
                                                                 (msub_trad)
                                                                 (wiki_entry)
                                                                 (mhero_entry)) {
                       return consTradSpecificSpell (wiki_entry) (mhero_entry) (k)
                     }

                     return ident as ident<List<Record<SpellWithRequirements>>>
                   })
                   (List ())
    )
  }


/**
 * ```haskell
 * getInactiveSpellsForOtherTradition :: Wiki
 *                                    -> Hero
 *                                    -> Bool
 *                                    -> Bool
 *                                    -> ((Spell | Cantrip) -> Bool)
 *                                    -> [SpellWithRequirements]
 * ```
 *
 * Returns all valid inactive spells for arcane bards or dancers.
 */
export const getInactiveSpellsForOtherTradition =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (is_spell_max_count_reached: boolean) =>
  (is_max_unfamiliar: boolean) =>
  (isUnfamiliar: (spell_or_cantrip: Record<Spell> | Record<Cantrip>) => boolean):
  List<Record<SpellWithRequirements>> =>
    pipe_ (
      wiki,
      WA.spells,
      foldrWithKey ((k: string) => (wiki_entry: Record<Spell>) => {
                     const mhero_entry = lookup (k) (HA.spells (hero))

                     if ((!is_spell_max_count_reached || SA.gr (wiki_entry) > MagicalGroup.Rituals)
                         && areSpellPrereqisitesMet (wiki) (hero) (wiki_entry)
                         && (!isUnfamiliar (wiki_entry)
                             || (SA.gr (wiki_entry) <= MagicalGroup.Rituals && !is_max_unfamiliar))
                         && Maybe.all (notP (ASDA.active)) (mhero_entry)) {
                       return consF (SpellWithRequirements ({
                         wikiEntry: wiki_entry,
                         stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                                                (mhero_entry),
                         isUnfamiliar: isUnfamiliar (wiki_entry),
                         isDecreasable: Nothing,
                         isIncreasable: Nothing,
                       }))
                     }

                     return ident as ident<List<Record<SpellWithRequirements>>>
                   })
                   (List ())
    )
