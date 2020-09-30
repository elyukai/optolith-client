type t = {
  date: Js.Date.t,
  description: string,
};

let decode = json =>
  Json.Decode.{
    date: json |> field("id", date),
    description: json |> field("id", string),
  };

let decodeList = json =>
  JsonStrict.(
    json |> maybe(Json.Decode.list(decode)) |> Ley_Option.fromOption([])
  );
