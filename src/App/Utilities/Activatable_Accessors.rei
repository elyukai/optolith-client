/**
 * Convenient accessor functions for static Activatable entries.
 *
 * This module provides some accessor functions for accessing properties of a
 * static Activatable entry. The functions are named so that the name equals the
 * property name.
 *
 * It also provides a few functions for simple derived values.
 */

/**
 * Is an Activatable entry active?
 */
let isActive: Hero.Activatable.t => bool;

/**
 * Is an Activatable, where the entry may not have been created, active?
 */
let isActiveM: option(Hero.Activatable.t) => bool;

let name: Static.activatable => string;

let selectOptions: Static.activatable => Static.SelectOption.map;

let input: Static.activatable => option(string);

let apValue: Static.activatable => option(Static.Advantage.cost);
