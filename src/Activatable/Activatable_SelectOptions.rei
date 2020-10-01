/**
 * Get specific Select Options.
 *
 * This module provides some utility functions for working with static and
 * active Select Options.
 */

open Activatable_Convert;

/**
 * Get a select option with the given id from given static entry. Returns
 * `Nothing` if not found.
 */
let getSelectOption:
  (Static.activatable, Id.Activatable.Option.t) => option(SelectOption.t);

/**
 * Get a select option's name with the given id from given static entry.
 * Returns `Nothing` if not found.
 */
let getSelectOptionName:
  (Static.activatable, Id.Activatable.Option.t) => option(string);

/**
 * Get a option's cost with the given id from given static entry. Returns
 * `Nothing` if not found.
 */
let getSelectOptionCost:
  (Static.activatable, Id.Activatable.Option.t) => option(int);

/**
 * Get all first option IDs from the given entry.
 */
let getActiveOptions1: Hero.Activatable.t => list(Id.Activatable.Option.t);

/**
 * `mapActiveOptions1 f entry` takes all first option ids from the given entry
 * and returns all values where the passed function, applied to each id,
 * returned a `Some`, which is then unwrapped.
 */
let mapActiveOptions1:
  (Id.Activatable.Option.t => option('a), Hero.Activatable.t) => list('a);

/**
 * Get all first select option IDs from the given entry.
 */
let getActiveSelectOptions1:
  Hero.Activatable.t => list(Id.Activatable.SelectOption.t);

/**
 * Get all second option IDs from the given entry.
 */
let getActiveOptions2: Hero.Activatable.t => list(Id.Activatable.Option.t);

/**
 * Get all second option ids from the given entry, sorted by their first option
 * id in a map.
 */
let getActiveOptions2Map:
  Hero.Activatable.t => SelectOption.Map.t(list(Id.Activatable.Option.t));

let getOption: (int, singleWithId) => option(Id.Activatable.Option.t);

let getOption1: singleWithId => option(Id.Activatable.Option.t);

let getOption2: singleWithId => option(Id.Activatable.Option.t);

let getOption3: singleWithId => option(Id.Activatable.Option.t);

let getCustomInput: Id.Activatable.Option.t => option(string);

let getGenericId: Id.Activatable.Option.t => option(int);

let lookupMap: (Ley_IntMap.key, Ley_IntMap.t('b), 'b => 'a) => option('a);

let getSkillFromOption:
  (Static.t, Id.Activatable.Option.t) => option(Skill.Static.t);
