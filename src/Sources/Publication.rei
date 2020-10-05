type t = {
  id: int,
  name: string,
  short: string,
  isCore: bool,
  isAdultContent: bool,
};

let decode: Decoder.entryType(t);
