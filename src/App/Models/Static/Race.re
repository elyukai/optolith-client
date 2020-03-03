module Die = {
  type t = {
    amount: int,
    sides: int,
  };
};

module Variant = {
  type t = {
    id: string,
    name: string,
    commonCultures: list(string),
    commonAdvantages: list(string),
    commonAdvantagesText: option(string),
    commonDisadvantages: list(string),
    commonDisadvantagesText: option(string),
    uncommonAdvantages: list(string),
    uncommonAdvantagesText: option(string),
    uncommonDisadvantages: list(string),
    uncommonDisadvantagesText: option(string),
    hairColors: list(int),
    eyeColors: list(int),
    sizeBase: int,
    sizeRandom: list(Die.t),
  };
};

type t = {
  id: string,
  name: string,
  ap: int,
  lp: int,
  spi: int,
  tou: int,
  mov: int,
  attributeAdjustments: list((string, int)),
  attributeAdjustmentsSelection: (int, list(string)),
  attributeAdjustmentsText: string,
  commonCultures: list(string),
  automaticAdvantages: list(string),
  automaticAdvantagesText: option(string),
  stronglyRecommendedAdvantages: list(string),
  stronglyRecommendedAdvantagesText: option(string),
  stronglyRecommendedDisadvantages: list(string),
  stronglyRecommendedDisadvantagesText: option(string),
  commonAdvantages: list(string),
  commonAdvantagesText: option(string),
  commonDisadvantages: list(string),
  commonDisadvantagesText: option(string),
  uncommonAdvantages: list(string),
  uncommonAdvantagesText: option(string),
  uncommonDisadvantages: list(string),
  uncommonDisadvantagesText: option(string),
  hairColors: option(list(int)),
  eyeColors: option(list(int)),
  sizeBase: option(int),
  sizeRandom: option(list(Die.t)),
  weightBase: int,
  weightRandom: list(Die.t),
  variants: list(Variant.t),
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};
