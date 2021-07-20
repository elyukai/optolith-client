module Static : sig
  type t = {
    id : Id.OptionalRule.t;
    name : string;
    description : string;
    isPrerequisite : bool;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val make_assoc : (Id.OptionalRule.t, t) Parsing.make_assoc
  end
end
