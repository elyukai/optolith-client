import { cnst } from "../../Data/Function";
import { foldl } from "../../Data/List";
import { Just, Maybe, Nothing } from "../../Data/Maybe";
import { lookupF, memberF, OrderedMap } from "../../Data/OrderedMap";
import { Categories } from "../Constants/Categories";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { match } from "./match";
import { inc, max } from "./mathUtils";
import { pipe } from "./pipe";

export const getIdPrefix = (id: string) => id.split (/_/)[0] as IdPrefixes

export const getNumericId = (id: string) => Number.parseInt (id.split (/_/)[1], 10)

export const prefixId = (prefix: IdPrefixes) => (id: number | string) => `${prefix}_${id}`

/**
 * Create a race id.
 */
export const prefixRace = prefixId (IdPrefixes.RACES)

/**
 * Create a culture id.
 */
export const prefixC = prefixId (IdPrefixes.CULTURES)

/**
 * Create a profession id.
 */
export const prefixProf = prefixId (IdPrefixes.PROFESSIONS)

/**
 * Create an attribute id.
 */
export const prefixAttr = prefixId (IdPrefixes.ATTRIBUTES)

/**
 * Create an advantage id.
 */
export const prefixAdv = prefixId (IdPrefixes.ADVANTAGES)

/**
 * Create a disadvantage id.
 */
export const prefixDis = prefixId (IdPrefixes.DISADVANTAGES)

/**
 * Create a special ability id.
 */
export const prefixSA = prefixId (IdPrefixes.SPECIAL_ABILITIES)

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

export const magicalTraditionIdByNumericId = OrderedMap.fromArray ([
  [1, prefixSA (70)],
  [2, prefixSA (255)],
  [3, prefixSA (345)],
  [4, prefixSA (346)],
  [5, prefixSA (676)],
  [6, prefixSA (677)],
  [7, prefixSA (678)],
  [8, prefixSA (679)],
  [9, prefixSA (680)],
  [10, prefixSA (681)],
  // [11, prefixSA ()], // Kristallomanten
  [12, prefixSA (1255)],
  // [13, prefixSA ()], // Alchimisten
  [14, prefixSA (726)],
])

export const magicalNumericIdByTraditionId = OrderedMap.fromArray ([
  [prefixSA (70), 1],
  [prefixSA (255), 2],
  [prefixSA (345), 3],
  [prefixSA (346), 4],
  [prefixSA (676), 5],
  [prefixSA (677), 6],
  [prefixSA (678), 7],
  [prefixSA (679), 8],
  [prefixSA (680), 9],
  [prefixSA (681), 10],
  // [prefixSA (), 11], // Kristallomanten
  [prefixSA (1255), 12],
  // [prefixSA (), 13], // Alchimisten
  [prefixSA (726), 14],
])

export const isMagicalTraditionId = memberF (magicalNumericIdByTraditionId)

export const getMagicalTraditionInstanceIdByNumericId = lookupF (magicalTraditionIdByNumericId)

export const getNumericMagicalTraditionIdByInstanceId = lookupF (magicalNumericIdByTraditionId)

const blessedTraditionIdByNumericId = OrderedMap.fromArray ([
  [1, prefixSA (86)],
  [2, prefixSA (682)],
  [3, prefixSA (683)],
  [4, prefixSA (684)],
  [5, prefixSA (685)],
  [6, prefixSA (686)],
  [7, prefixSA (687)],
  [8, prefixSA (688)],
  [9, prefixSA (689)],
  [10, prefixSA (690)],
  [11, prefixSA (691)],
  [12, prefixSA (692)],
  [13, prefixSA (693)],
  [14, prefixSA (694)],
  [15, prefixSA (695)],
  [16, prefixSA (696)],
  [17, prefixSA (697)],
  [18, prefixSA (698)],
])

const blessedNumericIdByTraditionId = OrderedMap.fromArray ([
  [prefixSA (86), 1],
  [prefixSA (682), 2],
  [prefixSA (683), 3],
  [prefixSA (684), 4],
  [prefixSA (685), 5],
  [prefixSA (686), 6],
  [prefixSA (687), 7],
  [prefixSA (688), 8],
  [prefixSA (689), 9],
  [prefixSA (690), 10],
  [prefixSA (691), 11],
  [prefixSA (692), 12],
  [prefixSA (693), 13],
  [prefixSA (694), 14],
  [prefixSA (695), 15],
  [prefixSA (696), 16],
  [prefixSA (697), 17],
  [prefixSA (698), 18],
])

export const isBlessedTraditionId = memberF (blessedNumericIdByTraditionId)

export const getBlessedTradStrIdFromNumId = lookupF (blessedTraditionIdByNumericId)

export const getNumericBlessedTraditionIdByInstanceId = lookupF (blessedNumericIdByTraditionId)
