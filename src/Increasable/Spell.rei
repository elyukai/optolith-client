module Dynamic: ActivatableSkill.Dynamic;

module Static: {
  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    checkMod: option(CheckModifier.t),
    effect: string,
    castingTime: ActivatableSkill.MainParameter.t,
    cost: ActivatableSkill.MainParameter.t,
    range: ActivatableSkill.MainParameter.t,
    duration: ActivatableSkill.MainParameter.t,
    target: string,
    property: int,
    traditions: Ley_IntSet.t,
    ic: IC.t,
    increasablePrerequisites: option(list(Prerequisite.Increasable.t)),
    gr: int,
    enhancements: option(Enhancements.t),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let decode: list(string) => Json.Decode.decoder(option(t));
};
