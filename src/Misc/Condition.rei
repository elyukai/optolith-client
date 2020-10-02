module Dynamic: {
  type value =
    | One
    | Two
    | Three
    | Four;

  type t = {
    id: int,
    value,
  };
};

module Static: {
  type t = {
    id: int,
    name: string,
    description: option(string),
    levelColumnDescription: option(string),
    levelDescriptions: (string, string, string, string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let decode: list(string) => Json.Decode.decoder(option(t));
};
