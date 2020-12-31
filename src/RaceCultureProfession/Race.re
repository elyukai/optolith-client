module Dynamic = {
  type t =
    | Base(int)
    | WithVariant(int, int);
};

module Static = {
  module Variant = {
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

    module Decode = {
      module Translation = {
        type t = {
          name: string,
          commonAdvantages: option(string),
          commonDisadvantages: option(string),
          uncommonAdvantages: option(string),
          uncommonDisadvantages: option(string),
        };

        let t = json =>
          Json_Decode_Strict.{
            name: json |> field("name", string),
            commonAdvantages:
              json |> optionalField("commonAdvantages", string),
            commonDisadvantages:
              json |> optionalField("commonDisadvantages", string),
            uncommonAdvantages:
              json |> optionalField("uncommonAdvantages", string),
            uncommonDisadvantages:
              json |> optionalField("uncommonDisadvantages", string),
          };
      };

      module TranslationMap = TranslationMap.Make(Translation);

      type multilingual = {
        id: int,
        commonCultures: Ley_IntSet.t,
        commonAdvantages: list(int),
        commonDisadvantages: list(int),
        uncommonAdvantages: list(int),
        uncommonDisadvantages: list(int),
        hairColors: list(int),
        eyeColors: list(int),
        sizeBase: int,
        sizeRandom: list(Dice.t),
        translations: TranslationMap.t,
      };

      let multilingual = json =>
        Json_Decode_Strict.{
          id: json |> field("id", int),
          commonCultures:
            json |> field("commonCultures", list(int)) |> Ley_IntSet.fromList,
          commonAdvantages:
            json
            |> optionalField("commonAdvantages", list(int))
            |> Ley_Option.fromOption([]),
          commonDisadvantages:
            json
            |> optionalField("commonDisadvantages", list(int))
            |> Ley_Option.fromOption([]),
          uncommonAdvantages:
            json
            |> optionalField("uncommonAdvantages", list(int))
            |> Ley_Option.fromOption([]),
          uncommonDisadvantages:
            json
            |> optionalField("uncommonDisadvantages", list(int))
            |> Ley_Option.fromOption([]),
          hairColors: json |> field("hairColors", list(int)),
          eyeColors: json |> field("eyeColors", list(int)),
          sizeBase: json |> field("sizeBase", int),
          sizeRandom: json |> field("sizeRandom", list(Dice.Decode.t)),
          translations:
            json |> field("translations", TranslationMap.Decode.t),
        };

      let multilingualAssoc = json =>
        json |> multilingual |> (variant => (variant.id, variant));

      let resolveTranslations = (langs, x) =>
        Ley_Option.Infix.(
          x.translations
          |> TranslationMap.Decode.getFromLanguageOrder(langs)
          <&> (
            translation => {
              id: x.id,
              name: translation.name,
              commonCultures: x.commonCultures,
              commonAdvantages: x.commonAdvantages,
              commonAdvantagesText: translation.commonAdvantages,
              commonDisadvantages: x.commonDisadvantages,
              commonDisadvantagesText: translation.commonDisadvantages,
              uncommonAdvantages: x.uncommonAdvantages,
              uncommonAdvantagesText: translation.uncommonAdvantages,
              uncommonDisadvantages: x.uncommonDisadvantages,
              uncommonDisadvantagesText: translation.uncommonDisadvantages,
              hairColors: x.hairColors,
              eyeColors: x.eyeColors,
              sizeBase: x.sizeBase,
              sizeRandom: x.sizeRandom,
            }
          )
        );
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
    startingAge: Ley_IntMap.t((int, Dice.t)),
    variantOptions,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        attributeAdjustments: string,
        automaticAdvantages: option(string),
        stronglyRecommendedAdvantages: option(string),
        stronglyRecommendedDisadvantages: option(string),
        commonAdvantages: option(string),
        commonDisadvantages: option(string),
        uncommonAdvantages: option(string),
        uncommonDisadvantages: option(string),
        errata: option(list(Erratum.t)),
      };

      let t = json =>
        Json_Decode_Strict.{
          name: json |> field("name", string),
          attributeAdjustments: json |> field("attributeAdjustments", string),
          automaticAdvantages:
            json |> optionalField("automaticAdvantages", string),
          stronglyRecommendedAdvantages:
            json |> optionalField("stronglyRecommendedAdvantages", string),
          stronglyRecommendedDisadvantages:
            json |> optionalField("stronglyRecommendedDisadvantages", string),
          commonAdvantages: json |> optionalField("commonAdvantages", string),
          commonDisadvantages:
            json |> optionalField("commonDisadvantages", string),
          uncommonAdvantages:
            json |> optionalField("uncommonAdvantages", string),
          uncommonDisadvantages:
            json |> optionalField("uncommonDisadvantages", string),
          errata: json |> optionalField("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type variantOptionsMultilingual =
      | WithVariants({variants: Ley_IntMap.t(Variant.Decode.multilingual)})
      | WithoutVariants({
          commonCultures: Ley_IntSet.t,
          hairColors: list(int),
          eyeColors: list(int),
          sizeBase: int,
          sizeRandom: list(Dice.t),
        });

    type multilingual = {
      id: int,
      apValue: int,
      lp: int,
      spi: int,
      tou: int,
      mov: int,
      attributeAdjustments: Ley_IntMap.t(int),
      attributeAdjustmentsSelectionValue: int,
      attributeAdjustmentsSelectionList: Ley_IntSet.t,
      automaticAdvantages: list(int),
      stronglyRecommendedAdvantages: list(int),
      stronglyRecommendedDisadvantages: list(int),
      commonAdvantages: list(int),
      commonDisadvantages: list(int),
      uncommonAdvantages: list(int),
      uncommonDisadvantages: list(int),
      weightBase: int,
      weightRandom: list(Dice.t),
      startingAge: Ley_IntMap.t((int, Dice.t)),
      variantOptions: variantOptionsMultilingual,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let variantOptionsMultilingual =
      Json_Decode_Strict.(
        field("type", string)
        |> andThen(
             fun
             | "WithVariants" =>
               field("value", (json) =>
                 (
                   WithVariants({
                     variants:
                       json
                       |> field(
                            "variants",
                            list(Variant.Decode.multilingualAssoc),
                          )
                       |> Ley_IntMap.fromList,
                   }): variantOptionsMultilingual
                 )
               )
             | "WithoutVariants" =>
               field("value", json =>
                 WithoutVariants({
                   commonCultures:
                     json
                     |> field("commonCultures", list(int))
                     |> Ley_IntSet.fromList,
                   hairColors: json |> field("hairColors", list(int)),
                   eyeColors: json |> field("eyeColors", list(int)),
                   sizeBase: json |> field("sizeBase", int),
                   sizeRandom:
                     json |> field("sizeRandom", list(Dice.Decode.t)),
                 })
               )
             | str => raise(DecodeError("Unknown variant options: " ++ str)),
           )
      );

    let multilingual = json =>
      Json_Decode_Strict.{
        id: json |> field("id", int),
        apValue: json |> field("apValue", int),
        lp: json |> field("lp", int),
        spi: json |> field("spi", int),
        tou: json |> field("tou", int),
        mov: json |> field("mov", int),
        attributeAdjustments:
          json
          |> optionalField("attributeAdjustments", list(pair(int, int)))
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        attributeAdjustmentsSelectionValue:
          json |> field("attributeAdjustmentsSelectionValue", int),
        attributeAdjustmentsSelectionList:
          json
          |> field("attributeAdjustmentsSelectionList", list(int))
          |> Ley_IntSet.fromList,
        automaticAdvantages:
          json
          |> optionalField("automaticAdvantages", list(int))
          |> Ley_Option.fromOption([]),
        stronglyRecommendedAdvantages:
          json
          |> optionalField("stronglyRecommendedAdvantages", list(int))
          |> Ley_Option.fromOption([]),
        stronglyRecommendedDisadvantages:
          json
          |> optionalField("stronglyRecommendedDisadvantages", list(int))
          |> Ley_Option.fromOption([]),
        commonAdvantages:
          json
          |> optionalField("commonAdvantages", list(int))
          |> Ley_Option.fromOption([]),
        commonDisadvantages:
          json
          |> optionalField("commonDisadvantages", list(int))
          |> Ley_Option.fromOption([]),
        uncommonAdvantages:
          json
          |> optionalField("uncommonAdvantages", list(int))
          |> Ley_Option.fromOption([]),
        uncommonDisadvantages:
          json
          |> optionalField("uncommonDisadvantages", list(int))
          |> Ley_Option.fromOption([]),
        weightBase: json |> field("weightBase", int),
        weightRandom: json |> field("weightRandom", list(Dice.Decode.t)),
        startingAge:
          json
          |> field(
               "startingAge",
               list(json =>
                 (
                   json |> field("experienceLevelId", int),
                   (
                     json |> field("base", int),
                     json |> field("random", Dice.Decode.t),
                   ),
                 )
               ),
             )
          |> Ley_IntMap.fromList,
        variantOptions:
          json |> field("typeSpecific", variantOptionsMultilingual),
        src: json |> field("src", PublicationRef.Decode.multilingualList),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            apValue: x.apValue,
            lp: x.lp,
            spi: x.spi,
            tou: x.tou,
            mov: x.mov,
            attributeAdjustments: x.attributeAdjustments,
            attributeAdjustmentsSelectionValue:
              x.attributeAdjustmentsSelectionValue,
            attributeAdjustmentsSelectionList:
              x.attributeAdjustmentsSelectionList,
            attributeAdjustmentsText: translation.attributeAdjustments,
            automaticAdvantages: x.automaticAdvantages,
            automaticAdvantagesText: translation.automaticAdvantages,
            stronglyRecommendedAdvantages: x.stronglyRecommendedAdvantages,
            stronglyRecommendedAdvantagesText:
              translation.stronglyRecommendedAdvantages,
            stronglyRecommendedDisadvantages:
              x.stronglyRecommendedDisadvantages,
            stronglyRecommendedDisadvantagesText:
              translation.stronglyRecommendedDisadvantages,
            commonAdvantages: x.commonAdvantages,
            commonAdvantagesText: translation.commonAdvantages,
            commonDisadvantages: x.commonDisadvantages,
            commonDisadvantagesText: translation.commonDisadvantages,
            uncommonAdvantages: x.uncommonAdvantages,
            uncommonAdvantagesText: translation.uncommonDisadvantages,
            uncommonDisadvantages: x.uncommonDisadvantages,
            uncommonDisadvantagesText: translation.uncommonDisadvantages,
            weightBase: x.weightBase,
            weightRandom: x.weightRandom,
            startingAge: x.startingAge,
            variantOptions:
              switch (x.variantOptions) {
              | WithVariants(options) =>
                WithVariants({
                  variants:
                    Ley_IntMap.mapMaybe(
                      Variant.Decode.resolveTranslations(langs),
                      options.variants,
                    ),
                })
              | WithoutVariants({
                  commonCultures,
                  hairColors,
                  eyeColors,
                  sizeBase,
                  sizeRandom,
                }) =>
                WithoutVariants({
                  commonCultures,
                  hairColors,
                  eyeColors,
                  sizeBase,
                  sizeRandom,
                })
              },
            src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
            errata: translation.errata |> Ley_Option.fromOption([]),
          }
        )
      );

    let t = (langs, json) =>
      json |> multilingual |> resolveTranslations(langs);

    let toAssoc = (x: t) => (x.id, x);

    let assoc = Decoder.decodeAssoc(t, toAssoc);
  };
};
