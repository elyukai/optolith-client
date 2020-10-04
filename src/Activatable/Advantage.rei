module Static: {
  type apValue =
    | Flat(int)
    | PerLevel(list(int));

  type t = {
    id: int,
    name: string,
    nameInWiki: option(string),
    noMaxAPInfluence: bool,
    isExclusiveToArcaneSpellworks: bool,
    levels: option(int),
    max: option(int),
    rules: string,
    selectOptions: SelectOption.map,
    input: option(string),
    range: option(string),
    actions: option(string),
    prerequisites: Prerequisite.Collection.AdvantageDisadvantage.t,
    prerequisitesText: option(string),
    prerequisitesTextStart: option(string),
    prerequisitesTextEnd: option(string),
    apValue: option(apValue),
    apValueText: option(string),
    apValueTextAppend: option(string),
    gr: int,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let decodeApValue: Json.Decode.decoder(apValue);

  let decode:
    (
      list(string),
      Ley_IntMap.t(Blessing.Static.t),
      Ley_IntMap.t(Cantrip.Static.t),
      Ley_IntMap.t(CombatTechnique.Static.t),
      Ley_IntMap.t(LiturgicalChant.Static.t),
      Ley_IntMap.t(Skill.Static.t),
      Ley_IntMap.t(Spell.Static.t)
    ) =>
    Json.Decode.decoder(option((int, t)));
};
