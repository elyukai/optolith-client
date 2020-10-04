type t = {
  id: int,
  name: string,
  short: string,
  isCore: bool,
  isAdultContent: bool,
};

let decode: list(string) => Json.Decode.decoder(option((int, t)));
