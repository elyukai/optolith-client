type die = {
  amount: int,
  sides: int,
};

type variant = {
  id: int,
  name: string,
  commonCultures: IntSet.t,
  commonAdvantages: list(int),
  commonAdvantagesText: Maybe.t(string),
  commonDisadvantages: list(int),
  commonDisadvantagesText: Maybe.t(string),
  uncommonAdvantages: list(int),
  uncommonAdvantagesText: Maybe.t(string),
  uncommonDisadvantages: list(int),
  uncommonDisadvantagesText: Maybe.t(string),
  hairColors: list(int),
  eyeColors: list(int),
  sizeBase: int,
  sizeRandom: list(die),
};

type withVariants = {variants: IntMap.t(variant)};

type withoutVariants = {
  commonCultures: IntSet.t,
  hairColors: list(int),
  eyeColors: list(int),
  sizeBase: int,
  sizeRandom: list(die),
};

type variantOptions =
  | WithVariants(withVariants)
  | WithoutVariants(withoutVariants);

type t = {
  id: int,
  name: string,
  cost: int,
  lp: int,
  spi: int,
  tou: int,
  mov: int,
  attributeAdjustments: IntMap.t(int),
  attributeAdjustmentsSelectionValue: int,
  attributeAdjustmentsSelectionList: IntSet.t,
  attributeAdjustmentsText: string,
  automaticAdvantages: list(int),
  automaticAdvantagesText: Maybe.t(string),
  stronglyRecommendedAdvantages: list(int),
  stronglyRecommendedAdvantagesText: Maybe.t(string),
  stronglyRecommendedDisadvantages: list(int),
  stronglyRecommendedDisadvantagesText: Maybe.t(string),
  commonAdvantages: list(int),
  commonAdvantagesText: Maybe.t(string),
  commonDisadvantages: list(int),
  commonDisadvantagesText: Maybe.t(string),
  uncommonAdvantages: list(int),
  uncommonAdvantagesText: Maybe.t(string),
  uncommonDisadvantages: list(int),
  uncommonDisadvantagesText: Maybe.t(string),
  weightBase: int,
  weightRandom: list(die),
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
    commonAdvantages: Maybe.t(string),
    commonDisadvantages: Maybe.t(string),
    uncommonAdvantages: Maybe.t(string),
    uncommonDisadvantages: Maybe.t(string),
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
    automaticAdvantages: Maybe.t(string),
    stronglyRecommendedAdvantages: Maybe.t(string),
    stronglyRecommendedDisadvantages: Maybe.t(string),
    commonAdvantages: Maybe.t(string),
    commonDisadvantages: Maybe.t(string),
    uncommonAdvantages: Maybe.t(string),
    uncommonDisadvantages: Maybe.t(string),
    variants: Maybe.t(list(variantL10n)),
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

  let die = json => {
    amount: json |> field("amount", int),
    sides: json |> field("sides", int),
  };

  type variantUniv = {
    id: int,
    commonCultures: list(int),
    commonAdvantages: Maybe.t(list(int)),
    commonDisadvantages: Maybe.t(list(int)),
    uncommonAdvantages: Maybe.t(list(int)),
    uncommonDisadvantages: Maybe.t(list(int)),
    hairColors: list(int),
    eyeColors: list(int),
    sizeBase: int,
    sizeRandom: list(die),
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
    sizeRandom: json |> field("sizeRandom", list(die)),
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
    sizeRandom: list(die),
  };

  let withoutVariantsUniv = json => {
    commonCultures: json |> field("commonCultures", list(int)),
    hairColors: json |> field("hairColors", list(int)),
    eyeColors: json |> field("eyeColors", list(int)),
    sizeBase: json |> field("sizeBase", int),
    sizeRandom: json |> field("sizeRandom", list(die)),
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
    attributeAdjustments: Maybe.t(list((int, int))),
    attributeAdjustmentsSelectionValue: int,
    attributeAdjustmentsSelectionList: list(int),
    automaticAdvantages: Maybe.t(list(int)),
    stronglyRecommendedAdvantages: Maybe.t(list(int)),
    stronglyRecommendedDisadvantages: Maybe.t(list(int)),
    commonAdvantages: Maybe.t(list(int)),
    commonDisadvantages: Maybe.t(list(int)),
    uncommonAdvantages: Maybe.t(list(int)),
    uncommonDisadvantages: Maybe.t(list(int)),
    weightBase: int,
    weightRandom: list(die),
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
    weightRandom: json |> field("weightRandom", list(die)),
    variantOptions: json |> variantOptionsUniv,
  };

  let variant = (univ: variantUniv, l10n: variantL10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      commonCultures: univ.commonCultures |> IntSet.fromList,
      commonAdvantages: univ.commonAdvantages |> Maybe.fromMaybe([]),
      commonAdvantagesText: l10n.commonAdvantages,
      commonDisadvantages: univ.commonDisadvantages |> Maybe.fromMaybe([]),
      commonDisadvantagesText: l10n.commonDisadvantages,
      uncommonAdvantages: univ.uncommonAdvantages |> Maybe.fromMaybe([]),
      uncommonAdvantagesText: l10n.uncommonAdvantages,
      uncommonDisadvantages:
        univ.uncommonDisadvantages |> Maybe.fromMaybe([]),
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
        |> Maybe.maybe(IntMap.empty, IntMap.fromList),
      attributeAdjustmentsSelectionValue:
        univ.attributeAdjustmentsSelectionValue,
      attributeAdjustmentsSelectionList:
        univ.attributeAdjustmentsSelectionList |> IntSet.fromList,
      attributeAdjustmentsText: l10n.attributeAdjustments,
      automaticAdvantages: univ.automaticAdvantages |> Maybe.fromMaybe([]),
      automaticAdvantagesText: l10n.automaticAdvantages,
      stronglyRecommendedAdvantages:
        univ.stronglyRecommendedAdvantages |> Maybe.fromMaybe([]),
      stronglyRecommendedAdvantagesText: l10n.stronglyRecommendedAdvantages,
      stronglyRecommendedDisadvantages:
        univ.stronglyRecommendedDisadvantages |> Maybe.fromMaybe([]),
      stronglyRecommendedDisadvantagesText:
        l10n.stronglyRecommendedDisadvantages,
      commonAdvantages: univ.commonAdvantages |> Maybe.fromMaybe([]),
      commonAdvantagesText: l10n.commonAdvantages,
      commonDisadvantages: univ.commonDisadvantages |> Maybe.fromMaybe([]),
      commonDisadvantagesText: l10n.commonDisadvantages,
      uncommonAdvantages: univ.uncommonAdvantages |> Maybe.fromMaybe([]),
      uncommonAdvantagesText: l10n.uncommonDisadvantages,
      uncommonDisadvantages:
        univ.uncommonDisadvantages |> Maybe.fromMaybe([]),
      uncommonDisadvantagesText: l10n.uncommonDisadvantages,
      weightBase: univ.weightBase,
      weightRandom: univ.weightRandom,
      variantOptions:
        switch (univ.variantOptions) {
        | WithVariants(withVariants) =>
          WithVariants({
            variants:
              Yaml_Zip.zipBy(
                Int.show,
                variant,
                x => x.id,
                x => x.id,
                withVariants.variants,
                l10n.variants |> Maybe.fromMaybe([]),
              )
              |> IntMap.fromList,
          })
        | WithoutVariants(withoutVariants) =>
          WithoutVariants({
            commonCultures: withoutVariants.commonCultures |> IntSet.fromList,
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
      Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.racesUniv |> list(tUniv),
      yamlData.racesL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
