type t = {
  naming: Activatable_Active_Name.combinedName,
  active: Activatable_Convert.singleWithId,
  apValue: int,
  isAutomatic: bool,
  validation: Activatable_Active_Validation.t,
  staticEntry: Static.activatable,
  heroEntry: Hero.Activatable.t,
} /*   t*/;

// /**
//  * `getActive cache staticData hero staticEntry maybeHeroEntry` validates an
//  * inactive entry, filters possible options and then either returns a valid
//  * entry with additional and filtered options or an invalid entry.
//  *
//  * This can be used to display valid as well as invalid entries in a single
//  * list.
//  */
// let getActive:
//   (
//     Activatable_Inactive_Cache.t,
//     Static.t,
//     Hero.t,
//     Static.activatable,
//     option(Hero.Activatable.t)
//   ) =>
