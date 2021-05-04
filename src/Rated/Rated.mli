(** Utility types and functor for working with rated entries. Using this module,
    you can generate some then unified code for rated entries. *)

module Dynamic : sig
  (** A required value from a prerequisite. Can either require a minimum or a
      maximum value. *)
  type dependency_value = Minimum of int | Maximum of int

  type dependency = {
    source : IdGroup.ActivatableAndSkill.t;
        (** The source of the dependency. *)
    other_targets : int list;
        (** If the source prerequisite targets multiple entries, the other entries are listed here. *)
    value : dependency_value;  (** The required value. *)
  }
  (** Describes a dependency on a certain rated entry. *)

  type ('id, 'static) t = {
    id : 'id;  (** The rated entry's identifier. *)
    value : int;  (** The current value. *)
    cached_ap : int;  (** The accumulated AP value of all value increases. *)
    dependencies : dependency list;  (** The list of dependencies. *)
    static : 'static option;
        (** The corresponding static data entry for easy access. *)
  }
  (** The representation of a rated entry on a character. *)

  module type S = sig
    type id
    (** The identifier type. *)

    type static
    (** The static values from the database. *)

    type nonrec t = (id, static) t
    (** The dynamic values in a character with a reference to the static values
        from the database. *)

    val make : ?value:int -> static:static option -> id:id -> t
    (** [make ~value ~static ~id] creates a new dynamic entry from an id. If a
        value is provided and a static entry is present, it inserts the value
        and calculates the initial total AP cache. *)

    val update_value : (int -> int) -> t -> t
    (** [update_value f x] updates the value of the entry [x] using the function
        [f] that receives the old value as has to return the new one. It also
        updates its total AP value if a static entry is present. *)

    val is_empty : t -> bool
    (** [is_empty x] checks if the passed dynamic entry is empty. *)

    val value : t option -> int
    (** [value x] takes a dynamic entry that might not exist and returns the
        value of that entry. If the entry is not yet defined, it's value is the
        minimum value of the entry type, e.g. 8 for attributes, 0 for skills and
        6 for combat techniques. *)
  end

  module type Config = sig
    type id
    (** The identifier type. *)

    type static
    (** The static values from the database. *)

    val ic : static -> IC.t
    (** Get the improvement cost from the static entry. *)

    val min_value : int
    (** The minimum possible value of the entry. *)
  end

  (** Create combined types and utility function for a given rated entry type.
      *)
  module Make (Config : Config) :
    S with type id = Config.id and type static = Config.static

  module Activatable : sig
    (** The current value. *)
    type value =
      | Inactive  (** The entry has not been activated yet. *)
      | Active of int  (** The entry is active and has a defined rating. *)

    type ('id, 'static) t = {
      id : 'id;  (** The rated entry's identifier. *)
      value : value;  (** The current value. *)
      cached_ap : int;  (** The accumulated AP value of all value increases. *)
      dependencies : dependency list;  (** The list of dependencies. *)
      static : 'static option;
          (** The corresponding static data entry for easy access. *)
    }
    (** The representation of a activatable rated entry on a character. *)

    module type S = sig
      type id
      (** The identifier type. *)

      type static
      (** The static values from the database. *)

      type nonrec t = (id, static) t
      (** The dynamic values in a character with a reference to the static
          values from the database. *)

      val make : ?value:value -> static:static option -> id:id -> t
      (** [make ~value ~static ~id] creates a new dynamic entry from an id. If a
          value is provided and a static entry is present, it inserts the value
          and calculates the initial total AP cache. *)

      val update_value : (value -> value) -> t -> t
      (** [update_value f x] updates the value of the entry [x] using the
          function [f] that receives the old value as has to return the new one.
          It also updates its total AP value if a static entry is present. *)

      val is_empty : t -> bool
      (** [is_empty x] checks if the passed dynamic entry is empty. *)

      val value : t option -> value
      (** [value x] takes a dynamic entry that might not exist and returns the
          value of that entry. If the entry is not yet defined, it's value is
          [Inactive]. *)

      val value_to_int : value -> int
      (** Converts the entry value to an [int], where [Inactive] results in [0].
          *)

      val is_active : t -> bool
      (** Is the entry active? *)

      val is_active' : t option -> bool
      (** Is the possibly-not-yet-existing entry active? *)
    end

    module type Config = sig
      type id
      (** The identifier type. *)

      type static
      (** The static values from the database. *)

      val ic : static -> IC.t
      (** Get the improvement cost from the static entry. *)
    end

    (** Create combined types and utility function for a given rated entry type.
        *)
    module Make (Config : Config) :
      S with type id = Config.id and type static = Config.static

    module WithEnhancements : sig
      type enhancement = { id : int; dependencies : int list }

      type ('id, 'static) t = {
        id : 'id;  (** The rated entry's identifier. *)
        value : value;  (** The current value. *)
        enhancements : enhancement IntMap.t;
            (** The currently active enhancements for that entry. *)
        cached_ap : int;
            (** The accumulated AP value of all value increases. *)
        dependencies : dependency list;  (** The list of dependencies. *)
        static : 'static option;
            (** The corresponding static data entry for easy access. *)
      }
      (** The representation of a activatable rated entry on a character. *)

      module type S = sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        type nonrec t = (id, static) t
        (** The dynamic values in a character with a reference to the static
            values from the database. *)

        val make :
          ?enhancements:enhancement IntMap.t ->
          ?value:value ->
          static:static option ->
          id:id ->
          t
        (** [make ~enhancements ~value ~static ~id] creates a new dynamic entry
            from an id. If a value is provided and a static entry is present, it
            inserts the value and calculates the initial total AP cache. If
            enhancements are passed, they are included into the initial total AP
            cache calculation. *)

        val update_value : (value -> value) -> t -> t
        (** [update_value f x] updates the value of the entry [x] using the
            function [f] that receives the old value as has to return the new one.
            It also updates its total AP value if a static entry is present. *)

        val update_enhancements :
          (enhancement IntMap.t -> enhancement IntMap.t) -> t -> t
        (** [update_enhancements f x] updates the enhancements of the entry [x]
            using the function [f] that receives the old enhancements as has to
            return the new ones. It also updates its total AP value if a static
            entry is present. *)

        val is_empty : t -> bool
        (** [is_empty x] checks if the passed dynamic entry is empty. *)

        val value : t option -> value
        (** [value x] takes a dynamic entry that might not exist and returns the
            value of that entry. If the entry is not yet defined, it's value is
            [Inactive]. *)

        val value_to_int : value -> int
        (** Converts the entry value to an [int], where [Inactive] results in [0].
            *)

        val is_active : t -> bool
        (** Is the entry active? *)

        val is_active' : t option -> bool
        (** Is the possibly-not-yet-existing entry active? *)
      end

      module type Config = sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        val ic : static -> IC.t
        (** Get the improvement cost from the static entry. *)

        val enhancements : static -> Enhancement.t IntMap.t
        (** Get the enhancements from the static entry. *)
      end

      (** Create combined types and utility function for a given rated entry type.
          *)
      module Make (Config : Config) :
        S with type id = Config.id and type static = Config.static

      module ByMagicalTradition : sig
        type ('id, 'static) t = {
          id : 'id;  (** The rated entry's identifier. *)
          values : int Id.MagicalTradition.Map.t;
              (** The current value in each tradition. An entry is considered
                  active for a tradition if its key is present. *)
          enhancements : enhancement IntMap.t;
              (** The currently active enhancements for that entry. *)
          cached_ap : int;
              (** The accumulated AP value of all value increases for all
                  traditions. *)
          dependencies : dependency list;  (** The list of dependencies. *)
          static : 'static option;
              (** The corresponding static data entry for easy access. *)
        }
        (** The representation of a activatable entry with ratings for every
            traditions on a character. *)

        module type S = sig
          type id
          (** The identifier type. *)

          type static
          (** The static values from the database. *)

          type nonrec t = (id, static) t
          (** The dynamic values in a character with a reference to the static
              values from the database. *)

          val make :
            ?enhancements:enhancement IntMap.t ->
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
            (enhancement IntMap.t -> enhancement IntMap.t) -> t -> t
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

          val is_empty : t -> bool
          (** [is_empty x] checks if the passed dynamic entry is empty. *)

          val value : Id.MagicalTradition.t -> t option -> int
          (** [value key x] takes a dynamic entry that might not exist and returns
              the value of that entry for the specified tradition [key]. If the
              entry is not yet defined, it's value is [Inactive]. *)

          val is_active : t -> bool
          (** Is the entry active? *)

          val is_active' : t option -> bool
          (** Is the possibly-not-yet-existing entry active? *)
        end

        module type Config = sig
          type id
          (** The identifier type. *)

          type static
          (** The static values from the database. *)

          val ic : static -> IC.t
          (** Get the improvement cost from the static entry. *)

          val enhancements : static -> Enhancement.t IntMap.t
          (** Get the enhancements from the static entry. *)
        end

        (** Create combined types and utility function for a given rated entry
            type. *)
        module Make (Config : Config) :
          S with type id = Config.id and type static = Config.static
      end
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

      type ('id, 'static) t = {
        id : 'id;  (** The rated entry's identifier. *)
        values : values;  (** The current values for each level. *)
        cached_ap : int;
            (** The accumulated AP value of all value increases. *)
        dependencies : dependency list;  (** The list of dependencies. *)
        static : 'static option;
            (** The corresponding static data entry for easy access. *)
      }
      (** The representation of a activatable rated entry on a character. *)

      module type S = sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        type nonrec t = (id, static) t
        (** The dynamic values in a character with a reference to the static
            values from the database. *)

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

        val is_empty : t -> bool
        (** [is_empty x] checks if the passed dynamic entry is empty. *)

        val value : index:int -> t option -> value
        (** [value ~index x] takes a dynamic entry that might not exist and
            returns the value of that entry for the specified level index
            [index]. If the level is not yet defined, it's value is [Inactive].
            *)

        val value_to_int : value -> int
        (** Converts the entry value to an [int], where [Inactive] results in
            [0]. *)

        val is_active : t -> bool
        (** Is the entry active? *)

        val is_active' : t option -> bool
        (** Is the possibly-not-yet-existing entry active? *)
      end

      module type Config = sig
        type id
        (** The identifier type. *)

        type static
        (** The static values from the database. *)

        val ic : static -> IC.t
        (** Get the improvement cost from the static entry. *)
      end

      (** Create combined types and utility function for a given rated entry
          type. *)
      module Make (Config : Config) :
        S with type id = Config.id and type static = Config.static
    end
  end
end

module Static : sig
  module Activatable : sig
    (** A module for handling the main parameters of spellworks and liturgies:
        Casting/ritual/liturgical/ceremonial time, AE/KP cost, range and
        duration. *)
    module MainParameter : sig
      type t = { full : string; abbr : string; isNotModifiable : bool }
      (** A unified type to store the different values: The full parameter text,
          an abbreviated version for the character sheet and if the value is not
          modifiable. *)

      module Decode : sig
        type translation

        val translation : translation Json.Decode.decoder

        val make : bool -> translation -> t
      end
    end
  end
end
