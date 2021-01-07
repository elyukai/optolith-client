(**
 * Convenient accessor functions for static Activatable entries.
 *
 * This module provides some accessor functions for accessing properties of a
 * static Activatable entry. The functions are named so that the name equals the
 * property name.
 *
 * It also provides a few functions for simple derived values.
 *)

val isActive : 'a Activatable_Dynamic.t -> bool
(**
 * Is an Activatable entry active?
 *)

val isActiveM : 'a Activatable_Dynamic.t option -> bool
(**
 * Is an Activatable, where the entry may not have been created, active?
 *)

val id : Activatable.t -> Id.Activatable.t

val id' : Activatable.t -> int

val idDeepVariant : Activatable.t -> Id.Activatable.Nested.t

val name : Activatable.t -> string

val selectOptions : Activatable.t -> SelectOption.map

val input : Activatable.t -> string option

val apValue : Activatable.t -> Activatable_Shared.ApValue.t option

val apValue' : Activatable.t -> int OneOrMany.t option

val max : Activatable.t -> int option
