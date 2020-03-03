type t = {
  id: string,
  name: string,
  description: option(string),
  levelColumnDescription: option(string),
  levelDescriptions: (string, string, string, string),
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};
