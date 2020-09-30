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
  prerequisites: Prerequisite.tWithLevelDisAdv,
  prerequisitesText: option(string),
  prerequisitesTextIndex: Prerequisite.tIndexWithLevel,
  prerequisitesTextStart: option(string),
  prerequisitesTextEnd: option(string),
  apValue: option(Advantage.cost),
  apValueText: option(string),
  apValueTextAppend: option(string),
  gr: int,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: int,
    name: string,
    nameInWiki: option(string),
    rules: string,
    selectOptions: option(list(SelectOption.Decode.tL10n)),
    input: option(string),
    range: option(string),
    actions: option(string),
    prerequisites: option(string),
    prerequisitesIndex: option(Prerequisite.Decode.tIndexWithLevelL10n),
    prerequisitesStart: option(string),
    prerequisitesEnd: option(string),
    apValue: option(string),
    apValueAppend: option(string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    nameInWiki: json |> optionalField("nameInWiki", string),
    rules: json |> field("rules", string),
    selectOptions:
      json |> optionalField("selectOptions", list(SelectOption.Decode.tL10n)),
    input: json |> optionalField("input", string),
    range: json |> optionalField("range", string),
    actions: json |> optionalField("actions", string),
    prerequisites: json |> optionalField("prerequisites", string),
    prerequisitesIndex:
      json
      |> optionalField(
           "prerequisitesIndex",
           Prerequisite.Decode.tIndexWithLevelL10n,
         ),
    prerequisitesStart: json |> optionalField("prerequisitesStart", string),
    prerequisitesEnd: json |> optionalField("prerequisitesEnd", string),
    apValue: json |> optionalField("apValue", string),
    apValueAppend: json |> optionalField("apValueAppend", string),
    src: json |> field("src", PublicationRef.decodeMultilingualList),
    errata: json |> field("errata", Erratum.Decode.list),
  };

  let cost = Advantage.Decode.cost;

  type tUniv = {
    id: int,
    cost: option(Advantage.cost),
    noMaxAPInfluence: option(bool),
    isExclusiveToArcaneSpellworks: option(bool),
    levels: option(int),
    max: option(int),
    selectOptionCategories:
      option(list(SelectOption.Decode.categoryWithGroups)),
    selectOptions: option(list(SelectOption.Decode.tUniv)),
    prerequisites: Prerequisite.tWithLevelDisAdv,
    prerequisitesIndex: option(Prerequisite.Decode.tIndexWithLevelUniv),
    gr: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    cost: json |> optionalField("cost", cost),
    noMaxAPInfluence: json |> optionalField("noMaxAPInfluence", bool),
    isExclusiveToArcaneSpellworks:
      json |> optionalField("isExclusiveToArcaneSpellworks", bool),
    levels: json |> optionalField("levels", int),
    max: json |> optionalField("max", int),
    selectOptionCategories:
      json
      |> optionalField(
           "selectOptionCategories",
           list(SelectOption.Decode.categoryWithGroups),
         ),
    selectOptions:
      json |> optionalField("selectOptions", list(SelectOption.Decode.tUniv)),
    prerequisites: json |> Prerequisite.Decode.tWithLevelDisAdv,
    prerequisitesIndex:
      json
      |> optionalField(
           "prerequisitesIndex",
           Prerequisite.Decode.tIndexWithLevelUniv,
         ),
    gr: json |> field("gr", int),
  };

  let t =
      (
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
        univ: tUniv,
        l10n: tL10n,
      ) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      nameInWiki: l10n.nameInWiki,
      noMaxAPInfluence: univ.noMaxAPInfluence |> Ley_Option.fromOption(false),
      isExclusiveToArcaneSpellworks:
        univ.isExclusiveToArcaneSpellworks |> Ley_Option.fromOption(false),
      levels: univ.levels,
      max: univ.max,
      rules: l10n.rules,
      selectOptions:
        univ.selectOptionCategories
        |> SelectOption.Decode.resolveCategories(
             blessings,
             cantrips,
             combatTechniques,
             liturgicalChants,
             skills,
             spells,
           )
        |> SelectOption.Decode.mergeSelectOptions(
             l10n.selectOptions,
             univ.selectOptions,
           ),
      input: l10n.input,
      range: l10n.range,
      actions: l10n.actions,
      prerequisites: univ.prerequisites,
      prerequisitesText: l10n.prerequisites,
      prerequisitesTextIndex:
        Prerequisite.Decode.tIndexWithLevel(
          univ.prerequisitesIndex,
          l10n.prerequisitesIndex,
        ),
      prerequisitesTextStart: l10n.prerequisitesStart,
      prerequisitesTextEnd: l10n.prerequisitesEnd,
      apValue: univ.cost,
      apValueText: l10n.apValue,
      apValueTextAppend: l10n.apValueAppend,
      gr: univ.gr,
      src: l10n.src,
      errata: l10n.errata,
    },
  );

  let all =
      (
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
        yamlData: Yaml_Raw.yamlData,
      ) =>
    Yaml_Zip.zipBy(
      Ley_Int.show,
      t(
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
      ),
      x => x.id,
      x => x.id,
      yamlData.disadvantagesUniv |> list(tUniv),
      yamlData.disadvantagesL10n |> list(tL10n),
    )
    |> Ley_IntMap.fromList;
};
