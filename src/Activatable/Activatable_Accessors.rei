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

let id: Activatable.t => Id.Activatable.t;

let id': Activatable.t => int;

let idDeepVariant: Activatable.t => Id.Activatable.DeepVariant.t;

let name: Activatable.t => string;

let selectOptions: Activatable.t => SelectOption.map;

let input: Activatable.t => option(string);

let apValue: Activatable.t => option(Advantage.Static.apValue);

let apValue': Activatable.t => option(OneOrMany.t(int));

let max: Activatable.t => option(int);
