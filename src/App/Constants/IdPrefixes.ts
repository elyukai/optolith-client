import { Category } from "./Categories"

export enum IdPrefixes {
  ADVANTAGES = "ADV",
  ATTRIBUTES = "ATTR",
  BLESSINGS = "BLESSING",
  CANTRIPS = "CANTRIP",
  COMBAT_TECHNIQUES = "CT",
  CULTURES = "C",
  DISADVANTAGES = "DISADV",
  EXPERIENCE_LEVELS = "EL",
  HERO = "H",
  HIT_ZONE_ARMOR = "ARMORZONES",
  ITEM = "ITEM",
  ITEM_TEMPLATE = "ITEMTPL",
  LITURGICAL_CHANTS = "LITURGY",
  PROFESSION_VARIANTS = "PV",
  PROFESSIONS = "P",
  RACE_VARIANTS = "RV",
  RACES = "R",
  SPECIAL_ABILITIES = "SA",
  SPELLS = "SPELL",
  SKILLS = "TAL",
  EQUIPMENT_PACKAGE = "ITEMPKG",
  FAMILIAR = "PET",
  ANIMAL = "PET",
  FOCUS_RULE = "FR",
  OPTIONAL_RULE = "OR",
  CONDITION = "COND",
  STATE = "STATE",
}

type IdPrefixesByCategory = {
  [K in Category]: IdPrefixes
}

export const IdPrefixesByCategory = Object.freeze<IdPrefixesByCategory> ({
  [Category.ADVANTAGES]: IdPrefixes.ADVANTAGES,
  [Category.ATTRIBUTES]: IdPrefixes.ATTRIBUTES,
  [Category.BLESSINGS]: IdPrefixes.BLESSINGS,
  [Category.CANTRIPS]: IdPrefixes.CANTRIPS,
  [Category.COMBAT_TECHNIQUES]: IdPrefixes.COMBAT_TECHNIQUES,
  [Category.CULTURES]: IdPrefixes.CULTURES,
  [Category.DISADVANTAGES]: IdPrefixes.DISADVANTAGES,
  [Category.LITURGICAL_CHANTS]: IdPrefixes.LITURGICAL_CHANTS,
  [Category.PROFESSION_VARIANTS]: IdPrefixes.PROFESSION_VARIANTS,
  [Category.PROFESSIONS]: IdPrefixes.PROFESSIONS,
  [Category.RACE_VARIANTS]: IdPrefixes.RACE_VARIANTS,
  [Category.RACES]: IdPrefixes.RACES,
  [Category.SPECIAL_ABILITIES]: IdPrefixes.SPECIAL_ABILITIES,
  [Category.SPELLS]: IdPrefixes.SPELLS,
  [Category.SKILLS]: IdPrefixes.SKILLS,
})
