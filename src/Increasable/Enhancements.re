type level1 = {
  id: int,
  name: string,
  effect: string,
  cost: int,
};

type level2 = {
  id: int,
  name: string,
  effect: string,
  cost: int,
  requireLevel1: bool,
};

type level3Prerequisite =
  | First
  | Second;

type level3 = {
  id: int,
  name: string,
  effect: string,
  cost: int,
  requirePrevious: option(level3Prerequisite),
};

type t = {
  target: int,
  level1,
  level2,
  level3,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};
