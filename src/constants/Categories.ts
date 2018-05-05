export enum Categories {
  ADVANTAGES = 'ADVANTAGES',
  ATTRIBUTES = 'ATTRIBUTES',
  BLESSINGS = 'BLESSINGS',
  CANTRIPS = 'CANTRIPS',
  COMBAT_TECHNIQUES = 'COMBAT_TECHNIQUES',
  CULTURES = 'CULTURES',
  DISADVANTAGES = 'DISADVANTAGES',
  LITURGIES = 'LITURGIES',
  PROFESSION_VARIANTS = 'PROFESSION_VARIANTS',
  PROFESSIONS = 'PROFESSIONS',
  RACE_VARIANTS = 'RACE_VARIANTS',
  RACES = 'RACES',
  SPECIAL_ABILITIES = 'SPECIAL_ABILITIES',
  SPELLS = 'SPELLS',
  TALENTS = 'TALENTS',
}

export type ActivatableCategory =
  Categories.ADVANTAGES |
  Categories.DISADVANTAGES |
  Categories.SPECIAL_ABILITIES;

export const ActivatableCategories = [
  Categories.ADVANTAGES,
  Categories.DISADVANTAGES,
  Categories.SPECIAL_ABILITIES,
];

export type CategoryWithGroups =
  Categories.COMBAT_TECHNIQUES |
  Categories.LITURGIES |
  Categories.SPECIAL_ABILITIES |
  Categories.SPELLS |
  Categories.TALENTS;

export type IncreasableCategory =
  Categories.ATTRIBUTES |
  Categories.COMBAT_TECHNIQUES |
  Categories.LITURGIES |
  Categories.SPELLS |
  Categories.TALENTS;

export const IncreasableCategories = [
  Categories.ATTRIBUTES,
  Categories.COMBAT_TECHNIQUES,
  Categories.LITURGIES,
  Categories.SPELLS,
  Categories.TALENTS,
];

export type ActivatableLikeCategory =
  Categories.ADVANTAGES |
  Categories.DISADVANTAGES |
  Categories.SPECIAL_ABILITIES |
  Categories.LITURGIES |
  Categories.SPELLS;

export const ActivatableLikeCategories = [
  Categories.ADVANTAGES,
  Categories.DISADVANTAGES,
  Categories.SPECIAL_ABILITIES,
  Categories.LITURGIES,
  Categories.SPELLS,
];

export type ActivatableSkillCategory =
  Categories.LITURGIES |
  Categories.SPELLS;

export const ActivatableSkillCategories = [
  Categories.LITURGIES,
  Categories.SPELLS,
];
