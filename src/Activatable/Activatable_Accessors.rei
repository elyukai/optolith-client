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
let isActive: Activatable_Dynamic.t => bool;

/**
 * Is an Activatable, where the entry may not have been created, active?
 */
let isActiveM: option(Activatable_Dynamic.t) => bool;

let id: Static.activatable => Id.Activatable.t;

let id': Static.activatable => int;

let name: Static.activatable => string;

let selectOptions: Static.activatable => SelectOption.map;

let input: Static.activatable => option(string);

let apValue: Static.activatable => option(Advantage.Static.apValue);

let apValue': Static.activatable => option(OneOrMany.t(int));

let max: Static.activatable => option(int);
