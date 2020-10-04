module Static: {
  type combatTechniques =
    | List(list(int))
    | All
    | Melee
    | Ranged
    | MeleeWithParry
    | OneHandedMelee;

  type t = {
    id: int,
    name: string,
    nameInWiki: option(string),
    levels: option(int),
    max: option(int),
    rules: option(string),
    effect: option(string),
    selectOptions: SelectOption.map,
    input: option(string),
    penalty: option(string),
    combatTechniques: option(combatTechniques),
    combatTechniquesText: option(string),
    aeCost: option(string),
    protectiveCircle: option(string),
    wardingCircle: option(string),
    volume: option(string),
    bindingCost: option(string),
    property: option(int),
    propertyText: option(string),
    aspect: option(int),
    brew: option(int),
    extended: option(list(OneOrMany.t(int))),
    prerequisites: Prerequisite.Collection.General.t,
    prerequisitesText: option(string),
    prerequisitesTextStart: option(string),
    prerequisitesTextEnd: option(string),
    apValue: option(Advantage.Static.apValue),
    apValueText: option(string),
    apValueTextAppend: option(string),
    gr: int,
    subgr: option(int),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

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

  /**
   * `modifyParsed` specifically modifies some parsed special abilities which
   * can't be applied by generic behavior and should be applied after the full
   * decoding.
   */
  let modifyParsed: Ley_IntMap.t(t) => Ley_IntMap.t(t);
};
