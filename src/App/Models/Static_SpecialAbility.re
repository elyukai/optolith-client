open GenericHelpers;

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
  nameInWiki: Maybe.t(string),
  levels: Maybe.t(int),
  max: Maybe.t(int),
  rules: Maybe.t(string),
  effect: Maybe.t(string),
  selectOptions: Static_SelectOption.map,
  input: Maybe.t(string),
  penalty: Maybe.t(string),
  combatTechniques: Maybe.t(combatTechniques),
  combatTechniquesText: Maybe.t(string),
  aeCost: Maybe.t(string),
  protectiveCircle: Maybe.t(string),
  wardingCircle: Maybe.t(string),
  volume: Maybe.t(string),
  bindingCost: Maybe.t(string),
  property: Maybe.t(int),
  propertyText: Maybe.t(string),
  aspect: Maybe.t(int),
  brew: Maybe.t(int),
  extended: Maybe.t(list(oneOrMany(int))),
  prerequisites: Static_Prerequisites.tWithLevel,
  prerequisitesText: Maybe.t(string),
  prerequisitesTextIndex: Static_Prerequisites.tIndexWithLevel,
  prerequisitesTextStart: Maybe.t(string),
  prerequisitesTextEnd: Maybe.t(string),
  apValue: Maybe.t(Static_Advantage.cost),
  apValueText: Maybe.t(string),
  apValueTextAppend: Maybe.t(string),
  gr: int,
  subgr: Maybe.t(int),
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;
  open GenericHelpers.Decode;

  type tL10n = {
    id: int,
    name: string,
    nameInWiki: Maybe.t(string),
    rules: Maybe.t(string),
    effect: Maybe.t(string),
    selectOptions: Maybe.t(list(Static_SelectOption.Decode.tL10n)),
    input: Maybe.t(string),
    penalty: Maybe.t(string),
    combatTechniques: Maybe.t(string),
    aeCost: Maybe.t(string),
    protectiveCircle: Maybe.t(string),
    wardingCircle: Maybe.t(string),
    volume: Maybe.t(string),
    bindingCost: Maybe.t(string),
    property: Maybe.t(string),
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
    rules: json |> optionalField("rules", string),
    effect: json |> optionalField("effect", string),
    selectOptions:
      json
      |> optionalField(
           "selectOptions",
           list(Static_SelectOption.Decode.tL10n),
         ),
    input: json |> optionalField("input", string),
    penalty: json |> optionalField("penalty", string),
    combatTechniques: json |> optionalField("combatTechniques", string),
    aeCost: json |> optionalField("aeCost", string),
    protectiveCircle: json |> optionalField("protectiveCircle", string),
    wardingCircle: json |> optionalField("wardingCircle", string),
    volume: json |> optionalField("volume", string),
    bindingCost: json |> optionalField("bindingCost", string),
    property: json |> optionalField("property", string),
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
    levels: Maybe.t(int),
    max: Maybe.t(int),
    selectOptionCategories:
      Maybe.t(list(Static_SelectOption.Decode.categoryWithGroups)),
    selectOptions: Maybe.t(list(Static_SelectOption.Decode.tUniv)),
    extended: Maybe.t(list(oneOrMany(int))),
    combatTechniques: Maybe.t(combatTechniques),
    property: Maybe.t(int),
    aspect: Maybe.t(int),
    brew: Maybe.t(int),
    prerequisites: Static_Prerequisites.tWithLevel,
    prerequisitesIndex:
      Maybe.t(Static_Prerequisites.Decode.tIndexWithLevelUniv),
    gr: int,
    subgr: Maybe.t(int),
  };

  let combatTechniques =
    oneOf([
      json => json |> list(int) |> (x => List(x)),
      json =>
        json
        |> int
        |> (
          x =>
            switch (x) {
            | 1 => All
            | 2 => Melee
            | 3 => Ranged
            | 4 => MeleeWithParry
            | 5 => OneHandedMelee
            | _ =>
              raise(
                DecodeError(
                  "Unknown combat technique category: " ++ Int.show(x),
                ),
              )
            }
        ),
    ]);

  let tUniv = json => {
    id: json |> field("id", int),
    cost: json |> optionalField("cost", cost),
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
    extended: json |> optionalField("extended", list(oneOrMany(int))),
    combatTechniques:
      json |> optionalField("combatTechniques", combatTechniques),
    property: json |> optionalField("property", int),
    aspect: json |> optionalField("aspect", int),
    brew: json |> optionalField("brew", int),
    prerequisites: json |> Static_Prerequisites.Decode.tWithLevel,
    prerequisitesIndex:
      json
      |> optionalField(
           "prerequisitesIndex",
           Static_Prerequisites.Decode.tIndexWithLevelUniv,
         ),
    gr: json |> field("gr", int),
    subgr: json |> optionalField("subgr", int),
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
      levels: univ.levels,
      max: univ.max,
      rules: l10n.rules,
      effect: l10n.effect,
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
      penalty: l10n.penalty,
      combatTechniques: univ.combatTechniques,
      combatTechniquesText: l10n.combatTechniques,
      aeCost: l10n.aeCost,
      protectiveCircle: l10n.protectiveCircle,
      wardingCircle: l10n.wardingCircle,
      volume: l10n.volume,
      bindingCost: l10n.bindingCost,
      property: univ.property,
      propertyText: l10n.property,
      aspect: univ.aspect,
      brew: univ.brew,
      extended: univ.extended,
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
      subgr: univ.subgr,
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
      yamlData.specialAbilitiesUniv |> list(tUniv),
      yamlData.specialAbilitiesL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
