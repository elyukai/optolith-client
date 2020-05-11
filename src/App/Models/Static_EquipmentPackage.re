type t = {
  id: int,
  name: string,
  items: Ley.IntMap.t(int),
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: int,
    name: string,
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  let%private item = json => (
    json |> field("id", int),
    json |> optionalField("amount", int),
  );

  type tUniv = {
    id: int,
    items: list((int, option(int))),
  };

  let tUniv = json => {
    id: json |> field("id", int),
    items: json |> field("items", list(item)),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      items:
        Ley.IntMap.fromList(univ.items)
        |> Ley.IntMap.map(Ley.Option.fromOption(1)),
      src: l10n.src,
      errata: l10n.errata,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Ley.Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.equipmentPackagesUniv |> list(tUniv),
      yamlData.equipmentPackagesL10n |> list(tL10n),
    )
    |> Ley.IntMap.fromList;
};
