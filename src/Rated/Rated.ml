module Dynamic = struct
  type dependency_value = Minimum of int | Maximum of int

  type dependency = {
    source : IdGroup.ActivatableAndSkill.t;
    other_targets : int list;
    value : dependency_value;
  }

  type 'static t = {
    id : int;
    value : int;
    cached_ap : int;
    dependencies : dependency list;
    static : 'static option;
  }

  module type S = sig
    type static

    type nonrec t = static t

    val make : ?value:int -> static:static option -> id:int -> t

    val update_value : (int -> int) -> t -> t

    val is_empty : t -> bool

    val value : t option -> int
  end

  module type Config = sig
    type static
    (** The static values from the database. *)

    val ic : static -> IC.t
    (** Get the improvement cost from the static entry. *)

    val min_value : int
    (** The minimum possible value of the entry. *)
  end

  module Make (Config : Config) : S with type static = Config.static = struct
    type static = Config.static

    type nonrec t = static t

    let min_value = Config.min_value

    let ap_total static value =
      let open Option.Infix in
      static <&> Config.ic
      <&> IC.ap_for_range ~from_value:min_value ~to_value:value
      |> Option.fromOption 0

    let make ?(value = min_value) ~static ~id =
      let init_value = Int.max min_value value in
      {
        id;
        value = init_value;
        cached_ap = ap_total static init_value;
        dependencies = [];
        static;
      }

    let update_value f (x : t) =
      let new_value = Int.max min_value (f x.value) in
      { x with value = new_value; cached_ap = ap_total x.static new_value }

    let is_empty (x : t) = x.value <= min_value && ListX.null x.dependencies

    let value maybeEntry =
      Option.option min_value (fun (x : t) -> x.value) maybeEntry
  end
end
