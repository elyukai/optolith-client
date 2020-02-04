import { List } from "../../Data/List"

export enum Category {
  ADVANTAGES = "ADVANTAGES",
  ATTRIBUTES = "ATTRIBUTES",
  BLESSINGS = "BLESSINGS",
  CANTRIPS = "CANTRIPS",
  COMBAT_TECHNIQUES = "COMBAT_TECHNIQUES",
  CULTURES = "CULTURES",
  DISADVANTAGES = "DISADVANTAGES",
  LITURGICAL_CHANTS = "LITURGIES",
  PROFESSION_VARIANTS = "PROFESSION_VARIANTS",
  PROFESSIONS = "PROFESSIONS",
  RACE_VARIANTS = "RACE_VARIANTS",
  RACES = "RACES",
  SKILLS = "TALENTS",
  SPECIAL_ABILITIES = "SPECIAL_ABILITIES",
  SPELLS = "SPELLS",
}

export type ActivatableCategory = Category.ADVANTAGES
                                | Category.DISADVANTAGES
                                | Category.SPECIAL_ABILITIES

export type CategoryWithGroups = Category.COMBAT_TECHNIQUES
                               | Category.LITURGICAL_CHANTS
                               | Category.SPECIAL_ABILITIES
                               | Category.SPELLS
                               | Category.SKILLS

export type IncreasableCategory = Category.ATTRIBUTES
                                | Category.COMBAT_TECHNIQUES
                                | Category.LITURGICAL_CHANTS
                                | Category.SPELLS
                                | Category.SKILLS

export type SkillishCategory = Category.COMBAT_TECHNIQUES
                             | Category.LITURGICAL_CHANTS
                             | Category.SPELLS
                             | Category.SKILLS

export type ActivatableLikeCategory = Category.ADVANTAGES
                                    | Category.DISADVANTAGES
                                    | Category.SPECIAL_ABILITIES
                                    | Category.LITURGICAL_CHANTS
                                    | Category.SPELLS

export type ActivatableSkillCategory = Category.LITURGICAL_CHANTS | Category.SPELLS

export const ActivatableCategories = List<ActivatableCategory> (
  Category.ADVANTAGES,
  Category.DISADVANTAGES,
  Category.SPECIAL_ABILITIES
)

export const IncreasableCategories = List (
  Category.ATTRIBUTES,
  Category.COMBAT_TECHNIQUES,
  Category.LITURGICAL_CHANTS,
  Category.SPELLS,
  Category.SKILLS
)

export const SkillishCategories = List (
  Category.COMBAT_TECHNIQUES,
  Category.LITURGICAL_CHANTS,
  Category.SPELLS,
  Category.SKILLS
)

export const ActivatableLikeCategories = List<ActivatableLikeCategory> (
  Category.ADVANTAGES,
  Category.DISADVANTAGES,
  Category.SPECIAL_ABILITIES,
  Category.LITURGICAL_CHANTS,
  Category.SPELLS
)

export const ActivatableSkillCategories = List<ActivatableSkillCategory> (
  Category.LITURGICAL_CHANTS,
  Category.SPELLS
)
