type t = {
  id: string,
  name: string,
  short: string,
  calc: string,
  calcHalfPrimary: option(string),
  calcNoPrimary: option(string),
};

module Decode = {
  open JsonStrict;

  let t = json => {
    id: json |> field("id", string),
    name: json |> field("name", string),
    short: json |> field("short", string),
    calc: json |> field("calc", string),
    calcHalfPrimary: json |> optionalField("calcHalfPrimary", string),
    calcNoPrimary: json |> optionalField("calcNoPrimary", string),
  };

  let all = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.derivedCharacteristicsL10n
    |> list(t)
    |> Ley_List.map(x => (x.id, x))
    |> Ley_StrMap.fromList;
};
