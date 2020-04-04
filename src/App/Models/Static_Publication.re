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
};
