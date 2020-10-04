module Dynamic: ActivatableSkill.Dynamic;

module Static: {
  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    effect: string,
    cost: ActivatableSkill.MainParameter.t,
    duration: ActivatableSkill.MainParameter.t,
    tribes: Ley_IntSet.t,
    property: int,
    ic: IC.t,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let decode: list(string) => Json.Decode.decoder(option((int, t)));
};
