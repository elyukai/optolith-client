(** This module contains definitions and simple utility functions for the
    regions of Aventuria. *)

type resistance = Spirit | Toughness | LowerOfSpiritAndToughness

module Cause : sig
  type chance =
    | Percent of int
        (** The chance as a percent value, e.g. 25 % would be [25]. *)
    | Text of string
        (** A more complex chance, which cannot be (easily) expressed using
            atomic values and thus need to be handled manually. *)

  type t = { chance : chance; name : string }
end

type alternative_name = {
  name : string;
  region : string option;
      (** The alternative name is only known in a certain region. *)
}

type varying_parameter = { default : string; lessened : string option }

type t = {
  id : Id.Disease.t;
  name : string;
  alternative_names : alternative_name list;
  level : int;
  progress : string;
  resistance : resistance;
  incubation_time : string;
  damage : varying_parameter;
  duration : varying_parameter;
  cause : Cause.t list;
  special : string option;
  treatment : string;
  cure : string;
  src : PublicationRef.list;
  errata : Erratum.list;
}
(** The region type. *)

module Decode : sig
  val make_assoc : (Id.Disease.t, t) Parsing.make_assoc
end
