type cost =
  | Flat(int)
  | PerLevel(list(int));

// type t = {
//   id: int,
//   name: string,
//   cost,
//   noMaxAPInfluence: bool,
//   isExclusiveToArcaneSpellworks: bool,
//   input: Maybe.t(string),
//   max: Maybe.t(int),
//   levels: Maybe.t(int),
//   select: Maybe.t(list(SelectOption.t)),
//   rules: string,
//   range: Maybe.t(string),
//   actions: Maybe.t(string),
//   prerequisites: Prerequisites.tWithLevelDisAdv,
//   prerequisitesText: Maybe.t(string),
//   prerequisitesTextIndex: Maybe.t(Prerequisites.tIndexWithLevel),
//   prerequisitesTextStart: Maybe.t(string),
//   prerequisitesTextEnd: Maybe.t(string),
//   apValue: Maybe.t(string),
//   apValueAppend: Maybe.t(string),
//   gr: int,
//   src: list(SourceRef.t),
//   errata: list(Erratum.t),
// };

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

  type tUniv = {
    id: int,
    cost: Maybe.t(cost),
    noMaxAPInfluence: Maybe.t(bool),
    isExclusiveToArcaneSpellworks: Maybe.t(bool),
    levels: Maybe.t(int),
    max: Maybe.t(int),
    selectOptions: Maybe.t(list(Static_SelectOption.Decode.tUniv)),
    input: Maybe.t(string),
    rules: Maybe.t(string),
    range: Maybe.t(string),
    actions: Maybe.t(string),
    prerequisites: Static_Prerequisites.tWithLevelDisAdv,
    prerequisitesIndex: Maybe.t(Static_Prerequisites.tIndexWithLevel),
    gr: int,
  };
};
