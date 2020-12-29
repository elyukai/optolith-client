type t = {
  id: int;
  name: string;
  numId: int;
  primary: int;
  aspects: (int * int) option;
  restrictedBlessings: int list
}

module Decode = Json_Decode_Static.Make( struct
  module Translation = struct
    type t = {name: string}

    let t = json => JsonStrict.{name = json |> field("name", string)}
  end

  module TranslationMap = TranslationMap.Make(Translation)

  type multilingual = {
    id: int;
    levels: int;
    max: int;
    selectOptions: int;
    primary: int;
    aspects: option((int, int)),
    restrictedBlessings: list(int),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      numId: json |> field("numId", int),
      primary: json |> field("primary", int),
      aspects: json |> optionalField("aspects", tuple2(int, int)),
      restrictedBlessings:
        json
        |> optionalField("restrictedBlessings", list(int))
        |> Ley_Option.fromOption([]),
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
          numId: x.numId,
          primary: x.primary,
          aspects: x.aspects,
          restrictedBlessings: x.restrictedBlessings,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
end)
