module Dynamic: ActivatableSkill.Dynamic;

module Static: {
  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    effect: string,
    duration: ActivatableSkill.MainParameter.t,
    cost: ActivatableSkill.MainParameter.t,
    skill: OneOrMany.t(int),
    musicTraditions: Ley_IntMap.t(string),
    property: int,
    ic: IC.t,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};
