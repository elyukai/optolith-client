type single = {
  options : Id.Activatable.Option.t list;
  level : int option;
  customCost : int option;
}

type dependency = {
  source : Id.Activatable.t;
  target : int OneOrMany.t;
  active : bool;
  options : Id.Activatable.SelectOption.t OneOrMany.t list;
  level : int option;
}

type 'static t = {
  id : int;
  active : single list;
  dependencies : dependency list;
  static : 'static option;
}

let empty static id = { id; active = []; dependencies = []; static }

let is_empty (x : 'a t) = Ley_List.null x.active && Ley_List.null x.dependencies

let is_active (x : 'a t) = Ley_List.Extra.notNull x.active

let is_active' x = Ley_Option.option false is_active x

module type S = sig
  type static

  type nonrec t = static t
  (** The dynamic values in a character with a reference to the static values
      from the database. *)

  val empty : static option -> int -> t
  (** [empty id] creates a new dynamic entry from an id. *)

  val is_empty : t -> bool
  (** [is_empty x] checks if the passed dynamic entry is empty. *)

  val is_active : t -> bool
  (** [is_active x] checks if the passed dynamic entry is active. *)

  val is_active' : t option -> bool
  (** [is_active' x] checks if the passed optional dynamic entry is active. *)
end

module Make (S : sig
  type static
end) : S with type static = S.static = struct
  type static = S.static

  type nonrec t = static t

  let empty = empty

  let is_empty = is_empty

  let is_active = is_active

  let is_active' = is_active'
end
