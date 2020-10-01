type t = {
  id: int,
  name: string,
  effect: string,
  range: string,
  duration: string,
  target: string,
  traditions: Ley_IntSet.t,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

let decode: list(string) => Json.Decode.decoder(option(t));
