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
