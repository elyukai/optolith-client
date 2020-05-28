[@genType]
[@genType.as "RaceVariant"]
type variant = {
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

[@genType]
[@genType.as "RaceWithVariantsOptions"]
type withVariants = {variants: Ley_IntMap.t(variant)};

[@genType]
[@genType.as "RaceWithoutVariantsOptions"]
type withoutVariants = {
  commonCultures: Ley_IntSet.t,
  hairColors: list(int),
  eyeColors: list(int),
  sizeBase: int,
  sizeRandom: list(Dice.t),
};

[@genType]
[@genType.as "RaceVariantOptions"]
type variantOptions =
  | WithVariants(withVariants)
  | WithoutVariants(withoutVariants);

[@genType]
[@genType.as "Race"]
type t = {
  id: int,
  name: string,
  cost: int,
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
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type variantL10n = {
    id: int,
    name: string,
    commonAdvantages: option(string),
    commonDisadvantages: option(string),
    uncommonAdvantages: option(string),
    uncommonDisadvantages: option(string),
  };

  let variantL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    commonAdvantages: json |> field("commonAdvantages", maybe(string)),
    commonDisadvantages: json |> field("commonDisadvantages", maybe(string)),
    uncommonAdvantages: json |> field("uncommonAdvantages", maybe(string)),
    uncommonDisadvantages:
      json |> field("uncommonDisadvantages", maybe(string)),
  };

  type tL10n = {
    id: int,
    name: string,
    attributeAdjustments: string,
    automaticAdvantages: option(string),
    stronglyRecommendedAdvantages: option(string),
    stronglyRecommendedDisadvantages: option(string),
    commonAdvantages: option(string),
    commonDisadvantages: option(string),
    uncommonAdvantages: option(string),
    uncommonDisadvantages: option(string),
    variants: option(list(variantL10n)),
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    attributeAdjustments: json |> field("attributeAdjustments", string),
    automaticAdvantages: json |> optionalField("automaticAdvantages", string),
    stronglyRecommendedAdvantages:
      json |> optionalField("stronglyRecommendedAdvantages", string),
    stronglyRecommendedDisadvantages:
      json |> optionalField("stronglyRecommendedDisadvantages", string),
    commonAdvantages: json |> optionalField("commonAdvantages", string),
    commonDisadvantages: json |> optionalField("commonDisadvantages", string),
    uncommonAdvantages: json |> optionalField("uncommonAdvantages", string),
    uncommonDisadvantages:
      json |> optionalField("uncommonDisadvantages", string),
    variants: json |> optionalField("variants", list(variantL10n)),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type variantUniv = {
    id: int,
    commonCultures: list(int),
    commonAdvantages: option(list(int)),
    commonDisadvantages: option(list(int)),
    uncommonAdvantages: option(list(int)),
    uncommonDisadvantages: option(list(int)),
    hairColors: list(int),
    eyeColors: list(int),
    sizeBase: int,
    sizeRandom: list(Dice.t),
  };

  let variantUniv = json => {
    id: json |> field("id", int),
    commonCultures: json |> field("commonCultures", list(int)),
    commonAdvantages: json |> field("commonAdvantages", maybe(list(int))),
    commonDisadvantages:
      json |> field("commonDisadvantages", maybe(list(int))),
    uncommonAdvantages:
      json |> field("uncommonAdvantages", maybe(list(int))),
    uncommonDisadvantages:
      json |> field("uncommonDisadvantages", maybe(list(int))),
    hairColors: json |> field("hairColors", list(int)),
    eyeColors: json |> field("eyeColors", list(int)),
    sizeBase: json |> field("sizeBase", int),
    sizeRandom: json |> field("sizeRandom", list(Dice.Decode.t)),
  };

  type withVariantsUniv = {variants: list(variantUniv)};

  let withVariantsUniv = json => {
    variants: json |> field("variants", list(variantUniv)),
  };

  type withoutVariantsUniv = {
    commonCultures: list(int),
    hairColors: list(int),
    eyeColors: list(int),
    sizeBase: int,
    sizeRandom: list(Dice.t),
  };

  let withoutVariantsUniv = json => {
    commonCultures: json |> field("commonCultures", list(int)),
    hairColors: json |> field("hairColors", list(int)),
    eyeColors: json |> field("eyeColors", list(int)),
    sizeBase: json |> field("sizeBase", int),
    sizeRandom: json |> field("sizeRandom", list(Dice.Decode.t)),
  };

  type variantOptionsUniv =
    | WithVariants(withVariantsUniv)
    | WithoutVariants(withoutVariantsUniv);

  let variantOptionsUniv =
    oneOf([
      json => json |> withVariantsUniv |> (x => WithVariants(x)),
      json => json |> withoutVariantsUniv |> (x => WithoutVariants(x)),
    ]);

  type tUniv = {
    id: int,
    cost: int,
    lp: int,
    spi: int,
    tou: int,
    mov: int,
    attributeAdjustments: option(list((int, int))),
    attributeAdjustmentsSelectionValue: int,
    attributeAdjustmentsSelectionList: list(int),
    automaticAdvantages: option(list(int)),
    stronglyRecommendedAdvantages: option(list(int)),
    stronglyRecommendedDisadvantages: option(list(int)),
    commonAdvantages: option(list(int)),
    commonDisadvantages: option(list(int)),
    uncommonAdvantages: option(list(int)),
    uncommonDisadvantages: option(list(int)),
    weightBase: int,
    weightRandom: list(Dice.t),
    variantOptions: variantOptionsUniv,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    lp: json |> field("lp", int),
    spi: json |> field("spi", int),
    tou: json |> field("tou", int),
    mov: json |> field("mov", int),
    attributeAdjustments:
      json |> field("attributeAdjustments", maybe(list(pair(int, int)))),
    attributeAdjustmentsSelectionValue:
      json |> field("attributeAdjustmentsSelectionValue", int),
    attributeAdjustmentsSelectionList:
      json |> field("attributeAdjustmentsSelectionList", list(int)),
    automaticAdvantages:
      json |> field("automaticAdvantages", maybe(list(int))),
    stronglyRecommendedAdvantages:
      json |> field("stronglyRecommendedAdvantages", maybe(list(int))),
    stronglyRecommendedDisadvantages:
      json |> field("stronglyRecommendedDisadvantages", maybe(list(int))),
    commonAdvantages: json |> field("commonAdvantages", maybe(list(int))),
    commonDisadvantages:
      json |> field("commonDisadvantages", maybe(list(int))),
    uncommonAdvantages:
      json |> field("uncommonAdvantages", maybe(list(int))),
    uncommonDisadvantages:
      json |> field("uncommonDisadvantages", maybe(list(int))),
    weightBase: json |> field("weightBase", int),
    weightRandom: json |> field("weightRandom", list(Dice.Decode.t)),
    variantOptions: json |> variantOptionsUniv,
  };

  let variant = (univ: variantUniv, l10n: variantL10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      commonCultures: univ.commonCultures |> Ley.IntSet.fromList,
      commonAdvantages: univ.commonAdvantages |> Ley.Option.fromOption([]),
      commonAdvantagesText: l10n.commonAdvantages,
      commonDisadvantages:
        univ.commonDisadvantages |> Ley.Option.fromOption([]),
      commonDisadvantagesText: l10n.commonDisadvantages,
      uncommonAdvantages:
        univ.uncommonAdvantages |> Ley.Option.fromOption([]),
      uncommonAdvantagesText: l10n.uncommonAdvantages,
      uncommonDisadvantages:
        univ.uncommonDisadvantages |> Ley.Option.fromOption([]),
      uncommonDisadvantagesText: l10n.uncommonDisadvantages,
      hairColors: univ.hairColors,
      eyeColors: univ.eyeColors,
      sizeBase: univ.sizeBase,
      sizeRandom: univ.sizeRandom,
    },
  );

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      cost: univ.cost,
      lp: univ.lp,
      spi: univ.spi,
      tou: univ.tou,
      mov: univ.mov,
      attributeAdjustments:
        univ.attributeAdjustments
        |> Ley.Option.option(Ley.IntMap.empty, Ley.IntMap.fromList),
      attributeAdjustmentsSelectionValue:
        univ.attributeAdjustmentsSelectionValue,
      attributeAdjustmentsSelectionList:
        univ.attributeAdjustmentsSelectionList |> Ley.IntSet.fromList,
      attributeAdjustmentsText: l10n.attributeAdjustments,
      automaticAdvantages:
        univ.automaticAdvantages |> Ley.Option.fromOption([]),
      automaticAdvantagesText: l10n.automaticAdvantages,
      stronglyRecommendedAdvantages:
        univ.stronglyRecommendedAdvantages |> Ley.Option.fromOption([]),
      stronglyRecommendedAdvantagesText: l10n.stronglyRecommendedAdvantages,
      stronglyRecommendedDisadvantages:
        univ.stronglyRecommendedDisadvantages |> Ley.Option.fromOption([]),
      stronglyRecommendedDisadvantagesText:
        l10n.stronglyRecommendedDisadvantages,
      commonAdvantages: univ.commonAdvantages |> Ley.Option.fromOption([]),
      commonAdvantagesText: l10n.commonAdvantages,
      commonDisadvantages:
        univ.commonDisadvantages |> Ley.Option.fromOption([]),
      commonDisadvantagesText: l10n.commonDisadvantages,
      uncommonAdvantages:
        univ.uncommonAdvantages |> Ley.Option.fromOption([]),
      uncommonAdvantagesText: l10n.uncommonDisadvantages,
      uncommonDisadvantages:
        univ.uncommonDisadvantages |> Ley.Option.fromOption([]),
      uncommonDisadvantagesText: l10n.uncommonDisadvantages,
      weightBase: univ.weightBase,
      weightRandom: univ.weightRandom,
      variantOptions:
        switch (univ.variantOptions) {
        | WithVariants(withVariants) =>
          WithVariants({
            variants:
              Yaml_Zip.zipBy(
                Ley.Int.show,
                variant,
                x => x.id,
                x => x.id,
                withVariants.variants,
                l10n.variants |> Ley.Option.fromOption([]),
              )
              |> Ley.IntMap.fromList,
          })
        | WithoutVariants(withoutVariants) =>
          WithoutVariants({
            commonCultures:
              withoutVariants.commonCultures |> Ley.IntSet.fromList,
            hairColors: withoutVariants.hairColors,
            eyeColors: withoutVariants.eyeColors,
            sizeBase: withoutVariants.sizeBase,
            sizeRandom: withoutVariants.sizeRandom,
          })
        },
      src: l10n.src,
      errata: l10n.errata,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Ley.Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.racesUniv |> list(tUniv),
      yamlData.racesL10n |> list(tL10n),
    )
    |> Ley.IntMap.fromList;
};
