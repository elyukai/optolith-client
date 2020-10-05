type t = {
  id: int,
  name: string,
  numId: int,
  primary: int,
  aspects: option((int, int)),
};

let decode: Decoder.entryType(t);
