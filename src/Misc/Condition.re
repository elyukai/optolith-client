type t = {
  id: int,
  name: string,
  description: option(string),
  levelColumnDescription: option(string),
  levelDescriptions: (string, string, string, string),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
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
    src: json |> field("src", PublicationRef.decodeMultilingualList),
    errata: json |> field("errata", Erratum.Decode.list),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.conditionsL10n
    |> list(t)
    |> Ley_List.map(x => (x.id, x))
    |> Ley_IntMap.fromList;
};
