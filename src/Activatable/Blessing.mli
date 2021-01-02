module Static : sig
  type t = {
    id : int;
    name : string;
    effect : string;
    range : string;
    duration : string;
    target : string;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end
