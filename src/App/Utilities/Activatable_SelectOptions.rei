open Activatable_Convert;

/**
 * Get a select option with the given id from given static entry. Returns
 * `Nothing` if not found.
 */
let getSelectOption:
  (Static.activatable, Hero.Activatable.optionId) =>
  option(Static_SelectOption.t);

/**
 * Get a select option's name with the given id from given static entry.
 * Returns `Nothing` if not found.
 */
let getSelectOptionName:
  (Static.activatable, Hero.Activatable.optionId) => option(string);

/**
 * Get a select option's cost with the given id from given static entry.
 * Returns `Nothing` if not found.
 */
let getSelectOptionCost:
  (Static.activatable, Hero.Activatable.optionId) => option(int);

/**
 * Get all first select option IDs from the given entry.
 */
let getActiveOptions1: Hero.Activatable.t => list(Hero.Activatable.optionId);

/**
 * Get all second select option IDs from the given entry.
 */
let getActiveOptions2: Hero.Activatable.t => list(Hero.Activatable.optionId);

let getOption: (int, singleWithId) => option(Hero.Activatable.optionId);

let getOption1: singleWithId => option(Hero.Activatable.optionId);

let getOption2: singleWithId => option(Hero.Activatable.optionId);

let getOption3: singleWithId => option(Hero.Activatable.optionId);

let getCustomInput: Hero.Activatable.optionId => option(string);

let getGenericId: Hero.Activatable.optionId => option(int);

let lookupMap: (Ley.IntMap.key, Ley.IntMap.t('b), 'b => 'a) => option('a);

let getSkillFromOption:
  (Static.t, Hero.Activatable.optionId) => option(Static.Skill.t);
