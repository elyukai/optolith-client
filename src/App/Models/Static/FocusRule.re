type t = {
  id: string,
  name: string,
  level: int,
  subject: int,
  description: string,
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};
