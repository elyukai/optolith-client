module Static : sig
  type t = {
    id : int;
    name : string;
    description : string;
    subject : int;
    level : int;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end
