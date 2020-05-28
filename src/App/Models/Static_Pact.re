[@genType]
[@genType.as "PactCategory"]
type t = {
  id: int,
  name: string,
  types: Ley_IntMap.t(string),
  domains: Ley_IntMap.t(string),
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;

  let type_ = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let domain = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let t = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    types: json |> field("types", list(type_)) |> Ley.IntMap.fromList,
    domains: json |> field("domains", list(domain)) |> Ley.IntMap.fromList,
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.pactsL10n
    |> list(t)
    |> Ley.List.map(x => (x.id, x))
    |> Ley.IntMap.fromList;
};
