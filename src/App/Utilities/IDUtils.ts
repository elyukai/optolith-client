import { cnst } from "../../Data/Function";
import { foldl } from "../../Data/List";
import { Just, Maybe, Nothing } from "../../Data/Maybe";
import { inc, max } from "../../Data/Num";
import { lookupF, OrderedMap } from "../../Data/OrderedMap";
import { Categories } from "../Constants/Categories";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { DCId, SpecialAbilityId } from "../Constants/Ids";
import { CheckModifier } from "../Models/Wiki/wikiTypeHelpers";
import { match } from "./match";
import { pipe } from "./pipe";

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
export const getNewIdByDate = (): number => Date.now () .valueOf ();

export const getCategoryByIdPrefix =
  (id: IdPrefixes): Maybe<Categories> =>
    match<IdPrefixes, Maybe<Categories>> (id)
      .on (IdPrefixes.ADVANTAGES, () => Just (Categories.ADVANTAGES))
      .on (IdPrefixes.ATTRIBUTES, () => Just (Categories.ATTRIBUTES))
      .on (IdPrefixes.BLESSINGS, () => Just (Categories.BLESSINGS))
      .on (IdPrefixes.CANTRIPS, () => Just (Categories.CANTRIPS))
      .on (IdPrefixes.COMBAT_TECHNIQUES, () => Just (Categories.COMBAT_TECHNIQUES))
      .on (IdPrefixes.CULTURES, () => Just (Categories.CULTURES))
      .on (IdPrefixes.DISADVANTAGES, () => Just (Categories.DISADVANTAGES))
      .on (IdPrefixes.LITURGICAL_CHANTS, () => Just (Categories.LITURGIES))
      .on (IdPrefixes.PROFESSIONS, () => Just (Categories.PROFESSIONS))
      .on (IdPrefixes.PROFESSION_VARIANTS, () => Just (Categories.PROFESSION_VARIANTS))
      .on (IdPrefixes.RACES, () => Just (Categories.RACES))
      .on (IdPrefixes.RACE_VARIANTS, () => Just (Categories.RACE_VARIANTS))
      .on (IdPrefixes.SPECIAL_ABILITIES, () => Just (Categories.SPECIAL_ABILITIES))
      .on (IdPrefixes.SPELLS, () => Just (Categories.SPELLS))
      .on (IdPrefixes.SKILLS, () => Just (Categories.TALENTS))
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
  [1, SpecialAbilityId.TraditionGuildMages],
  [2, SpecialAbilityId.TraditionWitches],
  [3, SpecialAbilityId.TraditionElves],
  [4, SpecialAbilityId.TraditionDruids],
  [5, SpecialAbilityId.TraditionScharlatane],
  [6, SpecialAbilityId.TraditionZauberbarden],
  [7, SpecialAbilityId.TraditionZaubertaenzer],
  [8, SpecialAbilityId.TraditionIntuitiveZauberer],
  [9, SpecialAbilityId.TraditionMeistertalentierte],
  [10, SpecialAbilityId.TraditionQabalyamagier],
  [11, SpecialAbilityId.TraditionKristallomanten],
  [12, SpecialAbilityId.TraditionGeoden],
  [13, SpecialAbilityId.TraditionZauberalchimisten],
  [14, SpecialAbilityId.TraditionSchelme],
  [15, SpecialAbilityId.TraditionAnimisten],
  [16, SpecialAbilityId.TraditionZibilijas],
  [17, SpecialAbilityId.TraditionBrobimGeoden],
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
  [1, SpecialAbilityId.TraditionChurchOfPraios],
  [2, SpecialAbilityId.TraditionChurchOfRondra],
  [3, SpecialAbilityId.TraditionChurchOfBoron],
  [4, SpecialAbilityId.TraditionChurchOfHesinde],
  [5, SpecialAbilityId.TraditionChurchOfPhex],
  [6, SpecialAbilityId.TraditionChurchOfPeraine],
  [7, SpecialAbilityId.TraditionChurchOfEfferd],
  [8, SpecialAbilityId.TraditionChurchOfTravia],
  [9, SpecialAbilityId.TraditionChurchOfFirun],
  [10, SpecialAbilityId.TraditionChurchOfTsa],
  [11, SpecialAbilityId.TraditionChurchOfIngerimm],
  [12, SpecialAbilityId.TraditionChurchOfRahja],
  [13, SpecialAbilityId.TraditionCultOfTheNamelessOne],
  [14, SpecialAbilityId.TraditionChurchOfAves],
  [15, SpecialAbilityId.TraditionChurchOfIfirn],
  [16, SpecialAbilityId.TraditionChurchOfKor],
  [17, SpecialAbilityId.TraditionChurchOfNandus],
  [18, SpecialAbilityId.TraditionChurchOfSwafnir],
  [19, SpecialAbilityId.TraditionCultOfNuminoru],
])

/**
 * @deprecated Only used for backwards compatibility of heroes. Do not use or
 * extend, use `traditionUtils.ts` instead.
 */
export const getBlessedTradStrIdFromNumId = lookupF (blessedTraditionIdByNumericId)

export const isCheckMod: (x: string) => x is CheckModifier =
  (x): x is CheckModifier => x === DCId.SPI || x === DCId.TOU || x === "SPI/2"
