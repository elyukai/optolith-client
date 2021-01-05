module Dynamic = struct
  type value = Inactive | Active of int

  type 'static t = {
    id : int;
    value : value;
    dependencies : Increasable.Dynamic.dependency list;
    static : 'static option;
  }

  let empty static id = { id; value = Inactive; dependencies = []; static }

  let is_empty x = x.value == Inactive && Ley_List.null x.dependencies

  let get_value_def x = Ley_Option.option Inactive (fun x -> x.value) x

  let value_to_int = function Active sr -> sr | Inactive -> 0

  let is_active x = match x.value with Active _ -> true | Inactive -> false

  let is_active' x = Ley_Option.option false is_active x

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

    val get_value_def : t option -> value
    (** [get_value_def maybe] takes a dynamic entry that might not exist and
        returns the value of that entry. If the entry is not yet defined, it's
        value is the minimum value of the entry type, e.g. 8 for attributes, 0
        for skills and 6 for combat techniques. *)

    val value_to_int : value -> int

    val is_active : t -> bool

    val is_active' : t option -> bool
  end

  module type Config = sig
    type static
    (** The static values from the database. *)
  end

  module Make (Config : Config) : S with type static = Config.static = struct
    type static = Config.static

    type nonrec t = static t

    let empty = empty

    let is_empty = is_empty

    let get_value_def = get_value_def

    let value_to_int = value_to_int

    let is_active = is_active

    let is_active' = is_active'
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
