type t = {
  id: string,
  name: string,
  ic: IC.t,
  primary: list(string),
  special: option(string),
  hasNoParry: bool,
  bpr: int,
  gr: int,
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};
