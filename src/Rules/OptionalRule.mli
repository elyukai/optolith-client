module Static : sig
  type t = {
    id : int;
    name : string;
    description : string;
    isPrerequisite : bool;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val make_assoc : t JsonStatic.make_assoc
  end
end
