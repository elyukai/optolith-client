type t = {
  id: int,
  name: string,
  nameByTradition: IntMap.t(string),
  check: (int, int, int),
  effect: string,
  duration: string,
  durationShort: string,
  aeCost: string,
  aeCostShort: string,
  musictraditions: IntSet.t,
  property: int,
  ic: IC.t,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;

  let nameByTradition = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  type tL10n = {
    id: int,
    name: string,
    nameByTradition: list((int, string)),
    effect: string,
    duration: string,
    durationShort: string,
    aeCost: string,
    aeCostShort: string,
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    nameByTradition: json |> field("nameByTradition", list(nameByTradition)),
    effect: json |> field("effect", string),
    duration: json |> field("duration", string),
    durationShort: json |> field("durationShort", string),
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
    musictraditions: list(int),
    property: int,
    ic: IC.t,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    check1: json |> field("check1", int),
    check2: json |> field("check2", int),
    check3: json |> field("check3", int),
    musictraditions: json |> field("musictraditions", list(int)),
    property: json |> field("property", int),
    ic: json |> field("ic", IC.Decode.t),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      nameByTradition: l10n.nameByTradition |> IntMap.fromList,
      check: (univ.check1, univ.check2, univ.check3),
      effect: l10n.effect,
      duration: l10n.duration,
      durationShort: l10n.durationShort,
      aeCost: l10n.aeCost,
      aeCostShort: l10n.aeCostShort,
      musictraditions: univ.musictraditions |> IntSet.fromList,
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
      yamlData.magicalDancesUniv |> list(tUniv),
      yamlData.magicalDancesL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
