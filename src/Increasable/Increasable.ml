module Dynamic = struct
  type dependency = {
    source : Id.ActivatableAndSkill.t;
    target : int OneOrMany.t;
    value : int;
  }

  type 'static t = {
    id : int;
    value : int;
    dependencies : dependency list;
    static : 'static option;
  }

  module type S = sig
    type static
    (** The static values from the database. *)

    type nonrec t = static t
    (** The dynamic values in a character with a reference to the static values
        from the database. *)

    val empty : static option -> int -> t
    (** [empty id] creates a new dynamic entry from an id. *)

    val is_empty : t -> bool
    (** [is_empty x] checks if the passed dynamic entry is empty. *)

    val value : t option -> int
    (** [value x] takes a dynamic entry that might not exist and returns the
        value of that entry. If the entry is not yet defined, it's value is the
        minimum value of the entry type, e.g. 8 for attributes, 0 for skills and
        6 for combat techniques. *)
  end

  module type Config = sig
    type static
    (** The static values from the database. *)

    val min_value : int
    (** The minimum possible value of the entry. *)
  end

  module Make (Config : Config) : S with type static = Config.static = struct
    type static = Config.static

    type nonrec t = static t

    let min_value = Config.min_value

    let empty static id = { id; value = min_value; dependencies = []; static }

    let is_empty (x : t) = x.value <= min_value && Ley_List.null x.dependencies

    let value maybeEntry =
      Ley_Option.option min_value (fun (x : t) -> x.value) maybeEntry
  end
end
