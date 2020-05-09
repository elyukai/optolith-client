type t = {
  id: int,
  name: string,
  level: int,
  subject: int,
  description: string,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;

  type tL10n = {
    id: int,
    name: string,
    description: string,
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> field("description", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type tUniv = {
    id: int,
    level: int,
    subject: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    level: json |> field("level", int),
    subject: json |> field("subject", int),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      level: univ.level,
      subject: univ.subject,
      description: l10n.description,
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
      yamlData.focusRulesUniv |> list(tUniv),
      yamlData.focusRulesL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
