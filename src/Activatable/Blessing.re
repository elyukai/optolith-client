type t = {
  id: int,
  name: string,
  effect: string,
  range: string,
  duration: string,
  target: string,
  traditions: Ley_IntSet.t,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Translations = {
  type t = {
    name: string,
    effect: string,
    range: string,
    duration: string,
    target: string,
    errata: list(Erratum.t),
  };

  let decode = json =>
    JsonStrict.{
      name: json |> field("name", string),
      effect: json |> field("effect", string),
      range: json |> field("range", string),
      duration: json |> field("duration", string),
      target: json |> field("target", string),
      errata: json |> field("errata", Erratum.decodeList),
    };
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  traditions: Ley_IntSet.t,
  src: list(PublicationRef.multilingual),
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  JsonStrict.{
    id: json |> field("id", int),
    traditions:
      json |> field("traditions", list(int)) |> Ley_IntSet.fromList,
    src: json |> field("src", PublicationRef.decodeMultilingualList),
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Functor.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (
      translation => {
        id: x.id,
        name: translation.name,
        effect: translation.effect,
        range: translation.range,
        duration: translation.duration,
        target: translation.target,
        traditions: x.traditions,
        src: PublicationRef.resolveTranslationsList(langs, x.src),
        errata: translation.errata,
      }
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
