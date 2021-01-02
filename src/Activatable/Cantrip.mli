module Static : sig
  type t = {
    id : int;
    name : string;
    effect : string;
    range : string;
    duration : string;
    target : string;
    property : int;
    traditions : Ley_IntSet.t;
    prerequisites : Prerequisite.Collection.Activatable.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end
