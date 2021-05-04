module Static : sig
  type t = {
    id : Id.FocusRule.t;
    name : string;
    description : string;
    subject : int;
    level : int;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val make_assoc : (Id.FocusRule.t, t) JsonStatic.make_assoc
  end
end
