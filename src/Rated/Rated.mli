(** Utility types and functor for working with rated entries. Using this module,
    you can generate some then unified code for rated entries.

    Since rated entries may have different or extended functionality, there are
    multiple combinations of [S] module type and [Make] functors available,
    depending on the use case. *)

module Dynamic : sig
  module ValueRestriction : sig
    (** A required value from a prerequisite. Can either require a minimum or a
        maximum value. *)
    type t = Minimum of int | Maximum of int
  end

  module Dependency : sig
    type t = {
      source : IdGroup.ActivatableAndSkill.t;
          (** The source of the dependency. *)
      other_targets : IdGroup.ActivatableAndSkill.t list;
          (** If the source prerequisite targets multiple entries, the other entries are listed
              here. *)
      value : ValueRestriction.t;  (** The required value. *)
    }
    (** Describes a dependency on a certain rated entry. *)
  end

  module type S = sig
    type id
    (** The identifier type. *)

    type static
    (** The static values from the database. *)

    type t = {
      id : id;  (** The rated entry's identifier. *)
      value : int;  (** The current value. *)
      cached_ap : int;  (** The accumulated AP value of all value increases. *)
      dependencies : Dependency.t list;  (** The list of dependencies. *)
      static : static option;
          (** The corresponding static data entry for easy access. *)
    }
    (** The representation of a rated entry on a character: The dynamic values
        with a reference to the static values from the database. *)

    val make : ?value:int -> static:static option -> id:id -> t
    (** [make ~value ~static ~id] creates a new dynamic entry from an id. If a
        value is provided and a static entry is present, it inserts the value
        and calculates the initial total AP cache. *)

    val update_value : (int -> int) -> t -> t
    (** [update_value f x] updates the value of the entry [x] using the function
        [f] that receives the old value as has to return the new one. It also
        updates its total AP value if a static entry is present. *)

    val value_of_option : t option -> int
    (** [value_of_option x] takes a dynamic entry that might not exist and
        returns the value of that entry. If the entry is not yet defined, it's
        value is the minimum value of the entry type, e.g. 8 for attributes, 0
        for skills and 6 for combat techniques. *)
  end

  (** Create combined types and utility function for a given rated entry type.
      *)
  module Make (C : sig
    type id
    (** The identifier type. *)

    type static
    (** The static values from the database. *)

    val ic : static -> ImprovementCost.t
    (** Get the improvement cost from the static entry. *)

    val min_value : int
    (** The minimum possible value of the entry. *)
  end) : S with type id = C.id and type static = C.static

  module Activatable : sig
    module Value : sig
      (** The current value. *)
      type t =
        | Inactive  (** The entry has not been activated yet. *)
        | Active of int  (** The entry is active and has a defined rating. *)

      val to_int : t -> int
      (** Converts the entry value to an [int], where [Inactive] results in [0].
          *)

      val is_active : t -> bool
      (** Does the value represent an active state? *)
    end

    module type S = sig
      type id
      (** The identifier type. *)

      type static
      (** The static values from the database. *)

      type t = {
        id : id;  (** The rated entry's identifier. *)
        value : Value.t;  (** The current value. *)
        cached_ap : int;
            (** The accumulated AP value of all value increases. *)
        dependencies : Dependency.t list;  (** The list of dependencies. *)
        static : static option;
            (** The corresponding static data entry for easy access. *)
      }
      (** The representation of a activatable rated entry on a character: The
          dynamic values with a reference to the static values from the
          database. *)

      val make : ?value:Value.t -> static:static option -> id:id -> t
      (** [make ~value ~static ~id] creates a new dynamic entry from an id. If a
          value is provided and a static entry is present, it inserts the value
          and calculates the initial total AP cache. *)

      val update_value : (Value.t -> Value.t) -> t -> t
      (** [update_value f x] updates the value of the entry [x] using the
          function [f] that receives the old value as has to return the new one.
          It also updates its total AP value if a static entry is present. *)

      val value_of_option : t option -> Value.t
      (** [value_of_option x] takes a dynamic entry that might not exist and
          returns the value of that entry. If the entry is not yet defined, it's
          value is [Inactive]. *)
    end

    (** Create combined types and utility function for a given rated entry type.
        *)
    module Make (Config : sig
      type id
      (** The identifier type. *)

      type static
      (** The static values from the database. *)

      val ic : static -> ImprovementCost.t
      (** Get the improvement cost from the static entry. *)
    end) : S with type id = Config.id and type static = Config.static

    module WithEnhancements : sig
      module type S = sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        type t = {
          id : id;  (** The rated entry's identifier. *)
          value : Value.t;  (** The current value. *)
          enhancements : Enhancement.Dynamic.t IntMap.t;
              (** The currently active enhancements for that entry. *)
          cached_ap : int;
              (** The accumulated AP value of all value increases. *)
          dependencies : Dependency.t list;  (** The list of dependencies. *)
          static : static option;
              (** The corresponding static data entry for easy access. *)
        }
        (** The representation of a activatable rated entry on a character: The
            dynamic values with a reference to the static values from the
            database. *)

        val make :
          ?enhancements:Enhancement.Dynamic.t IntMap.t ->
          ?value:Value.t ->
          static:static option ->
          id:id ->
          t
        (** [make ~enhancements ~value ~static ~id] creates a new dynamic entry
            from an id. If a value is provided and a static entry is present, it
            inserts the value and calculates the initial total AP cache. If
            enhancements are passed, they are included into the initial total AP
            cache calculation. *)

        val update_value : (Value.t -> Value.t) -> t -> t
        (** [update_value f x] updates the value of the entry [x] using the
            function [f] that receives the old value as has to return the new one.
            It also updates its total AP value if a static entry is present. *)

        val update_enhancements :
          (Enhancement.Dynamic.t IntMap.t -> Enhancement.Dynamic.t IntMap.t) ->
          t ->
          t
        (** [update_enhancements f x] updates the enhancements of the entry [x]
            using the function [f] that receives the old enhancements as has to
            return the new ones. It also updates its total AP value if a static
            entry is present. *)

        val value_of_option : t option -> Value.t
        (** [value_of_option x] takes a dynamic entry that might not exist and
            returns the value of that entry. If the entry is not yet defined,
            it's value is [Inactive]. *)
      end

      (** Create combined types and utility function for a given rated entry
          type. *)
      module Make (Config : sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        val ic : static -> ImprovementCost.t
        (** Get the improvement cost from the static entry. *)

        val enhancements : static -> Enhancement.Static.t IntMap.t
        (** Get the enhancements from the static entry. *)
      end) : S with type id = Config.id and type static = Config.static
    end

    module ByMagicalTradition : sig
      module type S = sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        type t = {
          id : id;  (** The rated entry's identifier. *)
          values : int Id.MagicalTradition.Map.t;
              (** The current value in each tradition. An entry is considered
                  active for a tradition if its key is present. *)
          enhancements : Enhancement.Dynamic.t IntMap.t;
              (** The currently active enhancements for that entry. *)
          cached_ap : int;
              (** The accumulated AP value of all value increases for all
                  traditions. *)
          dependencies : Dependency.t list;  (** The list of dependencies. *)
          static : static option;
              (** The corresponding static data entry for easy access. *)
        }
        (** The representation of a activatable entry with ratings for every
            tradition on a character: The dynamic values with a reference to the
            static values from the database. *)

        val make :
          ?enhancements:Enhancement.Dynamic.t IntMap.t ->
          ?values:int Id.MagicalTradition.Map.t ->
          static:static option ->
          id:id ->
          t
        (** [make ~enhancements ~values ~static ~id] creates a new dynamic
            entry from an id. If one or multiple values are provided and a
            static entry is present, it inserts the value and calculates the
            initial total AP cache. If enhancements are passed, they are
            included into the initial total AP cache calculation. *)

        val update_value : (int -> int) -> Id.MagicalTradition.t -> t -> t
        (** [update_value f key x] updates the value of the entry [x] for the
            specified tradition [key] using the function [f] that receives the
            old value as has to return the new one. It also updates its total AP
            value if a static entry is present. *)

        val update_enhancements :
          (Enhancement.Dynamic.t IntMap.t -> Enhancement.Dynamic.t IntMap.t) ->
          t ->
          t
        (** [update_enhancements f x] updates the enhancements of the entry
            [x] using the function [f] that receives the old enhancements as
            has to return the new ones. It also updates its total AP value if
            a static entry is present. *)

        val insert_value : ?value:int -> Id.MagicalTradition.t -> t -> t
        (** [insert_value ?value key x] sets the value of the entry [x] for the
            specified tradition [key] to [value]. If [value] is [None], the
            value defaults to [0]. It also updates its total AP value if a
            static entry is present. *)

        val delete_value : Id.MagicalTradition.t -> t -> t
        (** [delete_value key x] removes the value of the entry [x] for the
            specified tradition [key]. It also updates its total AP value if a
            static entry is present. *)

        val value_of_option : Id.MagicalTradition.t -> t option -> int
        (** [value_of_option key x] takes a dynamic entry that might not exist
            and returns the value of that entry for the specified tradition
            [key]. If the entry is not yet defined, it's value is [Inactive]. *)

        val is_active : t -> bool
        (** Is the entry active? *)
      end

      (** Create combined types and utility function for a given rated entry
              type. *)
      module Make (Config : sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        val ic : static -> ImprovementCost.t
        (** Get the improvement cost from the static entry. *)

        val enhancements : static -> Enhancement.Static.t IntMap.t
        (** Get the enhancements from the static entry. *)
      end) : S with type id = Config.id and type static = Config.static
    end

    module ByLevel : sig
      (** The current values for each level. *)
      type values =
        | Inactive  (** The entry has not been activated yet. *)
        | Active of int NonEmptyList.t
            (** The entry is active and has at least one active rating. The
                   level equals the index of a value - 1. A list is used because a
                   higher level always requires the previous level on a certain
                   rating. *)

      module type S = sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        type t = {
          id : id;  (** The rated entry's identifier. *)
          values : values;  (** The current values for each level. *)
          cached_ap : int;
              (** The accumulated AP value of all value increases. *)
          dependencies : Dependency.t list;  (** The list of dependencies. *)
          static : static option;
              (** The corresponding static data entry for easy access. *)
        }
        (** The representation of a activatable rated entry on a character: The
            dynamic values with a reference to the static values from the
            database. *)

        val make : ?values:values -> static:static option -> id:id -> t
        (** [make ~values ~static ~id] creates a new dynamic entry from an id.
            If one or multiple values are provided and a static entry is
            present, it inserts the value and calculates the initial total AP
            cache. *)

        val update_value : index:int -> (int -> int) -> t -> t
        (** [update_value ~index f x] updates the value of the entry [x] for the
            specified level index [index] using the function [f] that receives
            the old value as has to return the new one. It also updates its
            total AP value if a static entry is present. *)

        val insert_value : ?value:int -> t -> t
        (** [insert_value ?value x] sets the value of the entry [x] for the
            level one higher than the current highest level to [value]. If
            [value] is [None], the value defaults to [0]. It also updates its
            total AP value if a static entry is present. *)

        val delete_value : t -> t
        (** [delete_value key x] removes the value of the entry [x] for the
            highest active level. It also updates its total AP value if a static
            entry is present. *)

        val value_of_option : index:int -> t option -> Value.t
        (** [value_of_option ~index x] takes a dynamic entry that might not
            exist and returns the value of that entry for the specified level
            index [index]. If the level is not yet defined, it's value is
            [Inactive]. *)

        val is_active : t -> bool
        (** Is the entry active? *)
      end

      (** Create combined types and utility function for a given rated entry
             type. *)
      module Make (Config : sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        val ic : static -> ImprovementCost.t
        (** Get the improvement cost from the static entry. *)
      end) : S with type id = Config.id and type static = Config.static
    end

    (** Almost identical to the basic [!Rated.Dynamic.Activatable] module except
           that a secondary static entry can be used for AP calculation. This is
           used if the primary static entry cannot always define a fixed
           improvement cost for each entry. *)
    module DeriveSecondary : sig
      module type S = sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        type static'
        (** The secondary static entry from the database that is used if the
               primary static entry cannot provide explicit improvement costs. *)

        type t = {
          id : id;  (** The rated entry's identifier. *)
          value : Value.t;  (** The current value. *)
          cached_ap : int;
              (** The accumulated AP value of all value increases. *)
          dependencies : Dependency.t list;  (** The list of dependencies. *)
          static : static option;
              (** The corresponding static data entry for easy access. *)
        }
        (** The representation of a activatable rated entry on a character: The
            dynamic values with a reference to the static values from the
            database. *)

        val make :
          ?value:Value.t ->
          static':static' option ->
          static:static option ->
          id:id ->
          t
        (** [make ~value ~static' ~static ~id] creates a new dynamic entry from
            an id. If a value is provided and a static entry and a secondary
            static entry are present, it inserts the value and calculates the
            initial total AP cache. *)

        val update_value :
          (Value.t -> Value.t) -> static':static' option -> t -> t
        (** [update_value f ~static' x] updates the value of the entry [x] using
            the function [f] that receives the old value as has to return the
            new one. It also updates its total AP value if a static entry and a
            secondary entry [static'] are present. *)

        val value_of_option : t option -> Value.t
        (** [value_of_option x] takes a dynamic entry that might not exist and
            returns the value of that entry. If the entry is not yet defined,
            it's value is [Inactive]. *)
      end

      (** Create combined types and utility function for a given rated entry
          type. *)
      module Make (Config : sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        type static'
        (** The secondary static entry from the database that is used if the
            primary static entry cannot provide explicit improvement costs. *)

        val ic : static' -> static -> ImprovementCost.t option
        (** Get the improvement cost from the static entry or the secondary
            static entry. *)
      end) :
        S
          with type id = Config.id
           and type static = Config.static
           and type static' = Config.static'
    end
  end
end

module Static : sig
  module Activatable : sig
    (** A module for handling the main parameters of spellworks and liturgies:
        Casting/ritual/liturgical/ceremonial time, AE/KP cost, range and
        duration. *)
    module MainParameter : sig
      type t = { full : string; abbr : string; is_modifiable : bool }
      (** A unified type to store the different values: The full parameter text,
          an abbreviated version for the character sheet and if the value is not
          modifiable. *)

      module Decode : sig
        type translation

        val translation : translation Decoders_bs.Decode.decoder

        val make : bool -> translation -> t
      end
    end

    module EffectByQualityLevel : sig
      type t =
        | PerOne of {
            ql1 : string;
            ql2 : string;
            ql3 : string;
            ql4 : string;
            ql5 : string;
            ql6 : string;
          }
        | PerTwo of { ql1 : string; ql3 : string; ql5 : string }

      module Decode : sig
        val t : t Decoders_bs.Decode.decoder
      end
    end
  end
end
