module Dynamic: {
  type t =
    | Base(int)
    | WithVariant(int, int);
};

module Static: {
  module Variant: {
    type t = {
      id: int,
      name: string,
      commonCultures: Ley_IntSet.t,
      commonAdvantages: list(int),
      commonAdvantagesText: option(string),
      commonDisadvantages: list(int),
      commonDisadvantagesText: option(string),
      uncommonAdvantages: list(int),
      uncommonAdvantagesText: option(string),
      uncommonDisadvantages: list(int),
      uncommonDisadvantagesText: option(string),
      hairColors: list(int),
      eyeColors: list(int),
      sizeBase: int,
      sizeRandom: list(Dice.t),
    };
  };

  type variantOptions =
    | WithVariants({variants: Ley_IntMap.t(Variant.t)})
    | WithoutVariants({
        commonCultures: Ley_IntSet.t,
        hairColors: list(int),
        eyeColors: list(int),
        sizeBase: int,
        sizeRandom: list(Dice.t),
      });

  type t = {
    id: int,
    name: string,
    apValue: int,
    lp: int,
    spi: int,
    tou: int,
    mov: int,
    attributeAdjustments: Ley_IntMap.t(int),
    attributeAdjustmentsSelectionValue: int,
    attributeAdjustmentsSelectionList: Ley_IntSet.t,
    attributeAdjustmentsText: string,
    automaticAdvantages: list(int),
    automaticAdvantagesText: option(string),
    stronglyRecommendedAdvantages: list(int),
    stronglyRecommendedAdvantagesText: option(string),
    stronglyRecommendedDisadvantages: list(int),
    stronglyRecommendedDisadvantagesText: option(string),
    commonAdvantages: list(int),
    commonAdvantagesText: option(string),
    commonDisadvantages: list(int),
    commonDisadvantagesText: option(string),
    uncommonAdvantages: list(int),
    uncommonAdvantagesText: option(string),
    uncommonDisadvantages: list(int),
    uncommonDisadvantagesText: option(string),
    weightBase: int,
    weightRandom: list(Dice.t),
    variantOptions,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};
