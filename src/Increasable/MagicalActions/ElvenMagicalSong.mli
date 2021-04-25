module Static : sig
  type t = {
    id : int;
    name : string;
    check : Check.t;
    checkMod : Check.Modifier.t option;
    effect : string;
    cost : ActivatableSkill.MainParameter.t;
    skill : int NonEmptyList.t;
    property : int;
    ic : IC.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : ActivatableSkill.Dynamic.S with type static = Static.t