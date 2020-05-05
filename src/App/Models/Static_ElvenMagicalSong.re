type t = {
  id: int,
  name: string,
  check: (int, int, int),
  checkMod: Maybe.t(CheckModifier.t),
  effect: string,
  aeCost: string,
  aeCostShort: string,
  skill: Maybe.t(int),
  property: int,
  ic: IC.t,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: int,
    name: string,
    effect: string,
    aeCost: string,
    aeCostShort: string,
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
    aeCost: json |> field("aeCost", string),
    aeCostShort: json |> field("aeCostShort", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type tUniv = {
    id: int,
    check1: int,
    check2: int,
    check3: int,
    checkMod: Maybe.t(CheckModifier.t),
    skill: Maybe.t(int),
    property: int,
    ic: IC.t,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    check1: json |> field("check1", int),
    check2: json |> field("check2", int),
    check3: json |> field("check3", int),
    checkMod: json |> optionalField("checkMod", CheckModifier.Decode.t),
    skill: json |> optionalField("skill", int),
    property: json |> field("property", int),
    ic: json |> field("ic", IC.Decode.t),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      check: (univ.check1, univ.check2, univ.check3),
      checkMod: univ.checkMod,
      effect: l10n.effect,
      aeCost: l10n.aeCost,
      aeCostShort: l10n.aeCostShort,
      skill: univ.skill,
      property: univ.property,
      ic: univ.ic,
      src: l10n.src,
      errata: l10n.errata,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.elvenMagicalSongsUniv |> list(tUniv),
      yamlData.elvenMagicalSongsL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
