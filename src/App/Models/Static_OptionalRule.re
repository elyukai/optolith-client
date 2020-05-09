type t = {
  id: int,
  name: string,
  description: string,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;

  let t = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    description: json |> field("description", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.optionalRulesL10n
    |> list(t)
    |> ListH.map(x => (x.id, x))
    |> IntMap.fromList;
};
