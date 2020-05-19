[@genType]
[@genType.as "ApValue"]
type cost =
  | Flat(int)
  | PerLevel(list(int));

[@genType]
[@genType.as "Advantage"]
type t = {
  id: int,
  name: string,
  nameInWiki: option(string),
  noMaxAPInfluence: bool,
  isExclusiveToArcaneSpellworks: bool,
  levels: option(int),
  max: option(int),
  rules: string,
  selectOptions: Static_SelectOption.map,
  input: option(string),
  range: option(string),
  actions: option(string),
  prerequisites: Static_Prerequisites.tWithLevelDisAdv,
  prerequisitesText: option(string),
  prerequisitesTextIndex: Static_Prerequisites.tIndexWithLevel,
  prerequisitesTextStart: option(string),
  prerequisitesTextEnd: option(string),
  apValue: option(cost),
  apValueText: option(string),
  apValueTextAppend: option(string),
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
    nameInWiki: option(string),
    rules: string,
    selectOptions: option(list(Static_SelectOption.Decode.tL10n)),
    input: option(string),
    range: option(string),
    actions: option(string),
    prerequisites: option(string),
    prerequisitesIndex:
      option(Static_Prerequisites.Decode.tIndexWithLevelL10n),
    prerequisitesStart: option(string),
    prerequisitesEnd: option(string),
    apValue: option(string),
    apValueAppend: option(string),
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

  let cost =
    oneOf([
      json => json |> int |> (x => Flat(x)),
      json => json |> list(int) |> (x => PerLevel(x)),
    ]);

  type tUniv = {
    id: int,
    cost: option(cost),
    noMaxAPInfluence: option(bool),
    isExclusiveToArcaneSpellworks: option(bool),
    levels: option(int),
    max: option(int),
    selectOptionCategories:
      option(list(Static_SelectOption.Decode.categoryWithGroups)),
    selectOptions: option(list(Static_SelectOption.Decode.tUniv)),
    prerequisites: Static_Prerequisites.tWithLevelDisAdv,
    prerequisitesIndex:
      option(Static_Prerequisites.Decode.tIndexWithLevelUniv),
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
      noMaxAPInfluence: univ.noMaxAPInfluence |> Ley.Option.fromOption(false),
      isExclusiveToArcaneSpellworks:
        univ.isExclusiveToArcaneSpellworks |> Ley.Option.fromOption(false),
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
      Ley.Int.show,
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
      yamlData.advantagesUniv |> list(tUniv),
      yamlData.advantagesL10n |> list(tL10n),
    )
    |> Ley.IntMap.fromList;
};
