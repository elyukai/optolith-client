module Dynamic: ActivatableSkill.Dynamic;

module Static: {
  type t = {
    id: int,
    name: string,
    nameShort: option(string),
    check: SkillCheck.t,
    checkMod: option(CheckModifier.t),
    effect: string,
    castingTime: ActivatableSkill.MainParameter.t,
    cost: ActivatableSkill.MainParameter.t,
    range: ActivatableSkill.MainParameter.t,
    duration: ActivatableSkill.MainParameter.t,
    target: string,
    traditions: Ley_IntSet.t,
    aspects: Ley_IntSet.t,
    ic: IC.t,
    gr: int,
    enhancements: option(Enhancements.t),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};
