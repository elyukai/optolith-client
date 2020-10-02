type t = {
  id: int,
  name: string,
  effect: string,
  range: string,
  duration: string,
  target: string,
  property: int,
  traditions: Ley_IntSet.t,
  activatablePrerequisites: option(list(Prerequisite.Activatable.t)),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

let decode: list(string) => Json.Decode.decoder(option(t));
