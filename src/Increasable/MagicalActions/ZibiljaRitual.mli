module Dynamic: ActivatableSkill.Dynamic;

module Static: {
  type t = {
    id: int,
    name: string,
    check: Check.t,
    checkMod: option(Check.Modifier.t),
    effect: string,
    castingTime: ActivatableSkill.MainParameter.t,
    cost: ActivatableSkill.MainParameter.t,
    range: ActivatableSkill.MainParameter.t,
    duration: ActivatableSkill.MainParameter.t,
    target: string,
    property: int,
    ic: IC.t,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Json_Decode_Static.decodeAssoc(t);};
};
