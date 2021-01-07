module Static : sig
  type t = {
    id : int;
    name : string;
    types : string Ley_IntMap.t;
    domains : string Ley_IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : sig
  type domain = Predefined of int | Custom of string

  type t = {
    category : int;
    level : int;
    type_ : int;
    domain : domain;
    name : string;
  }

  val is_valid : t -> bool
  (** [is_valid pact] checks if an active pact is a valid pact configuration. *)
end
