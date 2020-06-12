/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { notP } from "../../../Data/Bool"
import { equals } from "../../../Data/Eq"
import { cnst, flip, ident } from "../../../Data/Function"
import { all, any, consF, countWith, elemF, intersecting, List } from "../../../Data/List"
import { bindF, fromMaybe, fromMaybe_, listToMaybe, mapMaybe, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { elems, foldrWithKey, lookup, lookupF, OrderedMap, union } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { IC, MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids.gen"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent, createInactiveActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { HeroModelRecord } from "../../Models/Hero/Hero"
import { TransferUnfamiliar, UnfamiliarGroup } from "../../Models/Hero/TransferUnfamiliar"
import { SpellWithRequirements } from "../../Models/View/SpellWithRequirements"
import { animistForceToSpell } from "../../Models/Wiki/AnimistForce"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { curseToSpell } from "../../Models/Wiki/Curse"
import { dominationRitualToSpell } from "../../Models/Wiki/DominationRitual"
import { elvenMagicalSongToSpell } from "../../Models/Wiki/ElvenMagicalSong"
import { geodeRitualToSpell } from "../../Models/Wiki/GeodeRitual"
import { magicalDanceToSpell } from "../../Models/Wiki/MagicalDance"
import { magicalMelodyToSpell } from "../../Models/Wiki/MagicalMelody"
import { rogueSpellToSpell } from "../../Models/Wiki/RogueSpell"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { Spell } from "../../Models/Wiki/Spell"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { zibiljaRitualToSpell } from "../../Models/Wiki/ZibiljaRitual"
import { modifyByLevel } from "../Activatable/activatableModifierUtils"
import { mapMagicalTradIdToNumId } from "../Activatable/traditionUtils"
import { getExperienceLevelAtStart } from "../ELUtils"
import { ifElse } from "../ifElse"
import { pipe, pipe_ } from "../pipe"
import { areSpellPrereqisitesMet } from "../Prerequisites/validatePrerequisitesUtils"
import { misNumberM } from "../typeCheckUtils"


const SDA = StaticData.A
const HA = HeroModel.A
const ELA = ExperienceLevel.A
const SA = Spell.A
const SAL = Spell.AL
const ASDA = ActivatableSkillDependent.A
const ADA = ActivatableDependent.A
const SAA = SpecialAbility.A
const TUA = TransferUnfamiliar.A
const AOA = ActiveObject.A

type ASD = ActivatableSkillDependent


export const combineSpellsAndMagicalActions = (staticData : StaticDataRecord) => pipe_ (
                                                SDA.spells (staticData),
                                                pipe_ (
                                                  SDA.animistForces (staticData),
                                                  OrderedMap.map (animistForceToSpell),
                                                  union
                                                ),
                                                pipe_ (
                                                  SDA.curses (staticData),
                                                  OrderedMap.map (curseToSpell),
                                                  union
                                                ),
                                                pipe_ (
                                                  SDA.dominationRituals (staticData),
                                                  OrderedMap.map (dominationRitualToSpell),
                                                  union
                                                ),
                                                pipe_ (
                                                  SDA.elvenMagicalSongs (staticData),
                                                  OrderedMap.map (
                                                    elvenMagicalSongToSpell (staticData)
                                                  ),
                                                  union
                                                ),
                                                pipe_ (
                                                  SDA.geodeRituals (staticData),
                                                  OrderedMap.map (geodeRitualToSpell),
                                                  union
                                                ),
                                                pipe_ (
                                                  SDA.magicalDances (staticData),
                                                  OrderedMap.map (magicalDanceToSpell),
                                                  union
                                                ),
                                                pipe_ (
                                                  SDA.magicalMelodies (staticData),
                                                  OrderedMap.map (
                                                    magicalMelodyToSpell (staticData)
                                                  ),
                                                  union
                                                ),
                                                pipe_ (
                                                  SDA.rogueSpells (staticData),
                                                  OrderedMap.map (rogueSpellToSpell),
                                                  union
                                                ),
                                                pipe_ (
                                                  SDA.zibiljaRituals (staticData),
                                                  OrderedMap.map (zibiljaRitualToSpell),
                                                  union
                                                )
                                              )


export const isUnfamiliarSpell : (transferred_unfamiliar : List<Record<TransferUnfamiliar>>) =>
                                (trad_hero_entries : List<Record<ActivatableDependent>>) =>
                                (spell_or_cantrip : Record<Spell> | Record<Cantrip>) => boolean =
  transferred_unfamiliar =>
  trads => {
    if (any (pipe (ADA.id, equals<string> (SpecialAbilityId.traditionIntuitiveMage))) (trads)) {
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
const countActiveSpellEntriesInGroups : (groups : List<number>) =>
                                       (wiki : StaticDataRecord) =>
                                       (hero : HeroModelRecord) => number =
  grs => wiki => pipe (
    HA.spells,
    elems,
    countWith (e => ASDA.active (e)
                    && pipe_ (
                      wiki,
                      SDA.spells,
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
  (wiki : StaticDataRecord) =>
  (hero : HeroModelRecord) =>
  (isLastTrad : (x : string) => boolean) => {
    // Count maximum for Intuitive Mages and Animisten
    const BASE_MAX_INTU_ANIM = 3

    const current_count = countActiveSpellEntriesInGroups (List (
                                                            MagicalGroup.Spells,
                                                            MagicalGroup.Rituals
                                                          ))
                                                          (wiki)
                                                          (hero)

    if (isLastTrad (SpecialAbilityId.traditionIntuitiveMage)) {
      const mbonus = lookup (AdvantageId.largeSpellSelection) (HA.advantages (hero))
      const mmalus = lookup (DisadvantageId.smallSpellSelection) (HA.disadvantages (hero))

      const max_spells = modifyByLevel (BASE_MAX_INTU_ANIM) (mbonus) (mmalus)

      if (current_count >= max_spells) {
        return true
      }
    }

    if (isLastTrad (SpecialAbilityId.traditionSchelme)) {
      const max_spellworks = pipe_ (
                               hero,
                               HA.specialAbilities,
                               lookup (SpecialAbilityId.imitationszauberei),
                               bindF (pipe (ADA.active, listToMaybe)),
                               bindF (AOA.tier),
                               fromMaybe (0)
                             )

      if (current_count >= max_spellworks) {
        return true
      }
    }

    if (isLastTrad (SpecialAbilityId.traditionAnimisten) && current_count >= BASE_MAX_INTU_ANIM) {
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
export const isIdInSpecialAbilityList : (xs : List<Record<SpecialAbility>>) =>
                                       (id : string) => boolean =
  flip (id => List.any (pipe (SAA.id, equals (id))))


const isAnySpellActiveWithImpCostC =
  (wiki_spells : StrMap<Record<Spell>>) =>
    OrderedMap.any ((x : Record<ActivatableSkillDependent>) => ASDA.active (x)
                                                              && pipe_ (
                                                                x,
                                                                ASDA.id,
                                                                lookupF (wiki_spells),
                                                                maybe (false)
                                                                      (pipe (SA.ic, equals (IC.C)))
                                                              ))


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
  (wiki : StaticDataRecord) =>
  (hero : HeroModelRecord) =>
  (is_spell_max_count_reached : boolean) =>
  (wiki_entry : Record<Spell>) =>
  (mhero_entry : Maybe<Record<ActivatableSkillDependent>>) =>
    !is_spell_max_count_reached

    // Intuitive Mages can only learn spells
    && SA.gr (wiki_entry) === MagicalGroup.Spells

    // Must be inactive
    && Maybe.all (notP (ASDA.active)) (mhero_entry)

    // No spells with IC D
    && SA.ic (wiki_entry) < IC.D

    // Only one spell with IC C
    && !(SA.ic (wiki_entry) === IC.C && isAnySpellActiveWithImpCostC (SDA.spells (wiki))
                                                                     (HA.spells (hero)))

const isInactiveValidForSchelme =
  (is_spell_max_count_reached : boolean) =>
  (wiki_entry : Record<Spell>) =>
  (mhero_entry : Maybe<Record<ActivatableSkillDependent>>) =>
    SA.gr (wiki_entry) === MagicalGroup.RogueSpells
    || (
      !is_spell_max_count_reached

      // Schelme can only learn spells
      && SA.gr (wiki_entry) === MagicalGroup.Spells

      // Must be inactive
      && Maybe.all (notP (ASDA.active)) (mhero_entry)

      // No spells with IC D or C
      && SA.ic (wiki_entry) < IC.C

      // No property Demonic
      && SA.property (wiki_entry) !== Property.Demonic
    )


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
  (isUnfamiliar : (spell_or_cantrip : Record<Spell> | Record<Cantrip>) => boolean) =>
  (msub_trad : Maybe<number>) =>
  (wiki_entry : Record<Spell>) =>
  (mhero_entry : Maybe<Record<ActivatableSkillDependent>>) =>
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
  (wiki : StaticDataRecord) =>
  (hero : HeroModelRecord) =>
  (is_spell_max_count_reached : boolean) =>
  (wiki_entry : Record<Spell>) =>
  (mhero_entry : Maybe<Record<ActivatableSkillDependent>>) =>
    isInactiveValidForIntuitiveMage (wiki)
                                    (hero)
                                    (is_spell_max_count_reached)
                                    (wiki_entry)
                                    (mhero_entry)
    || SA.gr (wiki_entry) === MagicalGroup.AnimistForces


const consTradSpecificSpell =
  (wiki_entry : Record<Spell>) =>
  (mhero_entry : Maybe<Record<ActivatableSkillDependent>>) =>
  (id : string) =>
    consF (SpellWithRequirements ({
      wikiEntry: wiki_entry,
      stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (id))
                             (mhero_entry),
      isUnfamiliar: false,
      isDecreasable: Nothing,
      isIncreasable: Nothing,
    }))


export const getInactiveSpellsForIntuitiveMageOrAnimist =
  (isValid : typeof isInactiveValidForIntuitiveMage) =>
  (wiki : StaticDataRecord) =>
  (hero : HeroModelRecord) =>
  (is_spell_max_count_reached : boolean) : List<Record<SpellWithRequirements>> =>
    pipe_ (
      wiki,
      SDA.spells,
      foldrWithKey ((k : string) => (wiki_entry : Record<Spell>) => {
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
  (wiki : StaticDataRecord) =>
  (hero : HeroModelRecord) =>
  (is_spell_max_count_reached : boolean) : List<Record<SpellWithRequirements>> => {
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
  (wiki : StaticDataRecord) =>
  (hero : HeroModelRecord) =>
  (isUnfamiliar : (spell_or_cantrip : Record<Spell> | Record<Cantrip>) => boolean) =>
  (trads_hero : List<Record<ActivatableDependent>>) : List<Record<SpellWithRequirements>> => {
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
      SDA.spells,
      foldrWithKey ((k : string) => (wiki_entry : Record<Spell>) => {
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


export const getInactiveSpellsForSchelme =
  (wiki : StaticDataRecord) =>
  (hero : HeroModelRecord) =>
  (is_spell_max_count_reached : boolean) : List<Record<SpellWithRequirements>> =>
    pipe_ (
      wiki,
      SDA.spells,
      foldrWithKey ((k : string) => (wiki_entry : Record<Spell>) => {
                     const mhero_entry = lookup (k) (HA.spells (hero))

                     if (areSpellPrereqisitesMet (wiki) (hero) (wiki_entry)
                         && isInactiveValidForSchelme (is_spell_max_count_reached)
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
  (wiki : StaticDataRecord) =>
  (hero : HeroModelRecord) =>
  (is_spell_max_count_reached : boolean) =>
  (is_max_unfamiliar : boolean) =>
  (isUnfamiliar : (spell_or_cantrip : Record<Spell> | Record<Cantrip>) => boolean) :
  List<Record<SpellWithRequirements>> =>
    pipe_ (
      wiki,
      SDA.spells,
      foldrWithKey ((k : string) => (wiki_entry : Record<Spell>) => {
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
