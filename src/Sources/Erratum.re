type t = {
  date: Js.Date.t,
  description: string,
};

module Decode = {
  let t = json =>
    Json.Decode.{
      date: json |> field("date", date),
      description: json |> field("description", string),
    };

  let list = json =>
    JsonStrict.(
      json |> maybe(Json.Decode.list(t)) |> Ley_Option.fromOption([])
    );
};
