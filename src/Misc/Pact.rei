module Dynamic: {
  type domain =
    | Predefined(int)
    | Custom(string);

  type t = {
    category: int,
    level: int,
    type_: int,
    domain,
    name: string,
  };
};

module Static: {
  type t = {
    id: int,
    name: string,
    types: Ley_IntMap.t(string),
    domains: Ley_IntMap.t(string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let decode: Decoder.entryType(t);
};
