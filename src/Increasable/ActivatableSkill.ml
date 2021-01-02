module Dynamic = struct
  module type S = sig
    type static
    (** The static values from the database. *)

    type value = Inactive | Active of int

    type t = {
      id : int;
      value : value;
      dependencies : Increasable.Dynamic.dependency list;
      static : static option;
    }
    (** The dynamic values in a character with a reference to the static values
        from the database. *)

    val empty : static option -> int -> t
    (** [empty id] creates a new dynamic entry from an id. *)

    val isEmpty : t -> bool
    (** [isEmpty x] checks if the passed dynamic entry is empty. *)

    val getValueDef : t option -> value
    (** [getValueDef maybe] takes a dynamic entry that might not exist and
        returns the value of that entry. If the entry is not yet defined, it's
        value is the minimum value of the entry type, e.g. 8 for attributes, 0
        for skills and 6 for combat techniques. *)

    val valueToInt : value -> int

    val isActive : t -> bool

    val isActiveM : t option -> bool
  end

  module type Config = sig
    type static
    (** The static values from the database. *)
  end

  module Make (Config : Config) : S with type static = Config.static = struct
    type static = Config.static

    type value = Inactive | Active of int

    type t = {
      id : int;
      value : value;
      dependencies : Increasable.Dynamic.dependency list;
      static : static option;
    }

    let empty static id = { id; value = Inactive; dependencies = []; static }

    let isEmpty x = x.value == Inactive && Ley_List.null x.dependencies

    let getValueDef = Ley_Option.option Inactive (fun x -> x.value)

    let valueToInt = function Active sr -> sr | Inactive -> 0

    let isActive x = match x.value with Active _ -> true | Inactive -> false

    let isActiveM = Ley_Option.option false isActive
  end
end

module MainParameter = struct
  type t = { full : string; abbr : string; isNotModifiable : bool }

  type translation = { full : string; abbr : string }

  let decode json =
    Json.Decode.
      { full = json |> field "full" string; abbr = json |> field "abbr" string }

  let make isNotModifiable ({ full; abbr } : translation) =
    { full; abbr; isNotModifiable }
end
