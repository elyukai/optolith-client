module Dynamic = struct
  type dependency_value = Minimum of int | Maximum of int

  type dependency = {
    source : Id.ActivatableAndSkill.t;
    other_targets : int list;
    value : dependency_value;
  }

  type 'static t = {
    id : int;
    value : int;
    dependencies : dependency list;
    static : 'static option;
  }

  module type S = sig
    type static

    type nonrec t = static t

    val empty : static option -> int -> t

    val is_empty : t -> bool

    val value : t option -> int
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

    let is_empty (x : t) = x.value <= min_value && ListX.null x.dependencies

    let value maybeEntry =
      Option.option min_value (fun (x : t) -> x.value) maybeEntry
  end
end
