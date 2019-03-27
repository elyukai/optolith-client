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
  [1, "SA_70"],
  [2, "SA_255"],
  [3, "SA_345"],
  [4, "SA_346"],
  [5, "SA_676"],
  [6, "SA_677"],
  [7, "SA_678"],
  [8, "SA_679"],
  [9, "SA_680"],
  [10, "SA_681"],
])

export const magicalNumericIdByTraditionId = OrderedMap.fromArray ([
  ["SA_70", 1],
  ["SA_255", 2],
  ["SA_345", 3],
  ["SA_346", 4],
  ["SA_676", 5],
  ["SA_677", 6],
  ["SA_678", 7],
  ["SA_679", 8],
  ["SA_680", 9],
  ["SA_681", 10],
])

export const isMagicalTraditionId = memberF (magicalNumericIdByTraditionId)

export const getMagicalTraditionInstanceIdByNumericId = lookupF (magicalTraditionIdByNumericId)

export const getNumericMagicalTraditionIdByInstanceId = lookupF (magicalNumericIdByTraditionId)

const blessedTraditionIdByNumericId = OrderedMap.fromArray ([
  [1, "SA_86"],
  [2, "SA_682"],
  [3, "SA_683"],
  [4, "SA_684"],
  [5, "SA_685"],
  [6, "SA_686"],
  [7, "SA_687"],
  [8, "SA_688"],
  [9, "SA_689"],
  [10, "SA_690"],
  [11, "SA_691"],
  [12, "SA_692"],
  [13, "SA_693"],
  [14, "SA_694"],
  [15, "SA_695"],
  [16, "SA_696"],
  [17, "SA_697"],
  [18, "SA_698"],
])

const blessedNumericIdByTraditionId = OrderedMap.fromArray ([
  ["SA_86", 1],
  ["SA_682", 2],
  ["SA_683", 3],
  ["SA_684", 4],
  ["SA_685", 5],
  ["SA_686", 6],
  ["SA_687", 7],
  ["SA_688", 8],
  ["SA_689", 9],
  ["SA_690", 10],
  ["SA_691", 11],
  ["SA_692", 12],
  ["SA_693", 13],
  ["SA_694", 14],
  ["SA_695", 15],
  ["SA_696", 16],
  ["SA_697", 17],
  ["SA_698", 18],
])

export const isBlessedTraditionId = memberF (blessedNumericIdByTraditionId)

export const getBlessedTradStrIdFromNumId = lookupF (blessedTraditionIdByNumericId)

export const getNumericBlessedTraditionIdByInstanceId = lookupF (blessedNumericIdByTraditionId)
