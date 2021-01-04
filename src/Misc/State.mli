module Static : sig
  type t = {
    id : int;
    name : string;
    description : string option;
    isPrerequisite : bool;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : sig
  type dependency = { source : Id.Activatable.t }

  type t = {
    id : int;
    dependencies : dependency list;
    static : Static.t option;
  }
end
