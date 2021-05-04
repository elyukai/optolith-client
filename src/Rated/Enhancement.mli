(** Types and utility functions for enhancements. Enhancements can be registered
    on spellworks and liturgies and extend or adjust the effect of their
    associated entry. *)

type t = {
  id : int;
  name : string;
  level : int;
      (** The level of an enhancement defines the minimum skill rating at which
          it can be learned as well as it's AP value. *)
  effect : string;
  prerequisites : Prerequisite.Collection.Enhancement.t;
      (** The enhancement requires (an)other enhancement(s). *)
  src : PublicationRef.list;
  errata : Erratum.list;
}
(** The enhancement type. *)

val ap_value : IC.t -> t -> int
(** [ap_value ic enhancement] takes the enhancement as well as the improvement
    cost of it's associated entry and returns the AP value it costs if it is
    activated. *)

val minimum_rating : t -> int
(** [minimum_rating enhancement] takes the enhancement and returns the minimum
    skill rating at which it can be learned. *)

module Decode : sig
  val make_map : Locale.Order.t -> t IntMap.t Json.Decode.decoder
end
