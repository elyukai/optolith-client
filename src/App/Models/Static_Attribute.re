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
};
