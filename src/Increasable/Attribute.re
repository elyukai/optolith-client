type t = {
  id: int,
  name: string,
  short: string,
};

module Decode = {
  open Json.Decode;

  let t = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    short: json |> field("short", string),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.attributesL10n
    |> list(t)
    |> Ley_List.map(x => (x.id, x))
    |> Ley_IntMap.fromList;
};
