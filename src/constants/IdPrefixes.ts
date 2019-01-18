import { Categories } from "./Categories";

export enum IdPrefixes {
  ADVANTAGES = "ADV",
  ATTRIBUTES = "ATTR",
  BLESSINGS = "BLESSING",
  CANTRIPS = "CANTRIP",
  COMBAT_TECHNIQUES = "CT",
  CULTURES = "C",
  DISADVANTAGES = "DISADV",
  EXPERIENCE_LEVELS = "EL",
  LITURGICAL_CHANTS = "LITURGY",
  PROFESSION_VARIANTS = "PV",
  PROFESSIONS = "P",
  RACE_VARIANTS = "RV",
  RACES = "R",
  SPECIAL_ABILITIES = "SA",
  SPELLS = "SPELL",
  SKILLS = "TAL",
}

type IdPrefixesByCategory = {
  [K in Categories]: IdPrefixes
}

export const IdPrefixesByCategory = Object.freeze<IdPrefixesByCategory> ({
  [Categories.ADVANTAGES]: IdPrefixes.ADVANTAGES,
  [Categories.ATTRIBUTES]: IdPrefixes.ATTRIBUTES,
  [Categories.BLESSINGS]: IdPrefixes.BLESSINGS,
  [Categories.CANTRIPS]: IdPrefixes.CANTRIPS,
  [Categories.COMBAT_TECHNIQUES]: IdPrefixes.COMBAT_TECHNIQUES,
  [Categories.CULTURES]: IdPrefixes.CULTURES,
  [Categories.DISADVANTAGES]: IdPrefixes.DISADVANTAGES,
  [Categories.LITURGIES]: IdPrefixes.LITURGICAL_CHANTS,
  [Categories.PROFESSION_VARIANTS]: IdPrefixes.PROFESSION_VARIANTS,
  [Categories.PROFESSIONS]: IdPrefixes.PROFESSIONS,
  [Categories.RACE_VARIANTS]: IdPrefixes.RACE_VARIANTS,
  [Categories.RACES]: IdPrefixes.RACES,
  [Categories.SPECIAL_ABILITIES]: IdPrefixes.SPECIAL_ABILITIES,
  [Categories.SPELLS]: IdPrefixes.SPELLS,
  [Categories.TALENTS]: IdPrefixes.SKILLS,
})
