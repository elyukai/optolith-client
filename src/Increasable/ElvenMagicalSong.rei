module Dynamic: ActivatableSkill.Dynamic;

module Static: {
  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    checkMod: option(CheckModifier.t),
    effect: string,
    cost: ActivatableSkill.MainParameter.t,
    skill: OneOrMany.t(int),
    property: int,
    ic: IC.t,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};
