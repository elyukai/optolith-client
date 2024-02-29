import { Cantrip } from "optolith-database-schema/types/Cantrip"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { Property } from "optolith-database-schema/types/Property"
import { Ritual } from "optolith-database-schema/types/Ritual"
import { Spell } from "optolith-database-schema/types/Spell"
import { CantripIdentifier, PropertyIdentifier } from "optolith-database-schema/types/_Identifier"
import {
  MagicalActionIdentifier,
  SpellworkIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { ImprovementCost as RawImprovementCost } from "optolith-database-schema/types/_ImprovementCost"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { Traditions } from "optolith-database-schema/types/_Spellwork"
import { count, countBy, sum } from "../../utils/array.ts"
import { Compare, compareAt, compareNullish, numAsc, reduceCompare } from "../../utils/compare.ts"
import { isNotNullish, mapNullableDefault } from "../../utils/nullable.ts"
import { TranslateMap } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { Activatable, countOptions } from "../activatable/activatableEntry.ts"
import { CombinedActiveMagicalTradition } from "../activatable/magicalTradition.ts"
import {
  ImprovementCost,
  compareImprovementCost,
  fromRaw,
} from "../adventurePoints/improvementCost.ts"
import { All, GetById } from "../getTypes.ts"
import {
  MagicalTraditionIdentifier,
  createIdentifierObject,
  getCreateIdentifierObject,
} from "../identifier.ts"
import { SpellsSortOrder } from "../sortOrders.ts"
import {
  cursesImprovementCost,
  dominationRitualsImprovementCost,
  geodeRitualsImprovementCost,
} from "./magicalActions.ts"
import {
  ActivatableRated,
  ActivatableRatedMap,
  ActivatableRatedValue,
  ActivatableRatedWithEnhancements,
  ActivatableRatedWithEnhancementsMap,
  ActiveActivatableRatedWithEnhancements,
  isRatedActive,
  isRatedWithEnhancementsActive,
} from "./ratedEntry.ts"
import { DisplayedActiveSpellwork } from "./spellActive.ts"
import { DisplayedInactiveSpellwork } from "./spellInactive.ts"

/**
 * Returns the value for a dynamic spell entry that might not exist yet.
 */
export const getSpellValue = (
  dynamicEntry: ActivatableRatedWithEnhancements | undefined,
): number | undefined => dynamicEntry?.value

/**
 * Creates an initial dynamic spell entry.
 */
export const createEmptyDynamicSpell = (id: number): ActivatableRatedWithEnhancements => ({
  id,
  value: undefined,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
  enhancements: [],
})

/**
 * A capability type for getting any dynamic spellworks that belong to a certain
 * property.
 */
export type GetDynamicSpellworksByPropertyCapability = (
  id: number,
) => ActivatableRatedWithEnhancements[]

/**
 * A capability type for getting any active dynamic spellworks that belong to a
 * certain property.
 */
export type GetActiveDynamicSpellworksByPropertyCapability = (
  id: number,
) => ActiveActivatableRatedWithEnhancements[]

/**
 * Returns a list of active dynamic spellwork entries for a given property.
 */
export const getActiveDynamicSpellworksByProperty = (
  getPropertyOfSpellwork: (id: number) => PropertyIdentifier | undefined,
  dynamicSpellworks: ActivatableRatedWithEnhancementsMap,
  propertyId: number,
): ActiveActivatableRatedWithEnhancements[] =>
  Object.values(dynamicSpellworks)
    .filter(isRatedWithEnhancementsActive)
    .filter(
      dynamicSpellwork => getPropertyOfSpellwork(dynamicSpellwork.id)?.property === propertyId,
    )

/**
 * Counts the number of spellworks that are active and have a value greater than
 * 10 for each property.
 */
export const getSpellworksAbove10ByProperty = (
  getPropertyId: (id: SpellworkIdentifier | MagicalActionIdentifier) => number | undefined,
  dynamicSpells: ActivatableRatedWithEnhancementsMap,
  dynamicRituals: ActivatableRatedWithEnhancementsMap,
  dynamicCurses: ActivatableRatedMap,
  dynamicElvenMagicalSongs: ActivatableRatedMap,
  dynamicDominationRituals: ActivatableRatedMap,
  dynamicMagicalDances: ActivatableRatedMap,
  dynamicMagicalMelodies: ActivatableRatedMap,
  dynamicJesterTricks: ActivatableRatedMap,
  dynamicAnimistPowers: ActivatableRatedMap,
  dynamicGeodeRituals: ActivatableRatedMap,
  dynamicZibiljaRituals: ActivatableRatedMap,
  dynamicMagicalRunes: ActivatableRatedMap,
): Record<number, number> => {
  const prepareEntity = (
    ratedMap: ActivatableRatedMap,
    numberToId: (id: number) => SpellworkIdentifier | MagicalActionIdentifier,
  ) =>
    Object.values(ratedMap)
      .filter(isRatedActive)
      .flatMap(dynamicEntry =>
        mapNullableDefault(
          getPropertyId(numberToId(dynamicEntry.id)),
          propertyId => [[propertyId, dynamicEntry.value] as const],
          [],
        ),
      )

  return [
    ...prepareEntity(dynamicSpells, getCreateIdentifierObject("Spell")),
    ...prepareEntity(dynamicRituals, getCreateIdentifierObject("Ritual")),
    ...prepareEntity(dynamicCurses, getCreateIdentifierObject("Curse")),
    ...prepareEntity(dynamicElvenMagicalSongs, getCreateIdentifierObject("ElvenMagicalSong")),
    ...prepareEntity(dynamicDominationRituals, getCreateIdentifierObject("DominationRitual")),
    ...prepareEntity(dynamicMagicalDances, getCreateIdentifierObject("MagicalDance")),
    ...prepareEntity(dynamicMagicalMelodies, getCreateIdentifierObject("MagicalMelody")),
    ...prepareEntity(dynamicJesterTricks, getCreateIdentifierObject("JesterTrick")),
    ...prepareEntity(dynamicAnimistPowers, getCreateIdentifierObject("AnimistPower")),
    ...prepareEntity(dynamicGeodeRituals, getCreateIdentifierObject("GeodeRitual")),
    ...prepareEntity(dynamicZibiljaRituals, getCreateIdentifierObject("ZibiljaRitual")),
    ...prepareEntity(dynamicMagicalRunes, getCreateIdentifierObject("MagicalRune")),
  ].reduce<Record<number, number>>(
    (acc, [propertyId, value]) =>
      value >= 10 ? { ...acc, [propertyId]: (acc[propertyId] ?? 0) + 1 } : acc,
    {},
  )
}

/**
 * Returns the highest required attribute and its value for a spellwork, if any.
 */
export const getHighestRequiredAttributeForSpellwork = (
  getSingleHighestCheckAttributeId: (check: SkillCheck) => number | undefined,
  staticSpellwork: { id: number; check: SkillCheck },
  dynamicSpellwork: { value: ActivatableRatedValue },
  exceptionalSkill: Activatable | undefined,
  type: "Spell" | "Ritual" | undefined,
): { id: number; value: number } | undefined => {
  const singleHighestAttributeId = getSingleHighestCheckAttributeId(staticSpellwork.check)

  if (singleHighestAttributeId === undefined || dynamicSpellwork.value === undefined) {
    return undefined
  }

  const exceptionalSkillBonus =
    type === undefined
      ? 0
      : countOptions(exceptionalSkill, createIdentifierObject(type, staticSpellwork.id))

  return {
    id: singleHighestAttributeId,
    value: dynamicSpellwork.value - 2 - exceptionalSkillBonus,
  }
}

/**
 * Counts active spellworks.
 */
export const countActiveSpellworks = (
  dynamicSpells: All.Dynamic.Spells,
  dynamicRituals: All.Dynamic.Rituals,
  dynamicCurses: All.Dynamic.Curses,
  dynamicElvenMagicalSongs: All.Dynamic.ElvenMagicalSongs,
  dynamicDominationRituals: All.Dynamic.DominationRituals,
  dynamicMagicalDances: All.Dynamic.MagicalDances,
  dynamicMagicalMelodies: All.Dynamic.MagicalMelodies,
  dynamicJesterTricks: All.Dynamic.JesterTricks,
  dynamicAnimistPowers: All.Dynamic.AnimistPowers,
  dynamicGeodeRituals: All.Dynamic.GeodeRituals,
  dynamicZibiljaRituals: All.Dynamic.ZibiljaRituals,
): number =>
  count([dynamicSpells, dynamicRituals].flat(), isRatedWithEnhancementsActive) +
  count(
    [
      dynamicCurses,
      dynamicElvenMagicalSongs,
      dynamicDominationRituals,
      dynamicMagicalDances,
      dynamicMagicalMelodies,
      dynamicJesterTricks,
      dynamicAnimistPowers,
      dynamicGeodeRituals,
      dynamicZibiljaRituals,
    ].flat(),
    isRatedActive,
  )

/**
 * Counts active unfamiliar spellworks.
 */
export const countActiveUnfamiliarSpellworks = (
  dynamicSpells: ActivatableRatedWithEnhancements[],
  dynamicRituals: ActivatableRatedWithEnhancements[],
  getIsUnfamiliar: (id: SpellworkIdentifier) => boolean,
): number => {
  const countForType = (
    dynamicSpellworks: ActivatableRatedWithEnhancements[],
    getId: (id: number) => SpellworkIdentifier,
  ) =>
    count(
      dynamicSpellworks,
      dynamicEntry =>
        isRatedWithEnhancementsActive(dynamicEntry) && getIsUnfamiliar(getId(dynamicEntry.id)),
    )

  return sum([
    countForType(dynamicSpells, id => createIdentifierObject("Spell", id)),
    countForType(dynamicRituals, id => createIdentifierObject("Ritual", id)),
  ])
}

/**
 * Counts active spellworks by improvement cost.
 */
export const countActiveSpellworksByImprovementCost = (
  getStaticSpellById: GetById.Static.Spell,
  getStaticRitualById: GetById.Static.Ritual,
  getStaticCurseById: GetById.Static.Curse,
  getStaticElvenMagicalSongById: GetById.Static.ElvenMagicalSong,
  getStaticDominationRitualById: GetById.Static.DominationRitual,
  getStaticMagicalDanceById: GetById.Static.MagicalDance,
  getStaticMagicalMelodyById: GetById.Static.MagicalMelody,
  getStaticJesterTrickById: GetById.Static.JesterTrick,
  getStaticAnimistPowerById: GetById.Static.AnimistPower,
  getStaticGeodeRitualById: GetById.Static.GeodeRitual,
  getStaticZibiljaRitualById: GetById.Static.ZibiljaRitual,
  dynamicSpells: All.Dynamic.Spells,
  dynamicRituals: All.Dynamic.Rituals,
  dynamicCurses: All.Dynamic.Curses,
  dynamicElvenMagicalSongs: All.Dynamic.ElvenMagicalSongs,
  dynamicDominationRituals: All.Dynamic.DominationRituals,
  dynamicMagicalDances: All.Dynamic.MagicalDances,
  dynamicMagicalMelodies: All.Dynamic.MagicalMelodies,
  dynamicJesterTricks: All.Dynamic.JesterTricks,
  dynamicAnimistPowers: All.Dynamic.AnimistPowers,
  dynamicGeodeRituals: All.Dynamic.GeodeRituals,
  dynamicZibiljaRituals: All.Dynamic.ZibiljaRituals,
): Record<ImprovementCost, number> => {
  const prepareListWithEnhancements = <T>(
    dynamicSpellworks: ActivatableRatedWithEnhancements[],
    getStaticSpellwork: (id: number) => T,
    getImprovementCost: (entry: T | undefined) => RawImprovementCost | undefined,
  ): ImprovementCost[] =>
    dynamicSpellworks
      .filter(isRatedWithEnhancementsActive)
      .map(dynamicEntry => fromRaw(getImprovementCost(getStaticSpellwork(dynamicEntry.id))))
      .filter(isNotNullish)

  const prepareList = <T>(
    dynamicSpellworks: ActivatableRated[],
    getStaticSpellwork: (id: number) => T,
    getImprovementCost: (entry: T | undefined) => RawImprovementCost | undefined,
  ): ImprovementCost[] =>
    dynamicSpellworks
      .filter(isRatedActive)
      .map(dynamicEntry => fromRaw(getImprovementCost(getStaticSpellwork(dynamicEntry.id))))
      .filter(isNotNullish)

  return countBy(
    [
      ...prepareListWithEnhancements(
        dynamicSpells,
        getStaticSpellById,
        spell => spell?.improvement_cost,
      ),
      ...prepareListWithEnhancements(
        dynamicRituals,
        getStaticRitualById,
        ritual => ritual?.improvement_cost,
      ),
      ...prepareList(dynamicCurses, getStaticCurseById, _curse => cursesImprovementCost),
      ...prepareList(
        dynamicElvenMagicalSongs,
        getStaticElvenMagicalSongById,
        elvenMagicalSong => elvenMagicalSong?.improvement_cost,
      ),
      ...prepareList(
        dynamicDominationRituals,
        getStaticDominationRitualById,
        _dominationRitual => dominationRitualsImprovementCost,
      ),
      ...prepareList(
        dynamicMagicalDances,
        getStaticMagicalDanceById,
        magicalDance => magicalDance?.improvement_cost,
      ),
      ...prepareList(
        dynamicMagicalMelodies,
        getStaticMagicalMelodyById,
        magicalMelodie => magicalMelodie?.improvement_cost,
      ),
      ...prepareList(
        dynamicJesterTricks,
        getStaticJesterTrickById,
        jesterTrick => jesterTrick?.improvement_cost,
      ),
      ...prepareList(dynamicAnimistPowers, getStaticAnimistPowerById, animistPower =>
        // TODO: Replace with derived improvement cost
        animistPower?.improvement_cost.tag === "Fixed"
          ? animistPower.improvement_cost.fixed
          : undefined,
      ),
      ...prepareList(
        dynamicGeodeRituals,
        getStaticGeodeRitualById,
        _geodeRitual => geodeRitualsImprovementCost,
      ),
      ...prepareList(
        dynamicZibiljaRituals,
        getStaticZibiljaRitualById,
        zibiljaRitual => zibiljaRitual?.improvement_cost,
      ),
    ],
    (entry): ImprovementCost => entry,
  )
}

/**
 * Checks if the maximum number of spellworks has been reached.
 */
export const isMaximumOfSpellworksReached = (
  activeCount: number,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
) =>
  isInCharacterCreation
    ? activeCount >= startExperienceLevel.max_number_of_spells_liturgical_chants
    : false

/**
 * Checks if the maximum number of spellworks has been reached.
 */
export const isMaximumOfUnfamiliarSpellworksReached = (
  activeUnfamiliarCount: number,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
) =>
  isInCharacterCreation
    ? activeUnfamiliarCount >= startExperienceLevel.max_number_of_unfamiliar_spells
    : false

/**
 * Checks a list of tradition identifiers if at least one of them is active.
 */
export const isTraditionActive = (
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  traditionIds: MagicalTraditionIdentifier[],
): boolean => activeMagicalTraditions.some(active => traditionIds.includes(active.static.id))

/**
 * Returns a function that checks if a cantrip, spell or ritual is unfamiliar.
 */
export const createGetIsUnfamiliar = (
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  staticCantrips: Record<number, Cantrip>,
  staticSpells: Record<number, Spell>,
  staticRituals: Record<number, Ritual>,
): ((id: SpellworkIdentifier | CantripIdentifier) => boolean) => {
  if (
    isTraditionActive(activeMagicalTraditions, [
      MagicalTraditionIdentifier.IntuitiveMages,
      MagicalTraditionIdentifier.Schelme,
      MagicalTraditionIdentifier.Zauberalchimisten,
    ])
  ) {
    return _ => false
  }

  const applicableTraditionIds = activeMagicalTraditions
    .flatMap(trad => [
      trad.static.id,
      trad.static.use_arcane_spellworks_from_tradition?.id.magical_tradition,
    ])
    .filter(isNotNullish)

  // TODO: Check transferred unfamiliar
  // all (pipe (TUA.id, trans_id => trans_id !== id && trans_id !== UnfamiliarGroup.Spells))
  //     (transferred_unfamiliar)

  const checkSpellwork = <T extends { traditions: Traditions }>(
    staticSpellworks: Record<number, T>,
    id: number,
  ) => {
    const spellwork = staticSpellworks[id]
    if (spellwork === undefined) {
      return false
    }
    switch (spellwork.traditions.tag) {
      case "General":
        return false
      case "Specific":
        return !spellwork.traditions.specific.some(trad =>
          applicableTraditionIds.includes(trad.magical_tradition),
        )
      default:
        return assertExhaustive(spellwork.traditions)
    }
  }

  return id => {
    switch (id.tag) {
      case "Spell":
        return checkSpellwork(staticSpells, id.spell)
      case "Ritual":
        return checkSpellwork(staticRituals, id.ritual)
      case "Cantrip": {
        const cantrip = staticCantrips[id.cantrip]
        if (cantrip === undefined) {
          return false
        }
        switch (cantrip.note?.tag) {
          case "Common":
            return !cantrip.note.common.list.some(trad => {
              switch (trad.tag) {
                case "Academy":
                  return applicableTraditionIds.includes(MagicalTraditionIdentifier.GuildMages)
                case "Tradition":
                  return applicableTraditionIds.includes(trad.tradition.id.magical_tradition)
                default:
                  return assertExhaustive(trad)
              }
            })
          case "Exclusive":
            return !cantrip.note.exclusive.traditions.some(trad =>
              applicableTraditionIds.includes(trad.id.magical_tradition),
            )
          case undefined:
            return false
          default:
            return assertExhaustive(cantrip.note)
        }
      }
      default:
        return assertExhaustive(id)
    }
  }
}

// /**
//  * ```haskell
//  * countActiveSpellEntriesInGroups :: [Int] -> Wiki -> Hero -> Int
//  * ```
//  *
//  * Counts the active spells of the specified spell groups.
//  */
// const countActiveSpellEntriesInGroups : (groups : List<number>) =>
//                                        (wiki : StaticDataRecord) =>
//                                        (hero : HeroModelRecord) => number =
//   grs => wiki => pipe (
//     HA.spells,
//     elems,
//     countWith (e => ASDA.active (e)
//                     && pipe_ (
//                       wiki,
//                       SDA.spells,
//                       lookup (ASDA.id (e)),
//                       maybe (false) (pipe (SA.gr, elemF (grs)))
//                     ))
//   )

// /**
//  * ```haskell
//  * isSpellsRitualsCountMaxReached :: Wiki -> Hero -> (String -> Bool) -> Bool
//  * ```
//  *
//  * Checks if the maximum for spells and rituals is reached which would disallow
//  * any further addition of a spell or ritual.
//  */
// export const isSpellsRitualsCountMaxReached =
//   (wiki : StaticDataRecord) =>
//   (hero : HeroModelRecord) =>
//   (isLastTrad : (x : string) => boolean) => {
//     const current_count = countActiveSpellEntriesInGroups (List (
//                                                             MagicalGroup.Spells,
//                                                             MagicalGroup.Rituals
//                                                           ))
//                                                           (wiki)
//                                                           (hero)

//     if (isLastTrad (SpecialAbilityId.TraditionSchelme)) {
//       const max_spellworks = pipe_ (
//                                hero,
//                                HA.specialAbilities,
//                                lookup<string> (SpecialAbilityId.Imitationszauberei),
//                                bindF (pipe (ADA.active, listToMaybe)),
//                                bindF (AOA.tier),
//                                fromMaybe (0)
//                              )

//       return current_count >= max_spellworks
//     }

//     // Count maximum for Intuitive Mages and Animisten
//     const BASE_MAX_INTU_ANIM = 3

//     if (isLastTrad (SpecialAbilityId.TraditionIntuitiveMage)
//         || isLastTrad (SpecialAbilityId.TraditionAnimisten)) {
//       const mbonus = lookup<string> (AdvantageId.LargeSpellSelection) (HA.advantages (hero))
//       const mmalus = lookup<string> (DisadvantageId.SmallSpellSelection) (HA.disadvantages (hero))

//       const max_spells = modifyByLevel (BASE_MAX_INTU_ANIM) (mbonus) (mmalus)

//       if (current_count >= max_spells) {
//         return true
//       }
//     }

//     const maxSpellsLiturgicalChants =
//       pipe_ (
//         hero,
//         getExperienceLevelAtStart (wiki),
//         maybe (0) (ELA.maxSpellsLiturgicalChants)
//       )

//     return HA.phase (hero) < 3 && current_count >= maxSpellsLiturgicalChants
//   }

const getNameOfDisplayedSpellwork =
  (translateMap: TranslateMap) =>
  (spellwork: DisplayedInactiveSpellwork | DisplayedActiveSpellwork): string =>
    (() => {
      switch (spellwork.kind) {
        case "cantrip":
          return translateMap(spellwork.static.translations)
        case "spell":
          return translateMap(spellwork.static.translations)
        case "ritual":
          return translateMap(spellwork.static.translations)
        case "curse":
          return translateMap(spellwork.static.translations)
        case "elvenMagicalSong":
          return translateMap(spellwork.static.translations)
        case "dominationRitual":
          return translateMap(spellwork.static.translations)
        case "magicalDance":
          return translateMap(spellwork.static.translations)
        case "magicalMelody":
          return translateMap(spellwork.static.translations)
        case "jesterTrick":
          return translateMap(spellwork.static.translations)
        case "animistPower":
          return translateMap(spellwork.static.translations)
        case "geodeRitual":
          return translateMap(spellwork.static.translations)
        case "zibiljaRitual":
          return translateMap(spellwork.static.translations)
        default:
          return assertExhaustive(spellwork)
      }
    })()?.name ?? ""

const getImprovementCostOfDisplayedSpellwork = (
  liturgy: DisplayedInactiveSpellwork | DisplayedActiveSpellwork,
): RawImprovementCost | undefined => {
  switch (liturgy.kind) {
    case "cantrip":
      return undefined
    case "spell":
      return liturgy.static.improvement_cost
    case "ritual":
      return liturgy.static.improvement_cost
    case "curse":
      return cursesImprovementCost
    case "elvenMagicalSong":
      return liturgy.static.improvement_cost
    case "dominationRitual":
      return dominationRitualsImprovementCost
    case "magicalDance":
      return liturgy.static.improvement_cost
    case "magicalMelody":
      return liturgy.static.improvement_cost
    case "jesterTrick":
      return liturgy.static.improvement_cost
    case "animistPower":
      // TODO: Replace with derived improvement cost
      return liturgy.static.improvement_cost.tag === "Fixed"
        ? liturgy.static.improvement_cost.fixed
        : undefined
    case "geodeRitual":
      return geodeRitualsImprovementCost
    case "zibiljaRitual":
      return liturgy.static.improvement_cost
    default:
      return assertExhaustive(liturgy)
  }
}

const getGroupNumberOfDisplayedSpellwork = (
  liturgy: DisplayedInactiveSpellwork | DisplayedActiveSpellwork,
): number => {
  switch (liturgy.kind) {
    case "cantrip":
      return 1
    case "spell":
      return 2
    case "ritual":
      return 3
    case "curse":
      return 4
    case "elvenMagicalSong":
      return 5
    case "dominationRitual":
      return 6
    case "magicalDance":
      return 7
    case "magicalMelody":
      return 8
    case "jesterTrick":
      return 9
    case "animistPower":
      return 10
    case "geodeRitual":
      return 11
    case "zibiljaRitual":
      return 12
    default:
      return assertExhaustive(liturgy)
  }
}

const getPropertyNameOfDisplayedSpellwork =
  (translateMap: TranslateMap, getProperty: (id: number) => Property | undefined) =>
  (liturgy: DisplayedInactiveSpellwork | DisplayedActiveSpellwork): string =>
    translateMap(getProperty(liturgy.static.property.id.property)?.translations)?.name ?? ""

/**
 * Filters and sorts the displayed liturgies.
 */
export const filterAndSortDisplayed = <
  T extends DisplayedInactiveSpellwork | DisplayedActiveSpellwork,
>(
  visibileSpellworks: T[],
  filterText: string,
  sortOrder: SpellsSortOrder,
  translateMap: TranslateMap,
  localeCompare: Compare<string>,
  getProperty: (id: number) => Property | undefined,
) => {
  const getName = getNameOfDisplayedSpellwork(translateMap)
  return (
    filterText === ""
      ? visibileSpellworks
      : visibileSpellworks.filter(c => getName(c).toLowerCase().includes(filterText.toLowerCase()))
  ).sort(
    (() => {
      switch (sortOrder) {
        case SpellsSortOrder.Name:
          return compareAt(getName, localeCompare)
        case SpellsSortOrder.Group:
          return reduceCompare(
            compareAt(getGroupNumberOfDisplayedSpellwork, numAsc),
            compareAt(getName, localeCompare),
          )
        case SpellsSortOrder.Property:
          return reduceCompare(
            compareAt(
              getPropertyNameOfDisplayedSpellwork(translateMap, getProperty),
              localeCompare,
            ),
            compareAt(getName, localeCompare),
          )
        case SpellsSortOrder.ImprovementCost:
          return reduceCompare(
            compareAt(
              c => fromRaw(getImprovementCostOfDisplayedSpellwork(c)),
              compareNullish(compareImprovementCost),
            ),
            compareAt(getName, localeCompare),
          )
        default:
          return assertExhaustive(sortOrder)
      }
    })(),
  )
}
