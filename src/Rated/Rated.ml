module Dynamic = struct
  type dependency_value = Minimum of int | Maximum of int

  type dependency = {
    source : IdGroup.ActivatableAndSkill.t;
    other_targets : int list;
    value : dependency_value;
  }

  module Activatable = struct
    type value = Inactive | Active of int

    module WithEnhancements = struct
      type enhancement = { id : int; dependencies : int list }

      module ByMagicalTradition = struct
        type 'static t = {
          id : int;
          values : int Id.MagicalTradition.Map.t;
          enhancements : enhancement IntMap.t;
          cached_ap : int;
          dependencies : dependency list;
          static : 'static option;
        }

        module type S = sig
          type static

          type nonrec t = static t

          val make :
            ?enhancements:enhancement IntMap.t ->
            ?values:int Id.MagicalTradition.Map.t ->
            static:static option ->
            id:int ->
            t

          val update_value : (int -> int) -> Id.MagicalTradition.t -> t -> t

          val update_enhancements :
            (enhancement IntMap.t -> enhancement IntMap.t) -> t -> t

          val insert_value : ?value:int -> Id.MagicalTradition.t -> t -> t

          val delete_value : Id.MagicalTradition.t -> t -> t

          val is_empty : t -> bool

          val value : Id.MagicalTradition.t -> t option -> int

          val is_active : t -> bool

          val is_active' : t option -> bool
        end

        module type Config = sig
          type static

          val ic : static -> IC.t

          val enhancements : static -> Enhancement.t IntMap.t
        end

        module Make (Config : Config) : S with type static = Config.static =
        struct
          type static = Config.static

          type nonrec t = static t

          let ap_total static_opt values active_enhancements =
            let open Option.Infix in
            let apply_pair (f, g) x = (f x, g x) in
            static_opt <&> apply_pair (Config.ic, Config.enhancements)
            |> function
            | None -> 0
            | Some (ic, enhancements) ->
                let values_by_tradition =
                  Id.MagicalTradition.Map.foldl'
                    (fun value acc ->
                      acc
                      + IC.ap_for_range ic ~from_value:0 ~to_value:value
                      + IC.ap_for_activatation ic)
                    0 values
                in
                let enhancements_value =
                  active_enhancements |> IntMap.keys
                  |> ListX.foldl'
                       (fun key ->
                         IntMap.lookup key enhancements
                         |> Option.option 0 (Enhancement.ap_value ic)
                         |> ( + ))
                       0
                in
                values_by_tradition + enhancements_value

          let make ?(enhancements = IntMap.empty)
              ?(values = Id.MagicalTradition.Map.empty) ~static ~id =
            {
              id;
              values;
              enhancements;
              cached_ap = ap_total static values enhancements;
              dependencies = [];
              static;
            }

          let update_value f key x =
            let map old_value = Int.max 0 (f old_value) in
            let new_values = Id.MagicalTradition.Map.adjust map key x.values in
            {
              x with
              values = new_values;
              cached_ap = ap_total x.static new_values x.enhancements;
            }

          let update_enhancements f (x : t) =
            let new_enhancements = f x.enhancements in
            {
              x with
              enhancements = new_enhancements;
              cached_ap = ap_total x.static x.values new_enhancements;
            }

          let insert_value ?(value = 0) key x =
            let new_value = Int.max 0 value in
            let new_values =
              Id.MagicalTradition.Map.insert key new_value x.values
            in
            {
              x with
              values = new_values;
              cached_ap = ap_total x.static new_values x.enhancements;
            }

          let delete_value key x =
            let new_values = Id.MagicalTradition.Map.delete key x.values in
            {
              x with
              values = new_values;
              cached_ap = ap_total x.static new_values x.enhancements;
            }

          let is_empty x =
            Id.MagicalTradition.Map.null x.values && ListX.null x.dependencies

          let value key x_opt =
            let open Option.Infix in
            x_opt
            >>= (fun { values; _ } -> Id.MagicalTradition.Map.lookup key values)
            |> Option.fromOption 0

          let is_active x = Id.MagicalTradition.Map.null x.values |> not

          let is_active' x = Option.option false is_active x
        end
      end

      type 'static t = {
        id : int;
        value : value;
        enhancements : enhancement IntMap.t;
        cached_ap : int;
        dependencies : dependency list;
        static : 'static option;
      }

      module type S = sig
        type static

        type nonrec t = static t

        val make :
          ?enhancements:enhancement IntMap.t ->
          ?value:value ->
          static:static option ->
          id:int ->
          t

        val update_value : (value -> value) -> t -> t

        val update_enhancements :
          (enhancement IntMap.t -> enhancement IntMap.t) -> t -> t

        val is_empty : t -> bool

        val value : t option -> value

        val value_to_int : value -> int

        val is_active : t -> bool

        val is_active' : t option -> bool
      end

      module type Config = sig
        type static

        val ic : static -> IC.t

        val enhancements : static -> Enhancement.t IntMap.t
      end

      module Make (Config : Config) : S with type static = Config.static =
      struct
        type static = Config.static

        type nonrec t = static t

        let ap_total static_opt value active_enhancements =
          let open Option.Infix in
          let apply_pair (f, g) x = (f x, g x) in
          let static =
            static_opt <&> apply_pair (Config.ic, Config.enhancements)
          in
          match (static, value) with
          | None, _ | Some _, Inactive -> 0
          | Some (ic, enhancements), Active value ->
              let activation_value = IC.ap_for_activatation ic in
              let increase_value =
                IC.ap_for_range ic ~from_value:0 ~to_value:value
              in
              let enhancements_value =
                active_enhancements |> IntMap.keys
                |> ListX.foldl'
                     (fun key ->
                       IntMap.lookup key enhancements
                       |> Option.option 0 (Enhancement.ap_value ic)
                       |> ( + ))
                     0
              in
              increase_value + activation_value + enhancements_value

        let make ?(enhancements = IntMap.empty) ?(value = Inactive) ~static ~id
            =
          {
            id;
            value;
            enhancements;
            cached_ap = ap_total static value enhancements;
            dependencies = [];
            static;
          }

        let update_value f (x : t) =
          let new_value =
            match f x.value with
            | Active value -> Active (Int.max 0 value)
            | Inactive -> Inactive
          in
          {
            x with
            value = new_value;
            cached_ap = ap_total x.static new_value x.enhancements;
          }

        let update_enhancements f (x : t) =
          let new_enhancements = f x.enhancements in
          {
            x with
            enhancements = new_enhancements;
            cached_ap = ap_total x.static x.value new_enhancements;
          }

        let is_empty (x : t) = x.value == Inactive && ListX.null x.dependencies

        let value x_opt = Option.option Inactive (fun (x : t) -> x.value) x_opt

        let value_to_int = function Active sr -> sr | Inactive -> 0

        let is_active (x : t) =
          match x.value with Active _ -> true | Inactive -> false

        let is_active' x = Option.option false is_active x
      end
    end

    module ByLevel = struct
      type values = Inactive | Active of int NonEmptyList.t

      type 'static t = {
        id : int;
        values : values;
        cached_ap : int;
        dependencies : dependency list;
        static : 'static option;
      }

      module type S = sig
        type static

        type nonrec t = static t

        val make : ?values:values -> static:static option -> id:int -> t

        val update_value : index:int -> (int -> int) -> t -> t

        val insert_value : ?value:int -> t -> t

        val delete_value : t -> t

        val is_empty : t -> bool

        val value : index:int -> t option -> value

        val value_to_int : value -> int

        val is_active : t -> bool

        val is_active' : t option -> bool
      end

      module type Config = sig
        type static

        val ic : static -> IC.t
      end

      module Make (Config : Config) : S with type static = Config.static =
      struct
        type static = Config.static

        type nonrec t = static t

        let ap_total static (values : values) =
          let open Option.Infix in
          match (static <&> Config.ic, values) with
          | None, _ | Some _, Inactive -> 0
          | Some ic, Active xs ->
              let for_level value =
                IC.ap_for_range ic ~from_value:0 ~to_value:value
                + IC.ap_for_activatation ic
              in
              NonEmptyList.foldl' (fun x -> x |> for_level |> ( + )) 0 xs

        let make ?(values : values = Inactive) ~static ~id =
          {
            id;
            values;
            cached_ap = ap_total static values;
            dependencies = [];
            static;
          }

        let update_value ~index f x =
          match x.values with
          | Inactive -> x
          | Active xs ->
              let for_level x = x |> f |> Int.max 0 in
              let new_values : values =
                Active (NonEmptyList.Index.modifyAt index for_level xs)
              in
              {
                x with
                values = new_values;
                cached_ap = ap_total x.static new_values;
              }

        let insert_value ?(value = 0) x =
          let new_value = Int.max 0 value in
          let new_values : values =
            match x.values with
            | Inactive -> Active (NonEmptyList.one new_value)
            | Active xs ->
                Active
                  (NonEmptyList.Index.insertAt (NonEmptyList.length xs)
                     new_value xs)
          in
          {
            x with
            values = new_values;
            cached_ap = ap_total x.static new_values;
          }

        let delete_value x =
          let new_values : values =
            match x.values with
            | Inactive -> Inactive
            | Active xs -> (
                xs
                |> NonEmptyList.take (NonEmptyList.length xs - 1)
                |> NonEmptyList.from_list
                |> function
                | None -> (Inactive : values)
                | Some xs -> Active xs )
          in
          {
            x with
            values = new_values;
            cached_ap = ap_total x.static new_values;
          }

        let is_empty x = x.values == Inactive && ListX.null x.dependencies

        let value ~index x_opt =
          Option.option
            (Inactive : value)
            (fun x ->
              match x.values with
              | Inactive -> Inactive
              | Active xs -> (
                  NonEmptyList.at index xs |> function
                  | None -> (Inactive : value)
                  | Some x -> Active x ))
            x_opt

        let value_to_int (x : value) =
          match x with Active sr -> sr | Inactive -> 0

        let is_active x =
          match x.values with Active _ -> true | Inactive -> false

        let is_active' x = Option.option false is_active x
      end
    end

    type 'static t = {
      id : int;
      value : value;
      cached_ap : int;
      dependencies : dependency list;
      static : 'static option;
    }

    module type S = sig
      type static

      type nonrec t = static t

      val make : ?value:value -> static:static option -> id:int -> t

      val update_value : (value -> value) -> t -> t

      val is_empty : t -> bool

      val value : t option -> value

      val value_to_int : value -> int

      val is_active : t -> bool

      val is_active' : t option -> bool
    end

    module type Config = sig
      type static

      val ic : static -> IC.t
    end

    module Make (Config : Config) : S with type static = Config.static = struct
      type static = Config.static

      type nonrec t = static t

      let ap_total static value =
        let open Option.Infix in
        let ic = static <&> Config.ic in
        match (ic, value) with
        | None, _ | Some _, Inactive -> 0
        | Some ic, Active value ->
            IC.ap_for_range ic ~from_value:0 ~to_value:value
            + IC.ap_for_activatation ic

      let make ?(value = Inactive) ~static ~id =
        {
          id;
          value;
          cached_ap = ap_total static value;
          dependencies = [];
          static;
        }

      let update_value f (x : t) =
        let new_value =
          match f x.value with
          | Active value -> Active (Int.max 0 value)
          | Inactive -> Inactive
        in
        { x with value = new_value; cached_ap = ap_total x.static new_value }

      let is_empty (x : t) = x.value == Inactive && ListX.null x.dependencies

      let value x_opt = Option.option Inactive (fun (x : t) -> x.value) x_opt

      let value_to_int = function Active sr -> sr | Inactive -> 0

      let is_active (x : t) =
        match x.value with Active _ -> true | Inactive -> false

      let is_active' x = Option.option false is_active x
    end
  end

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

    val ic : static -> IC.t

    val min_value : int
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

    let make ?value ~static ~id =
      let init_value = Option.option min_value (Int.max min_value) value in
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

    let value x_opt = Option.option min_value (fun (x : t) -> x.value) x_opt
  end
end

module Static = struct
  module Activatable = struct
    module MainParameter = struct
      type t = { full : string; abbr : string; isNotModifiable : bool }

      module Decode = struct
        open Json.Decode

        type translation = { full : string; abbr : string }

        let translation json =
          {
            full = json |> field "full" string;
            abbr = json |> field "abbr" string;
          }

        let make isNotModifiable ({ full; abbr } : translation) =
          { full; abbr; isNotModifiable }
      end
    end
  end
end
