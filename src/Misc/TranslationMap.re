type partialTranslations('a) = Js.Dict.t(Js.Json.t);
type translations('a) = Js.Dict.t('a);

module type Decodable = {
  type t;
  let t: Json.Decode.decoder(t);
};

module Make = (Decodable: Decodable) => {
  type t = partialTranslations(Decodable.t);

  module Decode = {
    let t = Json.Decode.(dict(id));

    let getFromLanguageOrder = (langs: Locale.order, x: t) =>
      langs
      |> Locale.toList
      |> Ley_List.foldl(
           (acc, lang) =>
             Ley_Option.Infix.(
               acc <|> (Js.Dict.get(x, lang) <&> Decodable.t)
             ),
           None,
         );

    let getFromLanguageOrderWith =
        (pred: Decodable.t => bool, langs: Locale.order, x: t) =>
      langs
      |> Locale.toList
      |> Ley_List.foldl(
           (acc, lang) =>
             Ley_Option.Infix.(
               acc
               <|> (Js.Dict.get(x, lang) <&> Decodable.t)
               >>= Ley_Option.ensure(pred)
             ),
           None,
         );
  };
};
