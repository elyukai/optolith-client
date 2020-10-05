module Static: {
  type t = {
    id: int,
    name: string,
    description: string,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let decode: Decoder.entryType(t);
};
