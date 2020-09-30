/**
 * Generate final AP values.
 *
 * This module provides types and functions to sum up spent adventure points,
 * make adjustments to calculations from other modules and to check if enough AP
 * are available for certain operations.
 */

/**
 * Provides an overview how many AP are spent on different categories and in
 * general.
 */
type categories = {
  total: int,
  spent: int,
  available: int,
  spentOnAdvantages: int,
  spentOnMagicalAdvantages: int,
  spentOnBlessedAdvantages: int,
  spentOnDisadvantages: int,
  spentOnMagicalDisadvantages: int,
  spentOnBlessedDisadvantages: int,
  spentOnAttributes: int,
  spentOnSkills: int,
  spentOnCombatTechniques: int,
  spentOnSpells: int,
  spentOnLiturgicalChants: int,
  spentOnCantrips: int,
  spentOnBlessings: int,
  spentOnSpecialAbilities: int,
  spentOnEnergies: int,
  spentOnRace: int,
  spentOnProfession: option(int),
};

/**
 * Checks if there are enough AP available. If there are, returns `None`.
 * Otherwise returns a `Some` of the missing AP.
 */
let getMissingAp:
  (~isInCharacterCreation: bool, ~apAvailable: int, ~apCost: int) =>
  option(int);

/**
 * Returns the maximum AP value you can spend on magical/blessed
 * advantages/disadvantages. Default is 50, but the tradition may only allow 25.
 */
let getDisAdvantagesSubtypeMax: (Static.t, Hero.t, bool) => int;

/**
 * This type defines missing adventure point categories. If a category is a
 * `Some`, there are AP missing in that category. If a category is `None`,
 * enough AP are available.
 *
 * If `totalMissing` is a `Some`, there are missing AP in general, not just
 * related to advantages and disadvantages.
 *
 * If `mainMissing` is a `Some`, there are not enough available AP to be spent
 * on advantages or disadvantages.
 *
 * If `mainMissing` is a `Some`, there are not enough available AP to be spent
 * on magical or blessed advantages or disadvantages.
 */
type missingApForDisAdvantage = {
  totalMissing: option(int),
  mainMissing: option(int),
  subMissing: option(int),
};

type disAdvantageStatic =
  | Advantage(Advantage.t)
  | Disadvantage(Disadvantage.t);

/**
 * Checks if there are enough AP available and if the restrictions for
 * advantages/disadvantages will be met.
 */
let getMissingApForDisAdvantage:
  (
    ~staticData: Static.t,
    ~hero: Hero.t,
    ~isInCharacterCreation: bool,
    ~apCategories: categories,
    ~isMagical: bool,
    ~isBlessed: bool,
    ~apCost: int,
    ~staticEntry: disAdvantageStatic
  ) =>
  missingApForDisAdvantage;

module Sum: {
  let getApSpentOnAttributes: Ley_IntMap.t(Hero.Attribute.t) => int;

  let getApSpentOnSkills: (Static.t, Ley_IntMap.t(Skill.Dynamic.t)) => int;

  let getApSpentOnCombatTechniques:
    (Static.t, Ley_IntMap.t(Skill.Dynamic.t)) => int;

  let getApSpentOnSpells:
    (Static.t, Ley_IntMap.t(Hero.ActivatableSkill.t)) => int;

  let getApSpentOnLiturgicalChants:
    (Static.t, Ley_IntMap.t(Hero.ActivatableSkill.t)) => int;

  let getApSpentOnCantrips: Ley_IntMap.t('a) => int;

  let getAPSpentOnBlessings: Ley_IntMap.t('a) => int;
};
