type t = {
  id: int,
  name: string,
  numId: int,
  primary: int,
  aspects: option((int, int)),
};

let decode: list(string) => Json.Decode.decoder(option(t));
