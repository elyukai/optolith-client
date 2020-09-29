module Dynamic = {
  type t = {
    id: int,
    value: int,
    dependencies: list(Increasable.dependency),
  };

  let minValue = 8;

  let empty = id => {id, value: minValue, dependencies: []};

  let isEmpty = (x: t) =>
    x.value <= minValue && Ley_List.Foldable.null(x.dependencies);

  let getValueDef = Ley_Option.option(minValue, (x: t) => x.value);
};

module Static = {
  type t = {
    id: int,
    name: string,
    short: string,
  };

  module Translations = {
    type t = {
      name: string,
      short: string,
    };

    let decode = json =>
      Json.Decode.{
        name: json |> field("name", string),
        short: json |> field("short", string),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type full = {
    id: int,
    translations: TranslationMap.t,
  };

  let decodeFull = json =>
    Json.Decode.{
      id: json |> field("id", int),
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
          short: translation.short,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeFull |> resolveTranslations(langs);
};
