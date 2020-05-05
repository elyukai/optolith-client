type t = {
  id: int,
  name: string,
  nameInWiki: Maybe.t(string),
  noMaxAPInfluence: bool,
  isExclusiveToArcaneSpellworks: bool,
  levels: Maybe.t(int),
  max: Maybe.t(int),
  rules: string,
  selectOptions: Static_SelectOption.map,
  input: Maybe.t(string),
  range: Maybe.t(string),
  actions: Maybe.t(string),
  prerequisites: Static_Prerequisites.tWithLevelDisAdv,
  prerequisitesText: Maybe.t(string),
  prerequisitesTextIndex: Static_Prerequisites.tIndexWithLevel,
  prerequisitesTextStart: Maybe.t(string),
  prerequisitesTextEnd: Maybe.t(string),
  apValue: Maybe.t(Static_Advantage.cost),
  apValueText: Maybe.t(string),
  apValueTextAppend: Maybe.t(string),
  gr: int,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: int,
    name: string,
    nameInWiki: Maybe.t(string),
    rules: string,
    selectOptions: Maybe.t(list(Static_SelectOption.Decode.tL10n)),
    input: Maybe.t(string),
    range: Maybe.t(string),
    actions: Maybe.t(string),
    prerequisites: Maybe.t(string),
    prerequisitesIndex:
      Maybe.t(Static_Prerequisites.Decode.tIndexWithLevelL10n),
    prerequisitesStart: Maybe.t(string),
    prerequisitesEnd: Maybe.t(string),
    apValue: Maybe.t(string),
    apValueAppend: Maybe.t(string),
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    nameInWiki: json |> optionalField("nameInWiki", string),
    rules: json |> field("rules", string),
    selectOptions:
      json
      |> optionalField(
           "selectOptions",
           list(Static_SelectOption.Decode.tL10n),
         ),
    input: json |> optionalField("input", string),
    range: json |> optionalField("range", string),
    actions: json |> optionalField("actions", string),
    prerequisites: json |> optionalField("prerequisites", string),
    prerequisitesIndex:
      json
      |> optionalField(
           "prerequisitesIndex",
           Static_Prerequisites.Decode.tIndexWithLevelL10n,
         ),
    prerequisitesStart: json |> optionalField("prerequisitesStart", string),
    prerequisitesEnd: json |> optionalField("prerequisitesEnd", string),
    apValue: json |> optionalField("apValue", string),
    apValueAppend: json |> optionalField("apValueAppend", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  let cost = Static_Advantage.Decode.cost;

  type tUniv = {
    id: int,
    cost: Maybe.t(Static_Advantage.cost),
    noMaxAPInfluence: Maybe.t(bool),
    isExclusiveToArcaneSpellworks: Maybe.t(bool),
    levels: Maybe.t(int),
    max: Maybe.t(int),
    selectOptionCategories:
      Maybe.t(list(Static_SelectOption.Decode.categoryWithGroups)),
    selectOptions: Maybe.t(list(Static_SelectOption.Decode.tUniv)),
    prerequisites: Static_Prerequisites.tWithLevelDisAdv,
    prerequisitesIndex:
      Maybe.t(Static_Prerequisites.Decode.tIndexWithLevelUniv),
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
           list(Static_SelectOption.Decode.categoryWithGroups),
         ),
    selectOptions:
      json
      |> optionalField(
           "selectOptions",
           list(Static_SelectOption.Decode.tUniv),
         ),
    prerequisites: json |> Static_Prerequisites.Decode.tWithLevelDisAdv,
    prerequisitesIndex:
      json
      |> optionalField(
           "prerequisitesIndex",
           Static_Prerequisites.Decode.tIndexWithLevelUniv,
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
        univ,
        l10n,
      ) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      nameInWiki: l10n.nameInWiki,
      noMaxAPInfluence: univ.noMaxAPInfluence |> Maybe.fromMaybe(false),
      isExclusiveToArcaneSpellworks:
        univ.isExclusiveToArcaneSpellworks |> Maybe.fromMaybe(false),
      levels: univ.levels,
      max: univ.max,
      rules: l10n.rules,
      selectOptions:
        univ.selectOptionCategories
        |> Static_SelectOption.Decode.resolveCategories(
             blessings,
             cantrips,
             combatTechniques,
             liturgicalChants,
             skills,
             spells,
           )
        |> Static_SelectOption.Decode.mergeSelectOptions(
             l10n.selectOptions,
             univ.selectOptions,
           ),
      input: l10n.input,
      range: l10n.range,
      actions: l10n.actions,
      prerequisites: univ.prerequisites,
      prerequisitesText: l10n.prerequisites,
      prerequisitesTextIndex:
        Static_Prerequisites.Decode.tIndexWithLevel(
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
      Int.show,
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
    |> IntMap.fromList;
};
