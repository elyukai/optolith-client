module Dynamic = struct
  module ValueRestriction = struct
    type t = Minimum of int | Maximum of int
  end

  module Dependency = struct
    type t = {
      source : IdGroup.ActivatableAndSkill.t;
      other_targets : IdGroup.ActivatableAndSkill.t list;
      value : ValueRestriction.t;
    }
  end

  module Activatable = struct
    module Value = struct
      type t = Inactive | Active of int

      let min = 0

      let to_int = function Active sr -> sr | Inactive -> min

      let is_active = function Active _ -> true | Inactive -> false

      let ensure_valid = function
        | Active value -> Active (Int.max min value)
        | Inactive -> Inactive
    end

    module Main = struct
      let ap_total ic value =
        IC.ap_for_range ic ~from_value:Value.min ~to_value:value
        + IC.ap_for_activation ic
    end

    module Enhancements = struct
      let ap_total enhancements ic active_enhancements =
        active_enhancements |> IntMap.keys
        |> ListX.sum' (fun key ->
               IntMap.lookup key enhancements
               |> Option.fold ~none:0 ~some:(Enhancement.Static.ap_value ic))
    end

    module ByMagicalTradition = struct
      module type S = sig
        type id

        type static

        type t = {
          id : id;
          values : int Id.MagicalTradition.Map.t;
          enhancements : Enhancement.Dynamic.t IntMap.t;
          cached_ap : int;
          dependencies : Dependency.t list;
          static : static option;
        }

        val make :
          ?enhancements:Enhancement.Dynamic.t IntMap.t ->
          ?values:int Id.MagicalTradition.Map.t ->
          static:static option ->
          id:id ->
          t

        val update_value : (int -> int) -> Id.MagicalTradition.t -> t -> t

        val update_enhancements :
          (Enhancement.Dynamic.t IntMap.t -> Enhancement.Dynamic.t IntMap.t) ->
          t ->
          t

        val insert_value : ?value:int -> Id.MagicalTradition.t -> t -> t

        val delete_value : Id.MagicalTradition.t -> t -> t

        val value_of_option : Id.MagicalTradition.t -> t option -> int

        val is_active : t -> bool
      end

      module Make (Config : sig
        type id

        type static

        val ic : static -> IC.t

        val enhancements : static -> Enhancement.Static.t IntMap.t
      end) : S with type id = Config.id and type static = Config.static = struct
        include Config

        type t = {
          id : id;
          values : int Id.MagicalTradition.Map.t;
          enhancements : Enhancement.Dynamic.t IntMap.t;
          cached_ap : int;
          dependencies : Dependency.t list;
          static : static option;
        }

        let ap_total static_opt values active_enhancements =
          match static_opt with
          | None -> 0
          | Some static ->
              let total_of_by_tradition =
                Id.MagicalTradition.Map.sum' (Main.ap_total (ic static)) values
              in
              let total_of_enhancements =
                Enhancements.ap_total (enhancements static) (ic static)
                  active_enhancements
              in
              total_of_by_tradition + total_of_enhancements

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
          let new_values =
            Id.MagicalTradition.Map.adjust
              (fun old_value -> Int.max 0 (f old_value))
              key x.values
          in
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
          let new_values =
            Id.MagicalTradition.Map.insert key (Int.max 0 value) x.values
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

        let value_of_option key x_opt =
          let open Option.Infix in
          x_opt
          >>= (fun { values; _ } -> Id.MagicalTradition.Map.lookup key values)
          |> Option.value ~default:0

        let is_active x = Id.MagicalTradition.Map.null x.values |> not
      end
    end

    module WithEnhancements = struct
      module type S = sig
        type id

        type static

        type t = {
          id : id;
          value : Value.t;
          enhancements : Enhancement.Dynamic.t IntMap.t;
          cached_ap : int;
          dependencies : Dependency.t list;
          static : static option;
        }

        val make :
          ?enhancements:Enhancement.Dynamic.t IntMap.t ->
          ?value:Value.t ->
          static:static option ->
          id:id ->
          t

        val update_value : (Value.t -> Value.t) -> t -> t

        val update_enhancements :
          (Enhancement.Dynamic.t IntMap.t -> Enhancement.Dynamic.t IntMap.t) ->
          t ->
          t

        val value_of_option : t option -> Value.t
      end

      module Make (Config : sig
        type id

        type static

        val ic : static -> IC.t

        val enhancements : static -> Enhancement.Static.t IntMap.t
      end) : S with type id = Config.id and type static = Config.static = struct
        include Config
        open Value

        type t = {
          id : id;
          value : Value.t;
          enhancements : Enhancement.Dynamic.t IntMap.t;
          cached_ap : int;
          dependencies : Dependency.t list;
          static : static option;
        }

        let ap_total static_opt value active_enhancements =
          match (static_opt, value) with
          | None, _ | Some _, Inactive -> 0
          | Some static, Active value ->
              let total_of_rated = Main.ap_total (ic static) value in
              let total_of_enhancements =
                Enhancements.ap_total (enhancements static) (ic static)
                  active_enhancements
              in
              total_of_rated + total_of_enhancements

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
          let new_value = ensure_valid (f x.value) in
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

        let value_of_option = function Some x -> x.value | None -> Inactive
      end
    end

    module ByLevel = struct
      type values = Inactive | Active of int NonEmptyList.t

      module type S = sig
        type id

        type static

        type t = {
          id : id;
          values : values;
          cached_ap : int;
          dependencies : Dependency.t list;
          static : static option;
        }

        val make : ?values:values -> static:static option -> id:id -> t

        val update_value : index:int -> (int -> int) -> t -> t

        val insert_value : ?value:int -> t -> t

        val delete_value : t -> t

        val value_of_option : index:int -> t option -> Value.t

        val is_active : t -> bool
      end

      module Make (Config : sig
        type id

        type static

        val ic : static -> IC.t
      end) : S with type id = Config.id and type static = Config.static = struct
        include Config

        type t = {
          id : id;
          values : values;
          cached_ap : int;
          dependencies : Dependency.t list;
          static : static option;
        }

        let ap_total static values =
          match (static, values) with
          | None, _ | Some _, Inactive -> 0
          | Some static, Active xs ->
              NonEmptyList.sum' (Main.ap_total (ic static)) xs

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
              let for_level x = Int.max 0 (f x) in
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
                |> function None -> (Inactive : values) | Some xs -> Active xs)
          in
          {
            x with
            values = new_values;
            cached_ap = ap_total x.static new_values;
          }

        let value_of_option ~index = function
          | Some { values = Active xs; _ } -> (
              NonEmptyList.at index xs
              |> function None -> Value.Inactive | Some x -> Value.Active x)
          | None | Some { values = Inactive; _ } -> Value.Inactive

        let is_active x =
          match x.values with Active _ -> true | Inactive -> false
      end
    end

    module DeriveSecondary = struct
      module type S = sig
        type id

        type static

        type static'

        type t = {
          id : id;
          value : Value.t;
          cached_ap : int;
          dependencies : Dependency.t list;
          static : static option;
        }

        val make :
          ?value:Value.t ->
          static':static' option ->
          static:static option ->
          id:id ->
          t

        val update_value :
          (Value.t -> Value.t) -> static':static' option -> t -> t

        val value_of_option : t option -> Value.t
      end

      module Make (Config : sig
        type id

        type static

        type static'

        val ic : static' -> static -> IC.t option
      end) :
        S
          with type id = Config.id
           and type static = Config.static
           and type static' = Config.static' = struct
        include Config
        open Value

        let min_value = 0

        type t = {
          id : id;
          value : Value.t;
          cached_ap : int;
          dependencies : Dependency.t list;
          static : static option;
        }

        let ap_total static' static value =
          let ic = Option.liftM2 ic static' static |> Option.join in
          match (ic, value) with
          | Some ic, Active value -> Main.ap_total ic value
          | None, _ | Some _, Inactive -> 0

        let ensure_valid_value = function
          | Active value -> Active (Int.max min_value value)
          | Inactive -> Inactive

        let make ?(value = Inactive) ~static' ~static ~id =
          let init_value = ensure_valid_value value in
          {
            id;
            value = init_value;
            cached_ap = ap_total static' static init_value;
            dependencies = [];
            static;
          }

        let update_value f ~static' (x : t) =
          let new_value =
            match f x.value with
            | Active value -> Active (Int.max 0 value)
            | Inactive -> Inactive
          in
          {
            x with
            value = new_value;
            cached_ap = ap_total static' x.static new_value;
          }

        let value_of_option = function Some x -> x.value | None -> Inactive
      end
    end

    module type S = sig
      type id

      type static

      type t = {
        id : id;
        value : Value.t;
        cached_ap : int;
        dependencies : Dependency.t list;
        static : static option;
      }

      val make : ?value:Value.t -> static:static option -> id:id -> t

      val update_value : (Value.t -> Value.t) -> t -> t

      val value_of_option : t option -> Value.t
    end

    module Make (Config : sig
      type id

      type static

      val ic : static -> IC.t
    end) : S with type id = Config.id and type static = Config.static = struct
      include Config
      open Value

      type t = {
        id : id;
        value : Value.t;
        cached_ap : int;
        dependencies : Dependency.t list;
        static : static option;
      }

      let ap_total static value =
        match (static, value) with
        | Some static, Active value -> Main.ap_total (ic static) value
        | None, _ | Some _, Inactive -> 0

      let make ?(value = Inactive) ~static ~id =
        let init_value = ensure_valid value in
        {
          id;
          value = init_value;
          cached_ap = ap_total static init_value;
          dependencies = [];
          static;
        }

      let update_value f x =
        let new_value = ensure_valid (f x.value) in
        { x with value = new_value; cached_ap = ap_total x.static new_value }

      let value_of_option = function Some x -> x.value | None -> Inactive
    end
  end

  module type S = sig
    type id

    type static

    type t = {
      id : id;
      value : int;
      cached_ap : int;
      dependencies : Dependency.t list;
      static : static option;
    }

    val make : ?value:int -> static:static option -> id:id -> t

    val update_value : (int -> int) -> t -> t

    val value_of_option : t option -> int
  end

  module Make (C : sig
    type id

    type static

    val ic : static -> IC.t

    val min_value : int
  end) : S with type id = C.id and type static = C.static = struct
    include C

    type t = {
      id : id;
      value : int;
      cached_ap : int;
      dependencies : Dependency.t list;
      static : static option;
    }

    let ap_total static value =
      match static with
      | Some static ->
          static |> ic |> IC.ap_for_range ~from_value:min_value ~to_value:value
      | None -> 0

    let make ?value ~static ~id =
      let init_value =
        Option.fold ~none:min_value ~some:(Int.max min_value) value
      in
      {
        id;
        value = init_value;
        cached_ap = ap_total static init_value;
        dependencies = [];
        static;
      }

    let update_value f x =
      let new_value = Int.max min_value (f x.value) in
      { x with value = new_value; cached_ap = ap_total x.static new_value }

    let value_of_option = function Some x -> x.value | None -> min_value
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
