type t = {
  id: int,
  name: string,
  description: Maybe.t(string),
  levelColumnDescription: Maybe.t(string),
  levelDescriptions: (string, string, string, string),
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  let t = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> optionalField("description", string),
    levelDescriptions: (
      json |> field("level1", string),
      json |> field("level2", string),
      json |> field("level3", string),
      json |> field("level4", string),
    ),
    levelColumnDescription: json |> optionalField("levelDescription", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.conditionsL10n
    |> list(t)
    |> ListH.map(x => (x.id, x))
    |> IntMap.fromList;
};
