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

  type 'static t = {
    id : int;  (** The rated entry'd identifier. *)
    value : int;  (** The current value. *)
    dependencies : dependency list;  (** The list of dependencies. *)
    static : 'static option;
        (** The corresponding static data entry for easy access. *)
  }
  (** The representation of a rated entry on a character. *)

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

  (** Create combined types and utility function for a given rated entry type.
      *)
  module Make (Config : Config) : S with type static = Config.static
end
