type t = {
  id: int,
  name: string,
  ic: IC.t,
  primary: list(int),
  special: Maybe.t(string),
  hasNoParry: bool,
  bpr: int,
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
    special: Maybe.t(string),
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    special: json |> optionalField("special", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type tUniv = {
    id: int,
    ic: IC.t,
    primary: list(int),
    bpr: int,
    hasNoParry: Maybe.t(bool),
    gr: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    ic: json |> field("ic", IC.Decode.t),
    primary: json |> field("primary", list(int)),
    bpr: json |> field("bpr", int),
    hasNoParry: json |> optionalField("hasNoParry", bool),
    gr: json |> field("gr", int),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      ic: univ.ic,
      primary: univ.primary,
      special: l10n.special,
      hasNoParry: Maybe.fromMaybe(false, univ.hasNoParry),
      bpr: univ.bpr,
      gr: univ.gr,
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
      yamlData.combatTechniquesUniv |> list(tUniv),
      yamlData.combatTechniquesL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
