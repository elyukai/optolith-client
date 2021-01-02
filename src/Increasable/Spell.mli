module Static : sig
  type t = {
    id : int;
    name : string;
    check : Check.t;
    checkMod : Check.Modifier.t option;
    effect : string;
    castingTime : ActivatableSkill.MainParameter.t;
    cost : ActivatableSkill.MainParameter.t;
    range : ActivatableSkill.MainParameter.t;
    duration : ActivatableSkill.MainParameter.t;
    target : string;
    property : int;
    traditions : Ley_IntSet.t;
    ic : IC.t;
    prerequisites : Prerequisite.Collection.Increasable.t;
    enhancements : Enhancement.t list;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : ActivatableSkill.Dynamic.S with type static = Static.t
