[@gentype]
type t = {
  id: string,
  name: string,
  description: string,
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};
