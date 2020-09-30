type partialTranslations('a) = Js.Dict.t(Js.Json.t);
type translations('a) = Js.Dict.t('a);

module type Decodable = {
  type t;
  let decode: Json.Decode.decoder(t);
};

module Make = (Decodable: Decodable) => {
  type t = partialTranslations(Decodable.t);

  let decode = Json.Decode.(dict(id));

  let getFromLanguageOrder = (langs, x: t) =>
    langs
    |> Ley_List.Foldable.foldl(
         (acc, lang) =>
           Ley_Option.Alternative.(
             Ley_Option.Functor.(
               acc <|> (Js.Dict.get(x, lang) <&> Decodable.decode)
             )
           ),
         None,
       );
};
