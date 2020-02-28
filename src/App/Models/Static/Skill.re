module Application = {
  type t = {
    id: int,
    name: string,
    prerequisite: option(Prerequisites.ActivatablePrerequisite.t),
  };
};

module Use = {
  type t = {
    id: int,
    name: string,
    prerequisite: Prerequisites.ActivatablePrerequisite.t,
  };
};

type encumbrance =
  | True
  | False
  | Maybe;

type t = {
  id: string,
  name: string,
  check: list(string),
  encumbrance,
  encumbranceDescription: option(string),
  gr: int,
  ic: IC.t,
  applications: list(Application.t),
  applicationsInput: option(string),
  uses: list(Use.t),
  tools: option(string),
  quality: string,
  failed: string,
  critical: string,
  botch: string,
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};
