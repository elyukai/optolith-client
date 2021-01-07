(** Convert specific values to be able to easier work with them.

    This function provides some utility functions to convert some types from the
    state into smaller chuncks that are more usable for working with single
    entries. *)

type single_with_id = {
  id : int;
  index : int;
  options : Id.Activatable.Option.t list;
  level : int option;
  customCost : int option;
}
(** A single active Activatable. *)

val hero_entry_to_singles : 'a Activatable_Dynamic.t -> single_with_id list
(** Converts an Activatable hero entry into a "flattened" list of it's
    activations. *)

val single_to_single_with_id :
  'a Activatable_Dynamic.t ->
  int ->
  Activatable_Dynamic.single ->
  single_with_id

val activatable_option_to_select_option_id :
  Id.Activatable.Option.t -> Id.Activatable.SelectOption.t option

val single_with_id_to_single : single_with_id -> Activatable_Dynamic.single
