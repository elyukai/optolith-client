type translations('a) = Js.Dict.t('a);

module type Decodable = {
  type t;
  let decode: Json.Decode.decoder(t);
};

module Make = (Decodable: Decodable) => {
  type t = translations(Decodable.t);

  let decode = Json.Decode.dict(Decodable.decode);

  let getFromLanguageOrder = (langs, x: t) =>
    langs
    |> Ley_List.Foldable.foldl(
         (acc, lang) =>
           Ley_Option.Alternative.(acc <|> Js.Dict.get(x, lang)),
         None,
       );
};
