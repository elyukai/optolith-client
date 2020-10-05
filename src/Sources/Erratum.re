type t = {
  date: Js.Date.t,
  description: string,
};

module Decode = {
  let t = json =>
    Json.Decode.{
      date: json |> field("id", date),
      description: json |> field("id", string),
    };

  let list = json =>
    JsonStrict.(
      json |> maybe(Json.Decode.list(t)) |> Ley_Option.fromOption([])
    );
};
