type t = {
  id: string,
  name: string,
  short: string,
  isCore: bool,
  isAdultContent: bool,
};

module Decode = {
  open Json.Decode;

  let t = json => {
    id: json |> field("id", string),
    name: json |> field("name", string),
    short: json |> field("short", string),
    isCore: json |> field("isCore", bool),
    isAdultContent: json |> field("isAdultContent", bool),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.booksL10n
    |> list(t)
    |> ListH.map(x => (x.id, x))
    |> StrMap.fromList;
};
