type t = {
  id: int,
  name: string,
  maxLevel: option(int),
  specializations: Ley_IntMap.t(string),
  specializationInput: option(string),
  continent: int,
  isExtinct: bool,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  module Specialization = {
    module Translation = {
      type t = string;

      let t = json => JsonStrict.(json |> field("name", string));
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      Json.Decode.{
        id: json |> field("id", int),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let multilingualAssoc = json => json |> multilingual |> (x => (x.id, x));
  };

  module Translation = {
    type t = {
      name: string,
      specializationInput: option(string),
      errata: list(Erratum.t),
    };

    let t = json =>
      JsonStrict.{
        name: json |> field("name", string),
        specializationInput: json |> optionalField("description", string),
        errata: json |> field("errata", Erratum.Decode.list),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    maxLevel: option(int),
    specializations: Ley_IntMap.t(Specialization.multilingual),
    continent: int,
    isExtinct: bool,
    src: list(PublicationRef.Decode.multilingual),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      maxLevel: json |> optionalField("maxLevel", int),
      specializations:
        json
        |> optionalField(
             "specializations",
             list(Specialization.multilingualAssoc),
           )
        |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
      continent: json |> field("continent", int),
      isExtinct: json |> field("isExtinct", bool),
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
          maxLevel: x.maxLevel,
          specializations:
            x.specializations
            |> Ley_IntMap.mapMaybe(
                 (specialization: Specialization.multilingual) =>
                 specialization.translations
                 |> Specialization.TranslationMap.Decode.getFromLanguageOrder(
                      langs,
                    )
               ),
          specializationInput: translation.specializationInput,
          continent: x.continent,
          isExtinct: x.isExtinct,
          src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
