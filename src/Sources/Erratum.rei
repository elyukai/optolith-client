type t = {
  date: Js.Date.t,
  description: string,
};

let decodeList: Json.Decode.decoder(list(t));
