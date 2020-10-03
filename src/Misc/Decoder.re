module type BaseType = {
  type t;
  let decode: list(string) => Json.Decode.decoder(t);
};

module type SubType = {
  type t;
  type multilingual;
  let decodeMultilingual: Json.Decode.decoder(multilingual);
  let resolveTranslations: (list(string), multilingual) => t;
};

module type SubTypeWrapper = {
  type t('a);
  let decodeMultilingual:
    Json.Decode.decoder('a) => Json.Decode.decoder(t('a));
  let resolveTranslations:
    (list(string), (list(string), 'a) => 'b, t('a)) => t('b);
};
