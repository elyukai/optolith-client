import { cnst } from "../../Data/Function";
import { foldl } from "../../Data/List";
import { Just, Maybe, Nothing } from "../../Data/Maybe";
import { inc, max } from "../../Data/Num";
import { lookupF, memberF, OrderedMap } from "../../Data/OrderedMap";
import { Categories } from "../Constants/Categories";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { match } from "./match";
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
  [1, prefixSA (70)],    // Guild Mage
  [2, prefixSA (255)],   // Hexen
  [3, prefixSA (345)],   // Elfen
  [4, prefixSA (346)],   // Druiden
  [5, prefixSA (676)],   // Scharlatan
  [6, prefixSA (677)],   // Zauberbarde
  [7, prefixSA (678)],   // Zaubertänzer
  [8, prefixSA (679)],   // Intuitiver Zauberer
  [9, prefixSA (680)],   // Meistertalentierte
  [10, prefixSA (681)],  // Qabalyamagier
  // [11, prefixSA (0000)], // Kristallomanten
  [12, prefixSA (1255)], // Geoden
  [13, prefixSA (750)],  // Zauberalchimisten
  [14, prefixSA (726)],  // Schelme
  [15, prefixSA (1221)], // Animisten
  [16, prefixSA (1293)], // Zibilijas
  [17, prefixSA (1438)], // Brobim-Geoden
])

export const magicalNumericIdByTraditionId = OrderedMap.fromArray ([
  [prefixSA (70), 1],    // Guild Mage
  [prefixSA (255), 2],   // Hexen
  [prefixSA (345), 3],   // Elfen
  [prefixSA (346), 4],   // Druiden
  [prefixSA (676), 5],   // Scharlatan
  [prefixSA (677), 6],   // Zauberbarde
  [prefixSA (678), 7],   // Zaubertänzer
  [prefixSA (679), 8],   // Intuitiver Zauberer
  [prefixSA (680), 9],   // Meistertalentierte
  [prefixSA (681), 10],  // Qabalyamagier
  // [prefixSA (0000), 11], // Kristallomanten
  [prefixSA (1255), 12], // Geoden
  [prefixSA (750), 13],  // Zauberalchimisten
  [prefixSA (726), 14],  // Schelme
  [prefixSA (1221), 15], // Animisten
  [prefixSA (1293), 16], // Zibilijas
  [prefixSA (1438), 17], // Brobim-Geoden
])

export const isMagicalTraditionId = memberF (magicalNumericIdByTraditionId)

export const getMagicalTraditionInstanceIdByNumericId = lookupF (magicalTraditionIdByNumericId)

export const getNumericMagicalTraditionIdByInstanceId = lookupF (magicalNumericIdByTraditionId)

const blessedTraditionIdByNumericId = OrderedMap.fromArray ([
  [1, prefixSA (86)],    // Praios
  [2, prefixSA (682)],   // Rondra
  [3, prefixSA (683)],   // Boron
  [4, prefixSA (684)],   // Hesinde
  [5, prefixSA (685)],   // Phex
  [6, prefixSA (686)],   // Peraine
  [7, prefixSA (687)],   // Efferd
  [8, prefixSA (688)],   // Travia
  [9, prefixSA (689)],   // Firun
  [10, prefixSA (690)],  // Tsa
  [11, prefixSA (691)],  // Ingerimm
  [12, prefixSA (692)],  // Rahja
  [13, prefixSA (693)],  // Namenloser
  [14, prefixSA (694)],  // Aves
  [15, prefixSA (695)],  // Ifirn
  [16, prefixSA (696)],  // Kor
  [17, prefixSA (697)],  // Nandus
  [18, prefixSA (698)],  // Swafnir
  [19, prefixSA (1049)], // Numinorukult
])

const blessedNumericIdByTraditionId = OrderedMap.fromArray ([
  [prefixSA (86), 1],    // Praios
  [prefixSA (682), 2],   // Rondra
  [prefixSA (683), 3],   // Boron
  [prefixSA (684), 4],   // Hesinde
  [prefixSA (685), 5],   // Phex
  [prefixSA (686), 6],   // Peraine
  [prefixSA (687), 7],   // Efferd
  [prefixSA (688), 8],   // Travia
  [prefixSA (689), 9],   // Firun
  [prefixSA (690), 10],  // Tsa
  [prefixSA (691), 11],  // Ingerimm
  [prefixSA (692), 12],  // Rahja
  [prefixSA (693), 13],  // Namenloser
  [prefixSA (694), 14],  // Aves
  [prefixSA (695), 15],  // Ifirn
  [prefixSA (696), 16],  // Kor
  [prefixSA (697), 17],  // Nandus
  [prefixSA (698), 18],  // Swafnir
  [prefixSA (1049), 19], // Numinorukult
])

export const isBlessedTraditionId = memberF (blessedNumericIdByTraditionId)

export const getBlessedTradStrIdFromNumId = lookupF (blessedTraditionIdByNumericId)

export const getNumericBlessedTraditionIdByInstanceId = lookupF (blessedNumericIdByTraditionId)
