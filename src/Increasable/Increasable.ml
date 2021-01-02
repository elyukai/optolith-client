module Dynamic = struct
  type dependency = {
    source : Id.ActivatableAndSkill.t;
    target : int OneOrMany.t;
    value : int;
  }

  module type S = sig
    type static
    (** The static values from the database. *)

    type t = {
      id : int;
      value : int;
      dependencies : dependency list;
      static : static option;
    }
    (** The dynamic values in a character with a reference to the static values
        from the database. *)

    val empty : static option -> int -> t
    (** [empty id] creates a new dynamic entry from an id. *)

    val isEmpty : t -> bool
    (** [isEmpty x] checks if the passed dynamic entry is empty. *)

    val getValueDef : t option -> int
    (** [getValueDef maybe] takes a dynamic entry that might not exist and
        returns the value of that entry. If the entry is not yet defined, it's
        value is the minimum value of the entry type, e.g. 8 for attributes, 0
        for skills and 6 for combat techniques. *)
  end

  module type Config = sig
    type static
    (** The static values from the database. *)

    val minValue : int
    (** The minimum possible value of the entry. *)
  end

  module Make (Config : Config) : S with type static = Config.static = struct
    type static = Config.static

    type t = {
      id : int;
      value : int;
      dependencies : dependency list;
      static : static option;
    }

    let minValue = Config.minValue

    let empty static id = { id; value = minValue; dependencies = []; static }

    let isEmpty (x : t) = x.value <= minValue && Ley_List.null x.dependencies

    let getValueDef maybeEntry =
      Ley_Option.option minValue (fun (x : t) -> x.value) maybeEntry
  end
end
