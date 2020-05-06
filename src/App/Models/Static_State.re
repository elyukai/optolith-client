type t = {
  id: int,
  name: string,
  description: Maybe.t(string),
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
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.statesL10n
    |> list(t)
    |> ListH.map(x => (x.id, x))
    |> IntMap.fromList;
};
