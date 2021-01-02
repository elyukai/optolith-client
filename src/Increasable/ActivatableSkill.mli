module Dynamic : sig
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
        value is [Inactive]. *)

    val valueToInt : value -> int
    (** Converts the entry value to an [int], where [Inactive] results in [0]. *)

    val isActive : t -> bool
    (** Is the entry active? *)

    val isActiveM : t option -> bool
    (** Is the possible not yet existing entry active? *)
  end

  module type Config = sig
    type static
    (** The static values from the database. *)
  end

  module Make (Config : Config) : S with type static = Config.static
end

(** A module for handling the main parameters of spells and liturgical chants:
    Casting/ritual/liturgical/ceremonial time, AE/KP cost, range and duration. *)
module MainParameter : sig
  type t = { full : string; abbr : string; isNotModifiable : bool }
  (** A unified type to store the different values: The full parameter text, an
      abbreviated version for the character sheet and if the value is not
      modifiable. *)

  type translation

  val decode : translation Json.Decode.decoder

  val make : bool -> translation -> t
end
