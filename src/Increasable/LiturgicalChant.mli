module Static : sig
  type t = {
    id : int;
    name : string;
    nameShort : string option;
    check : Check.t;
    checkMod : Check.Modifier.t option;
    effect : string;
    castingTime : ActivatableSkill.MainParameter.t;
    cost : ActivatableSkill.MainParameter.t;
    range : ActivatableSkill.MainParameter.t;
    duration : ActivatableSkill.MainParameter.t;
    target : string;
    traditions : Ley_IntSet.t;
    aspects : Ley_IntSet.t;
    ic : IC.t;
    enhancements : Enhancement.t list;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : ActivatableSkill.Dynamic.S with type static = Static.t
