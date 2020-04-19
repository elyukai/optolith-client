import { cnst } from "../../Data/Function"
import { foldl } from "../../Data/List"
import { Just, Maybe, Nothing } from "../../Data/Maybe"
import { inc, max } from "../../Data/Num"
import { lookupF, OrderedMap } from "../../Data/OrderedMap"
import { Category } from "../Constants/Categories"
import { IdPrefixes } from "../Constants/IdPrefixes"
import { DCId, SpecialAbilityId } from "../Constants/Ids"
import { Id } from "../Constants/Ids.gen"
import { CheckModifier } from "../Models/Wiki/wikiTypeHelpers"
import { match } from "./match"
import { pipe } from "./pipe"
import { assertNever } from "./Variant"

export const getIdPrefix = (id: string) => id.split (/_/u)[0] as IdPrefixes

export const getNumericId = (id: string) => Number.parseInt (id.split (/_/u)[1], 10)

export const prefixId = (prefix: IdPrefixes) => (id: number | string) => `${prefix}_${id}`

/**
 * Create a race id.
 */
export const prefixRace = prefixId (IdPrefixes.RACES)

/**
 * Create a profession id.
 */
export const prefixProf = prefixId (IdPrefixes.PROFESSIONS)

/**
 * Create an attribute id.
 */
export const prefixAttr = prefixId (IdPrefixes.ATTRIBUTES)

/**
 * Create a skill id.
 */
export const prefixSkill = prefixId (IdPrefixes.SKILLS)

/**
 * Create a combat technique id.
 */
export const prefixCT = prefixId (IdPrefixes.COMBAT_TECHNIQUES)

/**
 * Create a cantrip id.
 */
export const prefixCantrip = prefixId (IdPrefixes.CANTRIPS)

/**
 * Create a special ability id.
 */
export const prefixSA = prefixId (IdPrefixes.SPECIAL_ABILITIES)

/**
 * Create a item template id.
 */
export const prefixItemTpl = prefixId (IdPrefixes.ITEM_TEMPLATE)

/**
 * Gets a list of ids and returns an unused numeric id.
 */
export const getNewId = pipe (foldl<string, number> (n => pipe (getNumericId, max (n))) (0), inc)

/**
 * Returns the current date in milliseconds.
 */
export const getNewIdByDate = (): number => Date.now () .valueOf ()

export const getCategoryByIdPrefix =
  (id: IdPrefixes): Maybe<Category> =>
    match<IdPrefixes, Maybe<Category>> (id)
      .on (IdPrefixes.ADVANTAGES, () => Just (Category.ADVANTAGES))
      .on (IdPrefixes.ATTRIBUTES, () => Just (Category.ATTRIBUTES))
      .on (IdPrefixes.BLESSINGS, () => Just (Category.BLESSINGS))
      .on (IdPrefixes.CANTRIPS, () => Just (Category.CANTRIPS))
      .on (IdPrefixes.COMBAT_TECHNIQUES, () => Just (Category.COMBAT_TECHNIQUES))
      .on (IdPrefixes.CULTURES, () => Just (Category.CULTURES))
      .on (IdPrefixes.DISADVANTAGES, () => Just (Category.DISADVANTAGES))
      .on (IdPrefixes.LITURGICAL_CHANTS, () => Just (Category.LITURGICAL_CHANTS))
      .on (IdPrefixes.PROFESSIONS, () => Just (Category.PROFESSIONS))
      .on (IdPrefixes.PROFESSION_VARIANTS, () => Just (Category.PROFESSION_VARIANTS))
      .on (IdPrefixes.RACES, () => Just (Category.RACES))
      .on (IdPrefixes.RACE_VARIANTS, () => Just (Category.RACE_VARIANTS))
      .on (IdPrefixes.SPECIAL_ABILITIES, () => Just (Category.SPECIAL_ABILITIES))
      .on (IdPrefixes.SPELLS, () => Just (Category.SPELLS))
      .on (IdPrefixes.SKILLS, () => Just (Category.SKILLS))
      .otherwise (cnst (Nothing))

export const getCategoryById = pipe (
  getIdPrefix,
  getCategoryByIdPrefix
)

/**
 * @deprecated Only used for backwards compatibility of heroes. Do not use or
 * extend, use `traditionUtils.ts` instead.
 */
const magicalTraditionIdByNumericId = OrderedMap.fromArray<number, string> ([
  [ 1, SpecialAbilityId.TraditionGuildMages ],
  [ 2, SpecialAbilityId.TraditionWitches ],
  [ 3, SpecialAbilityId.TraditionElves ],
  [ 4, SpecialAbilityId.TraditionDruids ],
  [ 5, SpecialAbilityId.TraditionIllusionist ],
  [ 6, SpecialAbilityId.TraditionArcaneBard ],
  [ 7, SpecialAbilityId.TraditionArcaneDancer ],
  [ 8, SpecialAbilityId.TraditionIntuitiveMage ],
  [ 9, SpecialAbilityId.TraditionSavant ],
  [ 10, SpecialAbilityId.TraditionQabalyaMage ],
  [ 11, SpecialAbilityId.TraditionKristallomanten ],
  [ 12, SpecialAbilityId.TraditionGeoden ],
  [ 13, SpecialAbilityId.TraditionZauberalchimisten ],
  [ 14, SpecialAbilityId.TraditionSchelme ],
  [ 15, SpecialAbilityId.TraditionAnimisten ],
  [ 16, SpecialAbilityId.TraditionZibilijas ],
  [ 17, SpecialAbilityId.TraditionBrobimGeoden ],
])

/**
 * @deprecated Only used for backwards compatibility of heroes. Do not use or
 * extend, use `traditionUtils.ts` instead.
 */
export const getMagicalTraditionInstanceIdByNumericId = lookupF (magicalTraditionIdByNumericId)

/**
 * @deprecated Only used for backwards compatibility of heroes. Do not use or
 * extend, use `traditionUtils.ts` instead.
 */
const blessedTraditionIdByNumericId = OrderedMap.fromArray<number, string> ([
  [ 1, SpecialAbilityId.TraditionChurchOfPraios ],
  [ 2, SpecialAbilityId.TraditionChurchOfRondra ],
  [ 3, SpecialAbilityId.TraditionChurchOfBoron ],
  [ 4, SpecialAbilityId.TraditionChurchOfHesinde ],
  [ 5, SpecialAbilityId.TraditionChurchOfPhex ],
  [ 6, SpecialAbilityId.TraditionChurchOfPeraine ],
  [ 7, SpecialAbilityId.TraditionChurchOfEfferd ],
  [ 8, SpecialAbilityId.TraditionChurchOfTravia ],
  [ 9, SpecialAbilityId.TraditionChurchOfFirun ],
  [ 10, SpecialAbilityId.TraditionChurchOfTsa ],
  [ 11, SpecialAbilityId.TraditionChurchOfIngerimm ],
  [ 12, SpecialAbilityId.TraditionChurchOfRahja ],
  [ 13, SpecialAbilityId.TraditionCultOfTheNamelessOne ],
  [ 14, SpecialAbilityId.TraditionChurchOfAves ],
  [ 15, SpecialAbilityId.TraditionChurchOfIfirn ],
  [ 16, SpecialAbilityId.TraditionChurchOfKor ],
  [ 17, SpecialAbilityId.TraditionChurchOfNandus ],
  [ 18, SpecialAbilityId.TraditionChurchOfSwafnir ],
  [ 19, SpecialAbilityId.TraditionCultOfNuminoru ],
])

/**
 * @deprecated Only used for backwards compatibility of heroes. Do not use or
 * extend, use `traditionUtils.ts` instead.
 */
export const getBlessedTradStrIdFromNumId = lookupF (blessedTraditionIdByNumericId)

export const isCheckMod: (x: string) => x is CheckModifier =
  (x): x is CheckModifier => x === DCId.SPI || x === DCId.TOU || x === "SPI/2"

export const removeIdPrefix = (x: string): number => Number.parseInt (x.split ("_")[1], 10)

export type IdTags = Id["tag"]

export const idVariantToStringId = (id: Id): string => {
  switch (id.tag) {
    case "ExperienceLevel": return prefixId (IdPrefixes.EXPERIENCE_LEVELS) (id.value)
    case "Race": return prefixId (IdPrefixes.RACES) (id.value)
    case "Culture": return prefixId (IdPrefixes.CULTURES) (id.value)
    case "Profession": return prefixId (IdPrefixes.PROFESSIONS) (id.value)
    case "Attribute": return prefixId (IdPrefixes.ATTRIBUTES) (id.value)
    case "Advantage": return prefixId (IdPrefixes.ADVANTAGES) (id.value)
    case "Disadvantage": return prefixId (IdPrefixes.DISADVANTAGES) (id.value)
    case "Skill": return prefixId (IdPrefixes.SKILLS) (id.value)
    case "CombatTechnique": return prefixId (IdPrefixes.COMBAT_TECHNIQUES) (id.value)
    case "Spell": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "Curse": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "ElvenMagicalSong": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "DominationRitual": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "MagicalMelody": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "MagicalDance": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "RogueSpell": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "AnimistForce": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "GeodeRitual": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "ZibiljaRitual": return prefixId (IdPrefixes.SPELLS) (id.value)
    case "Cantrip": return prefixId (IdPrefixes.CANTRIPS) (id.value)
    case "LiturgicalChant": return prefixId (IdPrefixes.LITURGICAL_CHANTS) (id.value)
    case "Blessing": return prefixId (IdPrefixes.BLESSINGS) (id.value)
    case "SpecialAbility": return prefixId (IdPrefixes.SPECIAL_ABILITIES) (id.value)
    case "Item": return prefixId (IdPrefixes.ITEM) (id.value)
    case "EquipmentPackage": return prefixId (IdPrefixes.EXPERIENCE_LEVELS) (id.value)
    case "HitZoneArmor": return prefixId (IdPrefixes.HIT_ZONE_ARMOR) (id.value)
    case "Familiar": return prefixId (IdPrefixes.FAMILIAR) (id.value)
    case "Animal": return prefixId (IdPrefixes.ANIMAL) (id.value)
    case "FocusRule": return prefixId (IdPrefixes.FOCUS_RULE) (id.value)
    case "OptionalRule": return prefixId (IdPrefixes.OPTIONAL_RULE) (id.value)
    case "Condition": return prefixId (IdPrefixes.CONDITION) (id.value)
    case "State": return prefixId (IdPrefixes.STATE) (id.value)
    default: return assertNever (id)
  }
}
