[@genType "Erratum"]
type t = {
  date: Js.Date.t,
  description: string,
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  let t = json => {
    date: json |> field("id", date),
    description: json |> field("id", string),
  };

  let list = json =>
    json |> maybe(Json.Decode.list(t)) |> Maybe.fromMaybe([]);
};
